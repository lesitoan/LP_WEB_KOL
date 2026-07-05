"use client";

import React, { useState } from 'react'
import { type PublishedPost } from './constants'
import PublishedPostTable from './components/PublishedPostTable'
import PublishedPostDetailModal from './components/PublishedPostDetailModal'
import PublishedPostRequestModal from './components/PublishedPostRequestModal'
import { usePublishedPostActions } from './hooks/usePublishedPostActions'
import { usePublishedPostData } from './hooks/usePublishedPostData'

export default function AdminPublishedPostScreen() {
  const [selectedPost, setSelectedPost] = useState<PublishedPost | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [reasoningPost, setReasoningPost] = useState<PublishedPost | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const publishedPostData = usePublishedPostData(currentPage)
  const publishedPostActions = usePublishedPostActions({
    onSubmitted: publishedPostData.refetch,
  })

  const handleActionClick = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation()
    const targetPost = publishedPostData.posts.find((post) => post.id === postId)
    if (targetPost) {
      setReasoningPost(targetPost)
      setIsRequestModalOpen(true)
    }
  }

  const handleDetailRequestProcess = (targetPost: PublishedPost) => {
    setSelectedPost(null)
    setReasoningPost(targetPost)
    setIsRequestModalOpen(true)
  }

  const handleReasonSubmit = async (postId: string, reason: string) => {
    return publishedPostActions.submitActionRequest(postId, reason)
  }

  const getCategoryBadgeClass = (colorType: string) => {
    switch (colorType) {
      case 'error':
        return 'bg-[#5C120C] text-[#F5827A]'
      case 'blue-light':
        return 'bg-[#0F2D4A] text-[#54A3FF]'
      case 'warning':
        return 'bg-[#4D2C03] text-[#FAB55A]'
      case 'success':
        return 'bg-[#06301C] text-[#60CF9B]'
      default:
        return 'bg-[#282828] text-white'
    }
  }

  const getCategoryDotClass = (colorType: string) => {
    switch (colorType) {
      case 'error':
        return 'bg-[#F5827A]'
      case 'blue-light':
        return 'bg-[#54A3FF]'
      case 'warning':
        return 'bg-[#FAB55A]'
      case 'success':
        return 'bg-[#60CF9B]'
      default:
        return 'bg-white'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-end items-start gap-6">
          <div className="flex flex-col items-start justify-start">
            <h1 className="text-2xl font-medium text-white leading-[31.2px]">
              Tin đã đăng
            </h1>
            <p className="text-sm text-[#828283] font-normal leading-[21px] mt-1">
              Tin đang/đã phân phối tới KOL · nhấn 1 dòng để đọc full nội dung · gửi yêu cầu xử lý khi phát hiện rủi ro
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#171717] rounded-2xl p-6 border border-[#282828] space-y-6 flex flex-col justify-between min-h-[600px]">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white leading-7">Danh sách tin đã đăng</h2>

          <PublishedPostTable
            posts={publishedPostData.posts}
            onRowClick={(post) => setSelectedPost(post)}
            onActionClick={handleActionClick}
            getCategoryBadgeClass={getCategoryBadgeClass}
            getCategoryDotClass={getCategoryDotClass}
            pagination={publishedPostData.pagination}
            onPageChange={setCurrentPage}
            isLoading={publishedPostData.isLoading}
          />
        </div>
      </div>

      <PublishedPostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onRequestProcess={handleDetailRequestProcess}
        getCategoryBadgeClass={getCategoryBadgeClass}
        getCategoryDotClass={getCategoryDotClass}
      />

      <PublishedPostRequestModal
        post={reasoningPost}
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false)
          setReasoningPost(null)
        }}
        onSubmit={handleReasonSubmit}
        isSubmitting={publishedPostActions.isSubmittingActionRequest}
      />
    </div>
  )
}
