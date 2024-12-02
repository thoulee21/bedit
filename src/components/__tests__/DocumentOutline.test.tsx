import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentOutline } from '../DocumentOutline';
import { createEditor } from 'slate';
import { withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

describe('DocumentOutline', () => {
  const editor = withHistory(withReact(createEditor()));

  beforeEach(() => {
    // 模拟编辑器内容
    editor.children = [
      {
        type: 'heading-one',
        level: 1,
        children: [{ text: 'Test Heading' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'Test content' }],
      },
    ];

    // 模拟 ReactEditor 方法
    ReactEditor.focus = jest.fn();
    ReactEditor.toDOMNode = jest.fn().mockReturnValue(document.createElement('div'));
  });

  it('shows empty state when no headings', () => {
    editor.children = [
      {
        type: 'paragraph',
        children: [{ text: 'Hello World' }],
      },
    ];

    render(
      <ThemeProvider theme={theme}>
        <DocumentOutline editor={editor} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('没有标题')).toBeInTheDocument();
  });

  it('handles heading click and scrolls to position', () => {
    // 创建模拟的 DOM 元素
    const mockElement = document.createElement('div');
    mockElement.scrollIntoView = jest.fn();
    
    // 模拟 querySelector 返回元素
    const mockQuerySelector = jest.fn().mockReturnValue(mockElement);
    ReactEditor.toDOMNode = jest.fn().mockReturnValue({
      querySelector: mockQuerySelector
    });

    render(
      <ThemeProvider theme={theme}>
        <DocumentOutline editor={editor} />
      </ThemeProvider>
    );

    // 点击标题
    fireEvent.click(screen.getByText('Test Heading'));

    // 验证调用
    expect(ReactEditor.focus).toHaveBeenCalledWith(editor);
    expect(mockQuerySelector).toHaveBeenCalledWith(expect.stringContaining('data-slate-path'));
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center'
    });
  });

  it('displays headings with correct indentation', () => {
    editor.children = [
      {
        type: 'heading-one',
        level: 1,
        children: [{ text: 'H1 Title' }],
      },
      {
        type: 'heading-two',
        level: 2,
        children: [{ text: 'H2 Title' }],
      },
    ];

    render(
      <ThemeProvider theme={theme}>
        <DocumentOutline editor={editor} />
      </ThemeProvider>
    );

    const h1 = screen.getByText('H1 Title');
    const h2 = screen.getByText('H2 Title');
    
    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
    expect(h2.closest('.MuiListItemButton-root')).toHaveStyle({ 
      paddingLeft: '16px'  // MUI 中 1 个单位是 8px，level 2 的缩进是 2 个单位
    });
  });
}); 