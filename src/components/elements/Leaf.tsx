import React from 'react'
import { RenderLeafProps } from 'slate-react'

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
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
    children = <code style={{ 
      background: '#f4f4f4', 
      padding: '2px 4px', 
      borderRadius: '2px' 
    }}>{children}</code>
  }

  return <span {...attributes}>{children}</span>
} 