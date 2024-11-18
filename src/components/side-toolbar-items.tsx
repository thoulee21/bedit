import { Editor, Element as SlateElement, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import {
  LooksOne,
  LooksTwo,
  Looks3,
  Looks4,
  Looks5,
  Looks6,
} from '@mui/icons-material'

interface ToolbarItem {
  key: string
  title: string
  icon?: React.ReactNode
  disabled?: boolean
  onSelect?: () => void
}

export const createSideToolbarItems = (editor: Editor & ReactEditor): ToolbarItem[] => {
  const items: ToolbarItem[] = [
    {
      key: 'heading-1',
      title: '一级标题',
      icon: <LooksOne fontSize="small" />,
      onSelect: () => toggleBlock(editor, 'heading-one'),
    },
    {
      key: 'heading-2',
      title: '二级标题',
      icon: <LooksTwo fontSize="small" />,
      onSelect: () => toggleBlock(editor, 'heading-two'),
    },
    {
      key: 'heading-3',
      title: '三级标题',
      icon: <Looks3 fontSize="small" />,
      onSelect: () => toggleBlock(editor, 'heading-three'),
    },
    {
      key: 'heading-4',
      title: '四级标题',
      icon: <Looks4 fontSize="small" />,
      onSelect: () => toggleBlock(editor, 'heading-four'),
    },
    {
      key: 'heading-5',
      title: '五级标题',
      icon: <Looks5 fontSize="small" />,
      onSelect: () => toggleBlock(editor, 'heading-five'),
    },
    {
      key: 'heading-6',
      title: '六级标题',
      icon: <Looks6 fontSize="small" />,
      onSelect: () => toggleBlock(editor, 'heading-six'),
    },
  ]

  return items
}

// 辅助函数
const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : format as any,
  }
  Transforms.setNodes(editor, newProperties)
}

const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  })
  return !!match
}
