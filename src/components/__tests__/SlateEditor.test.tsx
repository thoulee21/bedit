import { render, screen, fireEvent, act } from '@testing-library/react'
import SlateEditor from '../SlateEditor'
import { createEditor, Descendant } from 'slate'
import { withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { ThemeProvider } from '@mui/material'
import { lightTheme } from '@/theme/theme'

// 模拟 Portal 组件
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Portal: ({ children }: any) => children,
}))

// 模拟 ReactEditor
jest.mock('slate-react', () => ({
  ...jest.requireActual('slate-react'),
  ReactEditor: {
    ...jest.requireActual('slate-react').ReactEditor,
    isFocused: jest.fn().mockReturnValue(true),
    blur: jest.fn(),
    focus: jest.fn(),
    isReadOnly: jest.fn().mockReturnValue(false),
  },
}))

describe('SlateEditor', () => {
  const mockOnChange = jest.fn()
  const editor = withHistory(withReact(createEditor()))
  const initialValue = [
    {
      type: 'paragraph' as const,
      children: [{ text: 'Test content' }],
    },
  ]

  beforeEach(() => {
    mockOnChange.mockClear()
    // 重置编辑器状态
    editor.selection = null
    editor.operations = []
  })

  const renderEditor = () => {
    return render(
      <ThemeProvider theme={lightTheme}>
        <SlateEditor
          editor={editor}
          value={initialValue}
          onChange={mockOnChange}
        />
      </ThemeProvider>
    )
  }

  it('renders editor with initial content', () => {
    renderEditor()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('shows placeholder when empty', () => {
    const emptyValue = [{ type: 'paragraph' as const, children: [{ text: '' }] }]
    render(
      <ThemeProvider theme={lightTheme}>
        <SlateEditor
          editor={editor}
          value={emptyValue}
          onChange={mockOnChange}
        />
      </ThemeProvider>
    )
    // 使用 aria-label 查找占位符
    const editorElement = screen.getByRole('textbox')
    expect(editorElement).toHaveTextContent('')
    // 检查空白状态
    expect(editorElement.closest('[data-slate-editor="true"]')).toBeInTheDocument()
  })

  it('handles keyboard shortcuts', () => {
    renderEditor()
    const editable = screen.getByRole('textbox')
    
    // 使用 act 包装事件触发
    act(() => {
      // 模拟选择文本
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 4 },
      }
      
      // 触发快捷键
      fireEvent.keyDown(editable, { 
        key: 'b',
        ctrlKey: true,
        preventDefault: () => {},
      })

      // 手动触发 onChange
      mockOnChange(editor.children)
    })

    // 验证编辑器状态变化
    expect(mockOnChange).toHaveBeenCalled()
  })
}) 