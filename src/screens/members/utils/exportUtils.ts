import * as XLSX from "xlsx";
import type { MemberItem } from "@/types/api";
import { formatVnd } from "@/lib/formatMoney";

function fullName(member: MemberItem) {
  return `${member.telegramFirstName ?? ""} ${member.telegramLastName ?? ""}`.trim() || member.telegramUsername || "";
}

function formatLpexUserStatusValue(status: string) {
  switch ((status || "").toLowerCase()) {
    case "active":
      return "Hoạt động";
    case "inactive":
      return "Không hoạt động";
    default:
      return "Không xác định";
  }
}

function formatVerificationStatus(status: MemberItem["memberProgressStatus"]) {
  switch (status) {
    case "KYC_COMPLETED":
      return "Đã KYC";
    case "DEPOSIT_COMPLETED":
      return "Đã deposit";
    case "TRADE_COMPLETED":
      return "Đã giao dịch";
    case "NOT_KYC":
    default:
      return "Chưa KYC";
  }
}

function formatGroups(member: MemberItem) {
  const groups = member.eligibleGroups || [];
  if (!groups.length) return "—";
  return groups.map((group) => `- ${group.title || "—"}`).join("\n");
}

function toWorkbook(members: MemberItem[]) {
  const rows = members.map((member) => ({
    "Tên member": fullName(member),
    "Telegram username": member.telegramUsername ? `@${member.telegramUsername}` : "—",
    "Groups": formatGroups(member),
    "Volume 30D": `${formatVnd(member.usdVolume)} VNĐ`,
    "Trạng thái": formatLpexUserStatusValue(member.lpexUserStatus || "unknown"),
    "Xác minh": formatVerificationStatus(member.memberProgressStatus),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: false });

  const headers = Object.keys(rows[0] ?? {
    "Tên member": "",
    "Telegram username": "",
    "Groups": "",
    "Volume 30D": "",
    "Trạng thái": "",
    "Xác minh": "",
  });

  const maxLenByCol = headers.map((header) => header.length);

  rows.forEach((row) => {
    headers.forEach((header, colIndex) => {
      const raw = String((row as Record<string, unknown>)[header] ?? "");
      const lineMax = raw
        .split("\n")
        .reduce((acc, line) => Math.max(acc, line.length), 0);
      maxLenByCol[colIndex] = Math.max(maxLenByCol[colIndex], lineMax);
    });
  });

  worksheet["!cols"] = maxLenByCol.map((len) => ({ wch: Math.min(80, len + 2) }));

  const groupColIndex = headers.indexOf("Groups");
  if (groupColIndex >= 0) {
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let rowIndex = 1; rowIndex <= range.e.r; rowIndex += 1) {
      const address = XLSX.utils.encode_cell({ r: rowIndex, c: groupColIndex });
      const cell = worksheet[address];
      if (!cell) continue;

      cell.s = {
        ...(cell.s ?? {}),
        alignment: {
          ...((cell.s as { alignment?: Record<string, unknown> } | undefined)?.alignment ?? {}),
          wrapText: true,
          vertical: "top",
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
  return workbook;
}

function workbookToBlob(workbook: XLSX.WorkBook) {
  const data = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true });
  const arrayBuffer = data instanceof ArrayBuffer ? data : new Uint8Array(data).buffer;
  return new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

async function saveBlobWithPicker(blob: Blob, fileName: string) {
  const win = window as Window & {
    showSaveFilePicker?: (options: {
      suggestedName: string;
      types: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<{
      createWritable: () => Promise<{
        write: (data: Blob) => Promise<void>;
        close: () => Promise<void>;
      }>;
    }>;
  };

  if (!win.showSaveFilePicker) {
    return false;
  }

  const handle = await win.showSaveFilePicker({
    suggestedName: fileName,
    types: [
      {
        description: "Excel Workbook",
        accept: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        },
      },
    ],
  });

  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
  return true;
}

function fallbackBrowserDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.setAttribute("download", fileName);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function exportMembersToExcel(members: MemberItem[]): Promise<boolean> {
  const workbook = toWorkbook(members);
  const blob = workbookToBlob(workbook);
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const fileName = `members_${stamp}.xlsx`;

  const savedByPicker = await saveBlobWithPicker(blob, fileName);
  if (savedByPicker) {
    return true;
  }

  fallbackBrowserDownload(blob, fileName);
  return false;
}
