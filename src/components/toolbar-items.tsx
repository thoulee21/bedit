import { CustomEditor, CustomElement } from '@/types/slate'
import {
  AddBox,
  AddCircleOutline,
  Code,
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatStrikethrough,
  FormatUnderlined,
  Image as ImageIcon,
  Link as LinkIcon,
  Looks3,
  Looks4,
  Looks5,
  Looks6,
  LooksOne,
  LooksTwo,
  Redo,
  TableChart,
  Undo,
} from '@mui/icons-material'
import { Editor, Element as SlateElement, Transforms } from 'slate'
import { HistoryEditor } from 'slate-history'
import { insertImage, insertLink, insertTable, insertTableColumn, insertTableRow, isInTable } from '../utils/editor-utils'

interface ToolbarItem {
  key: string
  title: string
  icon?: React.ReactNode
  disabled?: boolean
  active?: boolean
  onSelect?: () => void
  type?: 'separator'
}

// Slate.js 官网: https://www.slatejs.org/
export const createToolbarItems = (editor: CustomEditor): ToolbarItem[] => {
  const items: ToolbarItem[] = [
    {
      key: 'undo',
      title: '撤销',
      icon: <Undo fontSize="small" />,
      onSelect: () => HistoryEditor.undo(editor),
    },
    {
      key: 'redo',
      title: '重做',
      icon: <Redo fontSize="small" />,
      onSelect: () => HistoryEditor.redo(editor),
    },
    { type: 'separator', key: 'separator-0', title: '' },
    {
      key: 'heading-1',
      title: '一级标题',
      icon: <LooksOne fontSize="small" />,
      active: isBlockActive(editor, 'heading-one'),
      onSelect: () => toggleBlock(editor, 'heading-one'),
    },
    {
      key: 'heading-2',
      title: '二级标题',
      icon: <LooksTwo fontSize="small" />,
      active: isBlockActive(editor, 'heading-two'),
      onSelect: () => toggleBlock(editor, 'heading-two'),
    },
    {
      key: 'heading-3',
      title: '三级标题',
      icon: <Looks3 fontSize="small" />,
      active: isBlockActive(editor, 'heading-three'),
      onSelect: () => toggleBlock(editor, 'heading-three'),
    },
    {
      key: 'heading-4',
      title: '四级标题',
      icon: <Looks4 fontSize="small" />,
      active: isBlockActive(editor, 'heading-four'),
      onSelect: () => toggleBlock(editor, 'heading-four'),
    },
    {
      key: 'heading-5',
      title: '五级标题',
      icon: <Looks5 fontSize="small" />,
      active: isBlockActive(editor, 'heading-five'),
      onSelect: () => toggleBlock(editor, 'heading-five'),
    },
    {
      key: 'heading-6',
      title: '六级标题',
      icon: <Looks6 fontSize="small" />,
      active: isBlockActive(editor, 'heading-six'),
      onSelect: () => toggleBlock(editor, 'heading-six'),
    },
    { type: 'separator', key: 'separator-1', title: '' },
    {
      key: 'bold',
      title: '加粗',
      icon: <FormatBold fontSize="small" />,
      active: isMarkActive(editor, 'bold'),
      onSelect: () => toggleMark(editor, 'bold'),
    },
    {
      key: 'italic',
      title: '斜体',
      icon: <FormatItalic fontSize="small" />,
      active: isMarkActive(editor, 'italic'),
      onSelect: () => toggleMark(editor, 'italic'),
    },
    {
      key: 'underline',
      title: '下划线',
      icon: <FormatUnderlined fontSize="small" />,
      active: isMarkActive(editor, 'underline'),
      onSelect: () => toggleMark(editor, 'underline'),
    },
    {
      key: 'strikethrough',
      title: '删除线',
      icon: <FormatStrikethrough fontSize="small" />,
      active: isMarkActive(editor, 'strikethrough'),
      onSelect: () => toggleMark(editor, 'strikethrough'),
    },
    {
      key: 'code',
      title: '行内代码',
      icon: <Code fontSize="small" />,
      active: isMarkActive(editor, 'code'),
      onSelect: () => toggleMark(editor, 'code'),
    },
    { type: 'separator', key: 'separator-2', title: '' },
    {
      key: 'align-left',
      title: '左对齐',
      icon: <FormatAlignLeft fontSize="small" />,
      active: isAlignActive(editor, 'left'),
      onSelect: () => toggleAlign(editor, 'left'),
    },
    {
      key: 'align-center',
      title: '居中对齐',
      icon: <FormatAlignCenter fontSize="small" />,
      active: isAlignActive(editor, 'center'),
      onSelect: () => toggleAlign(editor, 'center'),
    },
    {
      key: 'align-right',
      title: '右对齐',
      icon: <FormatAlignRight fontSize="small" />,
      active: isAlignActive(editor, 'right'),
      onSelect: () => toggleAlign(editor, 'right'),
    },
    {
      key: 'align-justify',
      title: '两端对齐',
      icon: <FormatAlignJustify fontSize="small" />,
      active: isAlignActive(editor, 'justify'),
      onSelect: () => toggleAlign(editor, 'justify'),
    },
    { type: 'separator', key: 'separator-3', title: '' },
    {
      key: 'bulleted-list',
      title: '无序列表',
      icon: <FormatListBulleted fontSize="small" />,
      active: isBlockActive(editor, 'bulleted-list'),
      onSelect: () => toggleBlock(editor, 'bulleted-list'),
    },
    {
      key: 'numbered-list',
      title: '有序列表',
      icon: <FormatListNumbered fontSize="small" />,
      active: isBlockActive(editor, 'numbered-list'),
      onSelect: () => toggleBlock(editor, 'numbered-list'),
    },
    {
      key: 'blockquote',
      title: '引用',
      icon: <FormatQuote fontSize="small" />,
      active: isBlockActive(editor, 'blockquote'),
      onSelect: () => toggleBlock(editor, 'blockquote'),
    },
    {
      key: 'code-block',
      title: '代码块',
      icon: <Code fontSize="small" />,
      active: isBlockActive(editor, 'code-block'),
      onSelect: () => toggleBlock(editor, 'code-block'),
    },
    { type: 'separator', key: 'separator-4', title: '' },
    {
      key: 'link',
      title: '插入链接',
      icon: <LinkIcon fontSize="small" />,
      onSelect: () => {
        const url = window.prompt('输入链接地址:')
        if (url) {
          insertLink(editor, url)
        }
      },
    },
    {
      key: 'image',
      title: '插入图片',
      icon: <ImageIcon fontSize="small" />,
      onSelect: () => {
        const url = window.prompt('输入图片地址:')
        if (url) {
          insertImage(editor, url)
        }
      },
    },
    {
      key: 'table',
      title: '插入表格',
      icon: <TableChart fontSize="small" />,
      onSelect: () => {
        const rows = parseInt(window.prompt('输入行数:', '3') || '3')
        const cols = parseInt(window.prompt('输入列数:', '3') || '3')
        insertTable(editor, rows, cols)
      },
    },
    ...(isInTable(editor) ? [
      {
        key: 'table-row',
        title: '添加行',
        icon: <AddCircleOutline fontSize="small" />,
        onSelect: () => insertTableRow(editor),
      },
      {
        key: 'table-column',
        title: '添加列',
        icon: <AddBox fontSize="small" />,
        onSelect: () => insertTableColumn(editor),
      },
    ] : []),
  ]

  return items
}

// 辅助函数
const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const newProperties: Partial<CustomElement> = {
    type: isActive ? 'paragraph' : format as any,
  }
  Transforms.setNodes(editor, newProperties)
}

const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const toggleAlign = (editor: CustomEditor, align: 'left' | 'center' | 'right' | 'justify') => {
  const newProperties: Partial<CustomElement> = {
    align,
  }
  Transforms.setNodes(editor, newProperties)
}

const isBlockActive = (editor: CustomEditor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  })
  return !!match
}

const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format as keyof typeof marks] === true : false
}

const isAlignActive = (editor: CustomEditor, align: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as CustomElement).align === align,
  })
  return !!match
}
