"use client";

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { INITIAL_PUBLISHED_POSTS, type PublishedPost } from './constants'
import PublishedPostTable from './components/PublishedPostTable'
import PublishedPostDetailModal from './components/PublishedPostDetailModal'
import PublishedPostRequestModal from './components/PublishedPostRequestModal'

export default function AdminPublishedPostScreen() {
  const [posts, setPosts] = useState<PublishedPost[]>(INITIAL_PUBLISHED_POSTS)
  const [selectedPost, setSelectedPost] = useState<PublishedPost | null>(null)
  
  // States for Gửi yêu cầu xử lý modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [reasoningPost, setReasoningPost] = useState<PublishedPost | null>(null)

  const [currentPage, setCurrentPage] = useState(1)

  // Triggered when row click or action button is clicked
  const handleActionClick = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation()
    const targetPost = posts.find((p) => p.id === postId)
    if (targetPost) {
      setReasoningPost(targetPost)
      setIsRequestModalOpen(true)
    }
  }

  // Triggered when "Yêu cầu xử lý" is clicked inside the detail modal
  const handleDetailRequestProcess = (targetPost: PublishedPost) => {
    setSelectedPost(null) // close detail modal
    setReasoningPost(targetPost)
    setIsRequestModalOpen(true)
  }

  // Triggered when submitting request reasoning modal
  const handleReasonSubmit = (postId: string, reason: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, actionType: 'sent', actionStatusText: 'Chờ admin duyệt' }
          : post,
      ),
    )
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
      {/* Top Header */}
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

      {/* Main Table Container */}
      <div className="bg-[#171717] rounded-2xl p-6 border border-[#282828] space-y-6 flex flex-col justify-between min-h-[600px]">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white leading-7">Danh sách tin đã đăng</h2>

          {/* Render Table */}
          <PublishedPostTable
            posts={posts}
            onRowClick={(post) => setSelectedPost(post)}
            onActionClick={handleActionClick}
            getCategoryBadgeClass={getCategoryBadgeClass}
            getCategoryDotClass={getCategoryDotClass}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Render Detail Modal */}
      <PublishedPostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onRequestProcess={handleDetailRequestProcess}
        getCategoryBadgeClass={getCategoryBadgeClass}
        getCategoryDotClass={getCategoryDotClass}
      />

      {/* Render Yêu cầu xử lý Reasoning Modal */}
      <PublishedPostRequestModal
        post={reasoningPost}
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false)
          setReasoningPost(null)
        }}
        onSubmit={handleReasonSubmit}
      />
    </div>
  )
}
