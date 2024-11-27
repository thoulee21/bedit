import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { Descendant, Editor } from 'slate';
import { Editable, Slate } from 'slate-react';
import { Element } from './elements/Element';
import { Leaf } from './elements/Leaf';
import { SideToolbar } from './SideToolbar';

// 创建自定义样式的 Editable 组件
const StyledEditable = styled(Editable)(({ theme }) => ({
  minHeight: '100%',
  padding: '25.4mm 31.7mm', // A4 纸张标准边距
  outline: 'none',
  fontSize: '12pt', // 标准字号
  lineHeight: 1.5,
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.text.primary,
  '&': {
    position: 'relative',
  },
  '& > [data-slate-placeholder]': {
    position: 'absolute',
    left: '31.7mm',
    top: '25.4mm',
    color: theme.palette.text.disabled,
    pointerEvents: 'none',
    userSelect: 'none',
    display: 'inline-block',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
  },
  // 自定义滚动条样式
  '&::-webkit-scrollbar': {
    width: '12px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.mode === 'dark' ? '#333' : '#ccc',
    borderRadius: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.mode === 'dark' ? '#666' : '#888',
    borderRadius: '6px',
    border: '3px solid transparent',
    backgroundClip: 'content-box',
    '&:hover': {
      background: theme.palette.mode === 'dark' ? '#555' : '#aaa',
    },
  },
}));

interface SlateEditorProps {
  editor: Editor;
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

export const SlateEditor: React.FC<SlateEditorProps> = ({ editor, value, onChange }) => {
  // 使用 useEffect 来更新编辑器内容
  useEffect(() => {
    // 更新编辑器的内容
    editor.children = value;
    // 手动触发一次 onChange 以确保视图更新
    editor.onChange();
  }, [value, editor]);

  return (
    <Slate
      editor={editor}
      initialValue={value}
      onChange={onChange}
    >
      <StyledEditable
        renderElement={props => <Element {...props} />}
        renderLeaf={props => <Leaf {...props} />}
        placeholder="开始输入..."
        spellCheck
        autoFocus
      />
      <SideToolbar />
    </Slate>
  );
}; 