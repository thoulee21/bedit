import { BaseEditor, BaseElement } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

export type CustomElement = {
  type: 'paragraph' | 'heading-one' | 'heading-two' | 'heading-three' | 'heading-four' | 'heading-five' | 'heading-six' |
        'bulleted-list' | 'numbered-list' | 'list-item' | 'blockquote' | 'code-block' | 'link' | 'image' | 'attachment' | 'table' |
        'table-row' | 'table-cell'
  align?: 'left' | 'center' | 'right' | 'justify'
  url?: string
  children: (CustomElement | CustomText)[]
  name?: string
  size?: number
  mimeType?: string
} & BaseElement

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor & {
  toggleList: (format: string) => void;
  isInline: (element: CustomElement) => boolean;
  isVoid: (element: CustomElement) => boolean;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
} 