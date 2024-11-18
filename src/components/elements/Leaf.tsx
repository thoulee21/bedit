import React from 'react'
import { RenderLeafProps } from 'slate-react'
import { useTheme } from '@mui/material'

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const theme = useTheme()

  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>
  }

  if (leaf.code) {
    children = (
      <code
        style={{
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)' // 更亮的背景色
            : 'rgba(0, 0, 0, 0.05)',
          padding: '0.2em 0.4em',
          borderRadius: '3px',
          fontSize: '0.9em',
          fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          color: theme.palette.mode === 'dark'
            ? theme.palette.primary.light // 使用主题色的亮色变体
            : theme.palette.text.primary,
        }}
      >
        {children}
      </code>
    )
  }

  return <span {...attributes}>{children}</span>
} 