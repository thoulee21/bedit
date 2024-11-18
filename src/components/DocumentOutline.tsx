import { Editor, Element as SlateElement, Text, Transforms } from 'slate'
import { List, ListItem, ListItemButton, ListItemText, Typography, Stack } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { CustomEditor, CustomElement } from '@/types/slate'
import { ReactEditor } from 'slate-react'

interface OutlineItem {
  id: string
  text: string
  level: number
  path: number[]
}

const headingLevels = {
  'heading-one': 1,
  'heading-two': 2,
  'heading-three': 3,
  'heading-four': 4,
  'heading-five': 5,
  'heading-six': 6,
} as const

export const DocumentOutline = ({ editor }: { editor: CustomEditor }) => {
  const [outline, setOutline] = useState<OutlineItem[]>([])

  const generateOutline = useCallback(() => {
    const items: OutlineItem[] = []
    
    const nodes = Array.from(
      Editor.nodes<CustomElement>(editor, {
        at: [],
        match: n => 
          !Editor.isEditor(n) && 
          SlateElement.isElement(n) && 
          Object.keys(headingLevels).includes(n.type)
      })
    )

    nodes.forEach(([node, path]) => {
      const element = node as CustomElement
      const text = element.children
        .map(child => Text.isText(child) ? child.text : '')
        .join('')
        .trim()

      const level = headingLevels[element.type as keyof typeof headingLevels] || 1

      if (text) {
        items.push({
          id: path.join('-'),
          text,
          level,
          path
        })
      }
    })

    setOutline(items)
  }, [editor])

  useEffect(() => {
    generateOutline()
    
    const { onChange } = editor
    editor.onChange = () => {
      onChange()
      generateOutline()
    }

    return () => {
      editor.onChange = onChange
    }
  }, [editor, generateOutline])

  const handleClick = (item: OutlineItem) => {
    try {
      // 获取目标元素的 DOM 节点
      const domNode = ReactEditor.toDOMNode(editor, Editor.node(editor, item.path)[0])
      
      // 找到中间编辑区的滚动容器
      const editorContainer = document.querySelector('[role="textbox"]')?.closest('.MuiBox-root')?.parentElement?.parentElement
      if (!editorContainer || !domNode) return

      // 设置选区并聚焦
      const range = Editor.range(editor, item.path)
      Transforms.select(editor, range)
      ReactEditor.focus(editor)

      // 计算滚动位置
      const containerRect = editorContainer.getBoundingClientRect()
      const elementRect = domNode.getBoundingClientRect()
      const relativeTop = elementRect.top - containerRect.top + editorContainer.scrollTop
      const offset = 100 // 顶部偏移量

      // 平滑滚动
      editorContainer.scrollTo({
        top: Math.max(0, relativeTop - offset),
        behavior: 'smooth'
      })
    } catch (error) {
      console.error('Error scrolling to heading:', error)
    }
  }

  const getHeadingLabel = (level: number) => {
    if (level === 0) return 'Title'
    return `H${level}`
  }

  return (
    <List 
      dense
      sx={{
        width: '100%',
        height: '100%',
        py: 1,
        px: 0.5,
      }}
    >
      {outline.length === 0 ? (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            p: 2, 
            textAlign: 'center',
            fontStyle: 'italic',
            backgroundColor: 'action.hover',
            borderRadius: 1,
            mx: 1,
          }}
        >
          使用工具栏的标题按钮来添加标题
        </Typography>
      ) : (
        outline.map((item) => (
          <ListItem 
            key={item.id}
            disablePadding
            sx={{ 
              pl: 1 + item.level * 1.5,
              py: 0.3,
            }}
          >
            <ListItemButton 
              onClick={() => handleClick(item)}
              sx={{ 
                borderRadius: 1,
                py: 0.5,
                minHeight: 32,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'translateX(4px)',
                  color: 'primary.main',
                },
              }}
            >
              <ListItemText 
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        minWidth: '2rem',
                        backgroundColor: 'action.hover',
                        padding: '2px 4px',
                        borderRadius: 0.5,
                        textAlign: 'center',
                      }}
                    >
                      {getHeadingLabel(item.level)}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: item.level === 0 ? '1rem' : '0.875rem',
                        fontWeight: item.level === 0 ? 500 : 400,
                        color: theme => 
                          item.level === 0 
                            ? theme.palette.primary.main 
                            : theme.palette.text.primary,
                        transition: 'color 0.2s ease-in-out',
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Stack>
                }
                sx={{ m: 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))
      )}
    </List>
  )
} 