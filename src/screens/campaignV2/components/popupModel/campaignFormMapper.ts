import type {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
} from "@/types/api/campaignV2";
import { formatVnd } from "@/lib/formatMoney";
import type { CampaignFormValues } from "./schema";
import { defaultCampaignFormValues } from "./schema";

function toDatetimeLocalInput(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

function toTimeInput(hour?: number | null, minute?: number | null) {
  if (hour == null || minute == null) return "09:00";
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function toIsoDatetime(datetimeStr: string) {
  if (!datetimeStr) return "";
  const hasSeconds = datetimeStr.length > 16;
  return `${datetimeStr}${hasSeconds ? "" : ":00"}+07:00`;
}

function parseTime(time?: string) {
  if (!time) return { hour: null, minute: null };
  const [hour, minute] = time.split(":").map((item) => Number(item));
  return {
    hour: Number.isFinite(hour) ? hour : null,
    minute: Number.isFinite(minute) ? minute : null,
  };
}

function formatRewardLabel(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const normalized = trimmed.replace(/[^\d]/g, "");
  if (!normalized) return trimmed;
  return `${formatVnd(normalized)} VNĐ`;
}

function rewardValueFromLabel(label?: string) {
  if (!label) return "";
  const digits = label.replace(/[^\d]/g, "");
  return digits || label;
}

function buildRewards(values: CampaignFormValues) {
  return [
    { rankFrom: 1, rankTo: 1, label: formatRewardLabel(values.rank1) },
    { rankFrom: 2, rankTo: 2, label: formatRewardLabel(values.rank2) },
    { rankFrom: 3, rankTo: 3, label: formatRewardLabel(values.rank3) },
  ].filter((reward) => reward.label);
}

function buildAnnouncement(values: CampaignFormValues) {
  const needsTime = values.announceFrequency === "DAILY" || values.announceFrequency === "WEEKLY";
  const needsDay = values.announceFrequency === "WEEKLY";
  const { hour, minute } = parseTime(values.announceTime);

  return {
    announceFrequency: values.announceFrequency,
    announceHour: needsTime ? hour : null,
    announceMinute: needsTime ? minute : null,
    announceDayOfWeek: needsDay && values.announceDayOfWeek
      ? Number(values.announceDayOfWeek)
      : null,
  };
}

function buildBasePayload(values: CampaignFormValues) {
  return {
    name: values.name.trim(),
    description: values.description?.trim() || null,
    rankingType: values.rankingType,
    scopeType: values.telegramGroupId === "ALL_GROUPS" ? "ALL_GROUPS" : "SINGLE_GROUP",
    telegramGroupId: values.telegramGroupId === "ALL_GROUPS" ? null : values.telegramGroupId,
    startAt: toIsoDatetime(values.startAt),
    endAt: toIsoDatetime(values.endAt),
    rewards: buildRewards(values),
    ...buildAnnouncement(values),
  } satisfies Omit<CreateCampaignRequest, "status">;
}

export function buildCreateCampaignPayload(values: CampaignFormValues): CreateCampaignRequest {
  return {
    ...buildBasePayload(values),
    status: "DRAFT",
  };
}

export function buildUpdateCampaignPayload(values: CampaignFormValues): UpdateCampaignRequest {
  return buildBasePayload(values);
}

function isSameDateTime(a?: string | null, b?: string | null) {
  if (!a && !b) return true;
  if (!a || !b) return false;

  const aTime = new Date(a).getTime();
  const bTime = new Date(b).getTime();
  return Number.isFinite(aTime) && Number.isFinite(bTime) && aTime === bTime;
}

function isSameRewards(
  a: UpdateCampaignRequest["rewards"],
  b: Campaign["rewards"],
) {
  const normalize = (rewards: Campaign["rewards"] = []) =>
    rewards
      .map((reward) => ({
        rankFrom: reward.rankFrom,
        rankTo: reward.rankTo,
        label: reward.label,
      }))
      .sort((left, right) => left.rankFrom - right.rankFrom || left.rankTo - right.rankTo);

  return JSON.stringify(normalize(a ?? [])) === JSON.stringify(normalize(b ?? []));
}

export function buildChangedUpdateCampaignPayload(
  values: CampaignFormValues,
  campaign: Campaign,
): UpdateCampaignRequest {
  const nextPayload = buildUpdateCampaignPayload(values);
  const changedPayload: UpdateCampaignRequest = {};

  if (nextPayload.name !== campaign.name) {
    changedPayload.name = nextPayload.name;
  }

  if ((nextPayload.description ?? null) !== (campaign.description ?? null)) {
    changedPayload.description = nextPayload.description;
  }

  if (nextPayload.rankingType !== campaign.rankingType) {
    changedPayload.rankingType = nextPayload.rankingType;
  }

  if (nextPayload.scopeType !== campaign.scopeType) {
    changedPayload.scopeType = nextPayload.scopeType;
  }

  if ((nextPayload.telegramGroupId ?? null) !== (campaign.telegramGroupId ?? null)) {
    changedPayload.telegramGroupId = nextPayload.telegramGroupId;
  }

  if (!isSameDateTime(nextPayload.startAt, campaign.startAt)) {
    changedPayload.startAt = nextPayload.startAt;
  }

  if (!isSameDateTime(nextPayload.endAt, campaign.endAt)) {
    changedPayload.endAt = nextPayload.endAt;
  }

  if (!isSameRewards(nextPayload.rewards, campaign.rewards)) {
    changedPayload.rewards = nextPayload.rewards;
  }

  if (nextPayload.announceFrequency !== campaign.announceFrequency) {
    changedPayload.announceFrequency = nextPayload.announceFrequency;
  }

  if ((nextPayload.announceHour ?? null) !== (campaign.announceHour ?? null)) {
    changedPayload.announceHour = nextPayload.announceHour;
  }

  if ((nextPayload.announceMinute ?? null) !== (campaign.announceMinute ?? null)) {
    changedPayload.announceMinute = nextPayload.announceMinute;
  }

  if ((nextPayload.announceDayOfWeek ?? null) !== (campaign.announceDayOfWeek ?? null)) {
    changedPayload.announceDayOfWeek = nextPayload.announceDayOfWeek;
  }

  return changedPayload;
}

export function campaignToFormValues(campaign?: Campaign | null): CampaignFormValues {
  if (!campaign) return defaultCampaignFormValues;

  const rewards = [...campaign.rewards].sort((a, b) => a.rankFrom - b.rankFrom);
  const findReward = (rank: number) =>
    rewards.find((reward) => reward.rankFrom <= rank && reward.rankTo >= rank)?.label;

  return {
    ...defaultCampaignFormValues,
    name: campaign.name,
    description: campaign.description ?? "",
    startAt: toDatetimeLocalInput(campaign.startAt),
    endAt: toDatetimeLocalInput(campaign.endAt),
    rankingType: campaign.rankingType,
    telegramGroupId: campaign.telegramGroupId || "ALL_GROUPS",
    rank1: rewardValueFromLabel(findReward(1)),
    rank2: rewardValueFromLabel(findReward(2)),
    rank3: rewardValueFromLabel(findReward(3)),
    announceFrequency: campaign.announceFrequency,
    announceDayOfWeek:
      campaign.announceDayOfWeek == null ? "1" : String(campaign.announceDayOfWeek),
    announceTime: toTimeInput(campaign.announceHour, campaign.announceMinute),
  };
}
