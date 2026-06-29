"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MOCK_POSTS, type ReviewPost, type PostCategory } from './constants'
import ReviewPostCard from './components/ReviewPostCard'
import PostDetailEditor from './components/PostDetailEditor'
import CreatePostModal from './components/CreatePostModal'
import { cn } from '@/lib/utils'

interface ArrowState {
  left: boolean
  right: boolean
}

function getArrowState(element: HTMLElement | null): ArrowState {
  if (!element) return { left: false, right: false }
  const { scrollLeft, scrollWidth, clientWidth } = element
  return {
    left: scrollLeft > 0,
    right: scrollLeft + clientWidth < scrollWidth - 4,
  }
}

export default function AdminPostReviewScreen() {
  const [posts, setPosts] = useState<ReviewPost[]>(MOCK_POSTS)
  const [activeTab, setActiveTab] = useState<'pending' | 'processed'>('pending')
  const [selectedPostId, setSelectedPostId] = useState<string>('1')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const listScrollRef = useRef<HTMLDivElement>(null)
  const listScrollTargetRef = useRef<number | null>(null)
  const [listArrows, setListArrows] = useState<ArrowState>({ left: false, right: false })

  // Filter posts based on active tab
  const filteredPosts = posts.filter((post) => post.status === activeTab)

  // Find currently selected post
  const selectedPost = posts.find((post) => post.id === selectedPostId)

  // Calculate counts for badges
  const pendingCount = posts.filter((post) => post.status === 'pending').length
  const processedCount = posts.filter((post) => post.status === 'processed').length

  const updateListArrows = useCallback(() => {
    setListArrows(getArrowState(listScrollRef.current))
  }, [])

  useEffect(() => {
    listScrollRef.current?.scrollTo({ left: 0 })
    listScrollTargetRef.current = 0
    const timer = setTimeout(updateListArrows, 120)
    return () => clearTimeout(timer)
  }, [activeTab, filteredPosts.length, updateListArrows])

  useEffect(() => {
    const handleResize = () => {
      listScrollTargetRef.current = null
      updateListArrows()
    }
    const timer = setTimeout(handleResize, 120)
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateListArrows])

  const handleListScroll = (direction: 'left' | 'right') => {
    const container = listScrollRef.current
    if (!container) return

    const firstItem = container.firstElementChild as HTMLElement | null
    const gap = Number.parseFloat(window.getComputedStyle(container).columnGap || '0')
    const step = firstItem ? firstItem.clientWidth + gap : container.clientWidth

    if (listScrollTargetRef.current === null) {
      listScrollTargetRef.current = container.scrollLeft
    }

    listScrollTargetRef.current += direction === 'right' ? step : -step

    const maxScroll = container.scrollWidth - container.clientWidth
    listScrollTargetRef.current = Math.max(0, Math.min(maxScroll, listScrollTargetRef.current))

    container.scrollTo({
      left: listScrollTargetRef.current,
      behavior: 'smooth',
    })
  }

  const handleSelectPost = (id: string) => {
    setSelectedPostId(id)
  }

  const handleSaveDraft = (updatedPost: ReviewPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
  }

  const handlePublish = (updatedPost: ReviewPost) => {
    const published = {
      ...updatedPost,
      status: 'processed' as const,
      subStatus: 'published' as const,
      author: 'Admin 01',
    }
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? published : p)))
    // Switch to processed tab or select another pending post
    const remainingPending = filteredPosts.filter((p) => p.id !== updatedPost.id)
    if (remainingPending.length > 0) {
      setSelectedPostId(remainingPending[0].id)
    } else {
      setActiveTab('processed')
      setSelectedPostId(updatedPost.id)
    }
  }

  const handleDiscard = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
    // Select another post
    const remaining = filteredPosts.filter((p) => p.id !== postId)
    if (remaining.length > 0) {
      setSelectedPostId(remaining[0].id)
    } else {
      setSelectedPostId('')
    }
  }

  const handleRevoke = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, status: 'pending' as const, subStatus: 't2_required' as const, author: undefined }
          : p,
      ),
    )
    // Switch to pending tab
    setActiveTab('pending')
    setSelectedPostId(postId)
  }

  const handleCreateNewPost = (category: PostCategory, time: string, title: string) => {
    const newId = String(Date.now())
    const newPost: ReviewPost = {
      id: newId,
      category,
      time,
      title,
      mainContent: '',
      historyComparison: '',
      kolInsight: '',
      investorInsight: '',
      sources: '',
      authorTask: '',
      traderInsight: '',
      kolToolPosted: '',
      status: 'pending',
      subStatus: 'waiting',
    }
    setPosts((prev) => [newPost, ...prev])
    setActiveTab('pending')
    setSelectedPostId(newId)
    setCreateDialogOpen(false)
  }

  return (
    <>
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col items-stretch gap-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium text-white leading-[31.2px]">Duyệt bài</h1>
          <p className="text-sm font-normal text-[#828283] leading-[21px] mt-1">
            Nội dung từ Research API · duyệt, chỉnh sửa rồi xuất bản tới các tier
          </p>
        </div>

        {/* Tab Switches & Actions */}
        <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Tabs */}
          <div className="flex min-w-0 shrink-0 items-center">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pending')
                const firstPending = posts.find((p) => p.status === 'pending')
                if (firstPending) setSelectedPostId(firstPending.id)
              }}
              className={cn(
                "px-4 py-2 rounded-full text-base font-medium leading-6 transition-all duration-200 flex items-center gap-2",
                activeTab === 'pending'
                  ? "bg-[#282828] text-white shadow-[0_1px_3px_rgba(16,24,40,0.03),0_1px_4px_rgba(16,24,40,0.06)]"
                  : "text-[#A8A8A9] hover:text-white"
              )}
            >
              Chờ duyệt
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full shrink-0 leading-[18px] font-normal",
                  activeTab === 'pending' ? "bg-[#F7F0A1] text-black" : "bg-[#282828] text-[#A8A8A9]"
                )}
              >
                {pendingCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('processed')
                const firstProcessed = posts.find((p) => p.status === 'processed')
                if (firstProcessed) setSelectedPostId(firstProcessed.id)
              }}
              className={cn(
                "px-4 py-2 rounded-md text-base font-medium leading-6 transition-all duration-200 flex items-center gap-2",
                activeTab === 'processed'
                  ? "rounded-full bg-[#282828] text-white shadow-[0_1px_3px_rgba(16,24,40,0.03),0_1px_4px_rgba(16,24,40,0.06)]"
                  : "text-[#A8A8A9] hover:text-white"
              )}
            >
              Đã xử lý
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full shrink-0 leading-[18px] font-normal",
                  activeTab === 'processed' ? "bg-[#F7F0A1] text-black" : "bg-[#282828] text-[#A8A8A9]"
                )}
              >
                {processedCount}
              </span>
            </button>
          </div>

          {/* Soạn tin mới */}
          <button
            type="button"
            onClick={() => setCreateDialogOpen(true)}
            className="h-9 w-full px-4 bg-[#F7F0A1] hover:bg-[#e8e09c] rounded-lg text-sm font-semibold text-black transition-colors flex items-center justify-center gap-2 shrink-0 md:w-auto"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 3v14M3 10h14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Soạn tin mới
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col xl:flex-row items-start gap-6 w-full min-h-0">
        {/* Left Column: Post Cards List */}
        <div className="w-full xl:w-[320px] shrink-0 min-w-0">
          <div className="mb-3 flex items-center justify-end gap-2 xl:hidden">
            <button
              type="button"
              disabled={!listArrows.left}
              onClick={() => handleListScroll('left')}
              className={cn(
                "h-9 w-9 inline-flex items-center justify-center rounded-[10px] bg-transparent border border-white/20 text-white hover:bg-white/5 active:scale-95 transition-all",
                !listArrows.left && "opacity-30 cursor-not-allowed hover:bg-transparent active:scale-100"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={!listArrows.right}
              onClick={() => handleListScroll('right')}
              className={cn(
                "h-9 w-9 inline-flex items-center justify-center rounded-[10px] bg-transparent border border-white/20 text-white hover:bg-white/5 active:scale-95 transition-all",
                !listArrows.right && "opacity-30 cursor-not-allowed hover:bg-transparent active:scale-100"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={listScrollRef}
            onScroll={updateListArrows}
            className="flex w-full gap-4 overflow-x-hidden overflow-y-hidden scroll-smooth py-1 pl-1 pr-1 xl:max-h-[calc(100dvh-132px)] xl:flex-col xl:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
                <div key={post.id} className="w-full shrink-0 lg:w-[calc((100%_-_1rem)/2)] xl:w-full">
                <ReviewPostCard
                  post={post}
                  isSelected={post.id === selectedPostId}
                  onClick={() => handleSelectPost(post.id)}
                />
              </div>
            ))
          ) : (
            <div className="w-full shrink-0 text-center py-12 text-[#828283] text-sm bg-[#171717] rounded-2xl p-6 border border-[#282828]">
              Không có bài viết nào
            </div>
          )}
        </div>
        </div>

        {/* Right Column: Post Detail Editor */}
        <div className="flex-1 w-full min-h-0">
          {selectedPost ? (
            <PostDetailEditor
              key={selectedPost.id}
              post={selectedPost}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
              onDiscard={handleDiscard}
              onRevoke={handleRevoke}
            />
          ) : (
            <div className="h-48 flex items-center justify-center text-center text-[#828283] text-sm bg-[#171717] rounded-2xl p-6 border border-[#282828] w-full">
              Chọn một bài viết ở danh sách bên trái để duyệt hoặc chỉnh sửa
            </div>
          )}
        </div>
      </div>
    </div>
    <CreatePostModal
      open={createDialogOpen}
      onOpenChange={setCreateDialogOpen}
      onCreate={handleCreateNewPost}
    />
    </>
  )
}
