import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SlateEditor } from '../SlateEditor';
import { createEditor, Transforms } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

describe('SlateEditor', () => {
  const editor = withHistory(withReact(createEditor()));
  const onChange = jest.fn();
  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'Test content' }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderEditor = () => {
    return render(
      <ThemeProvider theme={theme}>
        <SlateEditor
          editor={editor}
          value={initialValue}
          onChange={onChange}
        />
      </ThemeProvider>
    );
  };

  it('renders with initial content', () => {
    renderEditor();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('handles keyboard shortcuts', async () => {
    renderEditor();
    const editable = screen.getByRole('textbox');

    await act(async () => {
      fireEvent.keyDown(editable, { key: 'b', ctrlKey: true });
    });
    expect(editor.marks).toBeDefined();

    await act(async () => {
      fireEvent.keyDown(editable, { key: 'i', ctrlKey: true });
    });
    expect(editor.marks).toBeDefined();
  });

  it('updates content when typing', async () => {
    renderEditor();

    await act(async () => {
      Transforms.insertText(editor, 'New text');
    });
    expect(onChange).toHaveBeenCalled();
  });

  it('maintains editor state across re-renders', async () => {
    const { rerender } = renderEditor();

    await act(async () => {
      Transforms.insertText(editor, 'Additional text');
    });

    rerender(
      <ThemeProvider theme={theme}>
        <SlateEditor
          editor={editor}
          value={editor.children}
          onChange={onChange}
        />
      </ThemeProvider>
    );

    expect(editor.children).toEqual(expect.arrayContaining([
      expect.objectContaining({
        children: expect.arrayContaining([
          expect.objectContaining({ text: expect.any(String) })
        ])
      })
    ]));
  });

  it('handles placeholder text correctly', async () => {
    const emptyValue = [{ type: 'paragraph', children: [{ text: '' }] }];
    
    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <SlateEditor
            editor={editor}
            value={emptyValue}
            onChange={onChange}
          />
        </ThemeProvider>
      );
    });

    // 使用 data-slate-placeholder 属性来查找占位符文本
    const placeholder = screen.getByText((content, element) => {
      return element?.getAttribute('data-slate-placeholder') === 'true' &&
             content.includes('开始输入...');
    });
    
    expect(placeholder).toBeInTheDocument();
  });
}); 