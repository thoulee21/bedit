import { Button } from '@mui/material'
import { saveAs } from 'file-saver'
import { Editor, Element as SlateElement, Node, Text } from 'slate'
import { ReactEditor } from 'slate-react'
import { Save } from '@mui/icons-material'

interface SaveFileProps {
  editor: Editor & ReactEditor;
}

export const SaveFile = ({ editor }: SaveFileProps) => {
  const handleSave = () => {
    // 将编辑器内容序列化为纯文本
    const content = serializeToText(editor)
    
    // 创建 Blob 对象
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    
    // 保存文件
    saveAs(blob, 'document.txt')
  }

  return (
    <Button
      onClick={handleSave}
      variant="outlined"
      size="small"
      startIcon={<Save />}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        px: 2,
        '&:hover': {
          backgroundColor: 'primary.50',
        },
      }}
    >
      保存
    </Button>
  )
}

// 序列化函数：将 Slate 内容转换为纯文本
const serializeToText = (editor: Editor): string => {
  const nodes = Array.from(Editor.nodes(editor, {
    at: [],
    match: n => true,
  }))

  let result = ''
  let lastType = ''

  nodes.forEach(([node]) => {
    if (!Editor.isEditor(node) && SlateElement.isElement(node)) {
      // 根据节点类型添加适当的换行
      if (lastType && lastType !== node.type) {
        result += '\n'
      }
      lastType = node.type

      // 获取节点的文本内容
      const text = node.children
        .map(child => Text.isText(child) ? child.text : '')
        .join('')

      // 根据节点类型添加格式
      switch (node.type) {
        case 'heading-one':
          result += `# ${text}\n`
          break
        case 'heading-two':
          result += `## ${text}\n`
          break
        case 'heading-three':
          result += `### ${text}\n`
          break
        case 'heading-four':
          result += `#### ${text}\n`
          break
        case 'heading-five':
          result += `##### ${text}\n`
          break
        case 'heading-six':
          result += `###### ${text}\n`
          break
        default:
          if (text.trim()) {
            result += `${text}\n`
          }
      }
    }
  })

  return result.trim()
}
