import GroupMembersScreen from "@/screens/groups/members";

export default async function Page({ params }: { params: Promise<{ idGroup: string }> }) {
  const { idGroup } = await params;
  return <GroupMembersScreen groupId={idGroup} />;
}
