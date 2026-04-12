'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/useToast'
import { usePopup } from '@/hooks/usePopup'
import {
  useCreateGroupBenefitMutation,
  useDeleteGroupBenefitMutation,
  useGetGroupBenefitsQuery,
  useGetGroupDetailQuery,
  useUpdateGroupBenefitMutation,
} from '@/services/api/groupsApi'
import { extractApiErrorMessage } from '@/services/api/baseApi'
import type { CreateGroupBenefitBody, GroupBenefit, UpdateGroupBenefitBody } from '@/types/api'
import { AddBenefitDialog } from './components/addBenefitDialog'
import { BenefitsTable } from './components/benefitsTable'

type GroupBenefitsScreenProps = {
  groupId: string
}

export function GroupBenefitsScreen({ groupId }: GroupBenefitsScreenProps) {
  const router = useRouter()
  const safeGroupId = groupId.trim()
  const { showConfirm, Popup } = usePopup()

  const { data: group, isLoading: isGroupLoading, error: groupError } = useGetGroupDetailQuery(
    { groupId: safeGroupId },
    { skip: !safeGroupId },
  )

  const {
    data: benefits,
    isLoading: isBenefitsLoading,
    isFetching: isBenefitsFetching,
    error: benefitsError,
  } = useGetGroupBenefitsQuery(
    { groupId: safeGroupId },
    { skip: !safeGroupId },
  )

  const [createBenefit] = useCreateGroupBenefitMutation()
  const [updateBenefit] = useUpdateGroupBenefitMutation()
  const [deleteBenefit] = useDeleteGroupBenefitMutation()

  useEffect(() => {
    if (groupError) {
      toast({
        variant: 'destructive',
        title: 'Không tải được thông tin group',
        description: extractApiErrorMessage(groupError, 'Đã có lỗi xảy ra'),
      })
    }
  }, [groupError])

  useEffect(() => {
    if (benefitsError) {
      toast({
        variant: 'destructive',
        title: 'Không tải được danh sách benefit',
        description: extractApiErrorMessage(benefitsError, 'Đã có lỗi xảy ra'),
      })
    }
  }, [benefitsError])

  const handleCreateBenefit = async (payload: CreateGroupBenefitBody) => {
    try {
      await createBenefit({ groupId: safeGroupId, data: payload }).unwrap()
      toast({
        title: 'Tạo benefit thành công',
        description: 'Benefit mới đã được thêm vào group.',
      })
    } catch (createError) {
      toast({
        variant: 'destructive',
        title: 'Không tạo được benefit',
        description: extractApiErrorMessage(createError, 'Đã có lỗi xảy ra'),
      })
      throw createError
    }
  }

  const handleUpdateBenefit = async (benefitId: string, payload: UpdateGroupBenefitBody) => {
    try {
      await updateBenefit({ groupId: safeGroupId, benefitId, data: payload }).unwrap()
      toast({
        title: 'Cập nhật benefit thành công',
        description: 'Thông tin benefit đã được cập nhật.',
      })
    } catch (updateError) {
      toast({
        variant: 'destructive',
        title: 'Không cập nhật được benefit',
        description: extractApiErrorMessage(updateError, 'Đã có lỗi xảy ra'),
      })
      throw updateError
    }
  }

  const handleDeleteBenefit = async (benefit: GroupBenefit) => {
    const accepted = await showConfirm({
      title: 'Xác nhận xóa benefit',
      description: `Bạn có chắc chắn muốn xóa benefit "${benefit.benefitName}"? Hành động này không thể hoàn tác.`,
      confirmText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
      destructive: true,
    })

    if (!accepted) {
      return
    }

    try {
      await deleteBenefit({ groupId: safeGroupId, benefitId: benefit.id }).unwrap()
      toast({
        title: 'Đã xóa benefit',
        description: 'Benefit đã được xóa khỏi group.',
      })
    } catch (deleteError) {
      toast({
        variant: 'destructive',
        title: 'Không xóa được benefit',
        description: extractApiErrorMessage(deleteError, 'Đã có lỗi xảy ra'),
      })
    }
  }

  const benefitItems = benefits ?? []

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Button type="button" variant="outline" onClick={() => router.push('/groups')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại groups
          </Button>
          <h2 className="text-base font-medium">Benefit của group: {group?.title || 'Đang tải...'}</h2>
        </div>

        <AddBenefitDialog onAdd={handleCreateBenefit} />
      </div>

      <div className="bg-surface-1 border border-border rounded-[14px] overflow-hidden relative">
        {!isGroupLoading && !isBenefitsLoading && benefitItems.length === 0 ? (
          <div className="px-6 py-16 text-center space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-surface-2 border border-border grid place-items-center text-muted-foreground">
              <Gift className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold">Chưa có benefit nào</h3>
            <p className="text-sm text-muted-foreground">Group này chưa được cấu hình benefit. Hãy thêm benefit đầu tiên cho group.</p>
          </div>
        ) : (
          <BenefitsTable
            benefits={benefitItems}
            isLoading={isGroupLoading || isBenefitsLoading}
            isFetching={isBenefitsFetching}
            onEdit={handleUpdateBenefit}
            onDelete={handleDeleteBenefit}
          />
        )}

        {isBenefitsFetching && !isBenefitsLoading ? (
          <p className="px-5 pb-4 text-sm text-muted-foreground">Đang đồng bộ danh sách benefit...</p>
        ) : null}
      </div>

      <Popup />
    </div>
  )
}

export default GroupBenefitsScreen
