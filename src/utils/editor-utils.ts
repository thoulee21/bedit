import { Editor, Transforms, Element as SlateElement, Path, Range, Node } from 'slate'
import { ReactEditor } from 'slate-react'
import { CustomEditor, CustomElement } from '@/types/slate'

// 插入链接
export const insertLink = (editor: CustomEditor, url: string) => {
  if (!url) return

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link: CustomElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

// 插入图片
export const insertImage = (editor: CustomEditor, url: string) => {
  if (!url) return

  const image: CustomElement = {
    type: 'image',
    url,
    children: [{ text: '' }],
  }

  Transforms.insertNodes(editor, image)
}

// 插入表格
export const insertTable = (editor: CustomEditor, rows: number = 3, cols: number = 3) => {
  const table: CustomElement = {
    type: 'table',
    children: Array(rows).fill(0).map(() => ({
      type: 'table-row',
      children: Array(cols).fill(0).map(() => ({
        type: 'table-cell',
        children: [{ text: '' }],
      })),
    })) as CustomElement[],
  }

  Transforms.insertNodes(editor, table)
}

// 检查是否在表格内
export const isInTable = (editor: CustomEditor) => {
  const [table] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table',
  })
  return !!table
}

// 在表格中添加行
export const insertTableRow = (editor: CustomEditor) => {
  const [table] = Editor.nodes<CustomElement>(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table',
  })

  if (table) {
    const [tableNode, path] = table
    const tableElement = tableNode as CustomElement
    const rows = tableElement.children.length
    const cols = (tableElement.children[0] as CustomElement).children.length

    const newRow: CustomElement = {
      type: 'table-row',
      children: Array(cols).fill(0).map(() => ({
        type: 'table-cell',
        children: [{ text: '' }],
      })) as CustomElement[],
    }

    Transforms.insertNodes(editor, newRow, {
      at: Path.next(path),
    })
  }
}

// 在表格中添加列
export const insertTableColumn = (editor: CustomEditor) => {
  const [table] = Editor.nodes<CustomElement>(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'table',
  })

  if (table) {
    const [tableNode] = table
    const tableElement = tableNode as CustomElement
    tableElement.children.forEach((row, rowIndex) => {
      const rowElement = row as CustomElement
      const newCell: CustomElement = {
        type: 'table-cell',
        children: [{ text: '' }],
      }

      Transforms.insertNodes(editor, newCell, {
        at: [...Path.next(table[1]), rowIndex, rowElement.children.length],
      })
    })
  }
} 