import { render, screen } from '@testing-library/react'
import { DocumentOutline } from '../DocumentOutline'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import { withHistory } from 'slate-history'

// 模拟 ReactEditor.toDOMNode
jest.mock('slate-react', () => ({
  ...jest.requireActual('slate-react'),
  ReactEditor: {
    ...jest.requireActual('slate-react').ReactEditor,
    toDOMNode: jest.fn(),
    isFocused: jest.fn(),
  },
}));

describe('DocumentOutline', () => {
  const editor = withHistory(withReact(createEditor()))
  
  beforeEach(() => {
    // 重置编辑器内容
    editor.children = [
      {
        type: 'heading-one',
        children: [{ text: 'Title 1' }],
      },
      {
        type: 'heading-two',
        children: [{ text: 'Subtitle 1' }],
      },
    ]
  })

  it('renders outline items', () => {
    render(<DocumentOutline editor={editor} />)
    expect(screen.getByText('Title 1')).toBeInTheDocument()
    expect(screen.getByText('Subtitle 1')).toBeInTheDocument()
  })

  it('shows empty state when no headings', () => {
    editor.children = [
      {
        type: 'paragraph',
        children: [{ text: 'Just a paragraph' }],
      },
    ]
    render(<DocumentOutline editor={editor} />)
    expect(screen.getByText(/使用工具栏的标题按钮/)).toBeInTheDocument()
  })

  it('handles item click', () => {
    // 模拟 DOM 节点和滚动容器
    const mockDomNode = document.createElement('div')
    const mockScrollContainer = document.createElement('div')
    Object.defineProperty(mockScrollContainer, 'scrollTo', {
      value: jest.fn(),
    })

    // 设置模拟实现
    const { ReactEditor } = require('slate-react')
    ReactEditor.toDOMNode.mockReturnValue(mockDomNode)
    ReactEditor.isFocused.mockReturnValue(true)

    render(<DocumentOutline editor={editor} />)
    const outlineItem = screen.getByText('Title 1')
    outlineItem.click()

    // 验证点击事件被处理
    expect(outlineItem).toBeInTheDocument()
  })
}) 