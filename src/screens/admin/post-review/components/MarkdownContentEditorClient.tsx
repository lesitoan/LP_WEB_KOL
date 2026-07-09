"use client"

import { useEffect, useRef, useState } from 'react'
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  Separator,
  UndoRedo,
  diffSourcePlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  type MDXEditorMethods,
} from '@mdxeditor/editor'
import { cn } from '@/lib/utils'

interface MarkdownContentEditorClientProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  readOnly?: boolean
  hasError?: boolean
}

export default function MarkdownContentEditorClient({
  value,
  onChange,
  onBlur,
  readOnly = false,
  hasError = false,
}: MarkdownContentEditorClientProps) {
  const editorRef = useRef<MDXEditorMethods>(null)
  const [overlayContainer, setOverlayContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    if (editor.getMarkdown() !== value) {
      editor.setMarkdown(value)
    }
  }, [value])

  return (
    <div ref={setOverlayContainer} className="post-review-markdown-editor-shell">
      <MDXEditor
        ref={editorRef}
        markdown={value}
        trim={false}
        readOnly={readOnly}
        overlayContainer={overlayContainer}
        placeholder="Nhập nội dung chính"
        onBlur={() => onBlur?.()}
        onChange={(nextValue, initialMarkdownNormalize) => {
          if (!initialMarkdownNormalize) {
            onChange(nextValue)
          }
        }}
        className={cn(
          'post-review-markdown-editor',
          hasError && 'post-review-markdown-editor-error',
          readOnly && 'post-review-markdown-editor-readonly'
        )}
        contentEditableClassName="post-review-markdown-editor-content"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          markdownShortcutPlugin(),
          diffSourcePlugin({ viewMode: 'rich-text' }),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper options={['rich-text', 'source']}>
                <UndoRedo />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <ListsToggle />
                <Separator />
                <CreateLink />
                <InsertThematicBreak />
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
      />
    </div>
  )
}
