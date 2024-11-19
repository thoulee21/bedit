import { Editor, Element as SlateElement, Node as SlateNode, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import {
  ContentCopy,
  ContentCut,
  ContentPaste,
  DeleteOutline,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Looks3,
  Looks4,
  Looks5,
  Looks6,
  LooksOne,
  LooksTwo,
  Redo,
  Undo,
} from '@mui/icons-material'
import { CustomEditor, CustomElement } from '@/types/slate'

interface MenuItem {
  key: string
  title: string
  icon?: React.ReactNode
  disabled?: boolean
  onSelect?: () => void
  type?: 'separator'
}

interface SeparatorItem extends MenuItem {
  type: 'separator'
  key: string
  title: string
}

export const createContextMenuItems = (editor: CustomEditor): MenuItem[] => {
  const hasSelection = editor.selection !== null

  const items: (MenuItem | SeparatorItem)[] = [
    {
      key: 'cut',
      title: '剪切',
      icon: <ContentCut />,
      disabled: !hasSelection,
      onSelect: () => {
        if (hasSelection) {
          const fragment = editor.getFragment()
          const string = fragment
            .map((node: SlateNode) => SlateNode.string(node))
            .join('\n')
          
          // 复制到剪贴板
          navigator.clipboard.writeText(string).then(() => {
            // 删除选中内容
            Transforms.delete(editor)
          })
        }
      },
    },
    {
      key: 'copy',
      title: '复制',
      icon: <ContentCopy />,
      disabled: !hasSelection,
      onSelect: () => {
        if (hasSelection) {
          const fragment = editor.getFragment()
          const string = fragment
            .map((node: SlateNode) => SlateNode.string(node))
            .join('\n')
          navigator.clipboard.writeText(string)
        }
      },
    },
    {
      key: 'paste',
      title: '粘贴',
      icon: <ContentPaste />,
      onSelect: async () => {
        try {
          const text = await navigator.clipboard.readText()
          Transforms.insertText(editor, text)
        } catch (err) {
          console.error('Failed to read clipboard:', err)
        }
      },
    },
    { type: 'separator', key: 'separator-1', title: '' },
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
    { type: 'separator', key: 'separator-2', title: '' },
    {
      key: 'bold',
      title: '加粗',
      icon: <FormatBold fontSize="small" />,
      onSelect: () => toggleMark(editor, 'bold'),
    },
    {
      key: 'italic',
      title: '斜体',
      icon: <FormatItalic fontSize="small" />,
      onSelect: () => toggleMark(editor, 'italic'),
    },
    {
      key: 'underline',
      title: '下划线',
      icon: <FormatUnderlined fontSize="small" />,
      onSelect: () => toggleMark(editor, 'underline'),
    },
  ]

  return items
}

// 辅助函数
const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const newProperties: Partial<SlateElement> = {
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

const isBlockActive = (editor: CustomEditor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n): n is CustomElement => {
      if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
        const element = n as CustomElement;
        return element.type === format;
      }
      return false;
    },
  });
  return !!match;
}

const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format as keyof typeof marks] === true : false
}
