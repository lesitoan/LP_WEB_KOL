import GroupBenefitsScreen from '@/screens/groups/benefits'

type GroupBenefitsPageProps = {
  params: Promise<{
    idGroup: string
  }>
}

export default async function GroupBenefitsPage({ params }: GroupBenefitsPageProps) {
  const { idGroup } = await params
  return <GroupBenefitsScreen groupId={idGroup} />
}
