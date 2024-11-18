import { Button } from '@mui/material'
import { ChangeEvent, useRef } from 'react'
import { Editor, Transforms, Element as SlateElement, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { FolderOpen } from '@mui/icons-material'

interface OpenFileProps {
  editor: Editor & ReactEditor;
  setValue: (value: Descendant[]) => void;
}

export const OpenFile = ({ editor, setValue }: OpenFileProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      
      // 简单的文本转换为 Slate 文档结构
      const paragraphs = text.split(/\n\n+/)
      const content: Descendant[] = paragraphs.map(paragraph => ({
        type: 'paragraph',
        children: [{ text: paragraph }]
      }))

      // 更新编辑器内容
      setValue(content)
      
      // 清空文件输入，允许重复打开同一文件
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error reading file:', error)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept=".txt,.md"
        style={{ display: 'none' }}
      />
      <Button
        onClick={handleClick}
        variant="outlined"
        size="small"
        startIcon={<FolderOpen />}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          px: 2,
          '&:hover': {
            backgroundColor: 'primary.50',
          },
        }}
      >
        打开
      </Button>
    </>
  )
}