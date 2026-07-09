"use client"

import dynamic from 'next/dynamic'

const MarkdownContentEditor = dynamic(() => import('./MarkdownContentEditorClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[260px] rounded-md border border-[#282828] bg-[#121212]" />
  ),
})

export default MarkdownContentEditor
