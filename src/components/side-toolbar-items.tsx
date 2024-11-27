import { CustomEditor } from '@/types/slate';
import { isAlignActive, isBlockActive, toggleAlign, toggleBlock } from '@/utils/editor-utils';
import {
  ContentCopy,
  ContentCut,
  ContentPaste,
  DeleteOutline,
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Redo,
  SelectAll,
  Undo,
  AutoFixHigh,
  Image
} from '@mui/icons-material';
import React from 'react';
import { Editor, Range, Transforms } from 'slate';

interface SideToolbarItem {
  key: string;
  icon: React.ReactNode;
  title: string;
  onSelect: () => void;
  active?: boolean;
  disabled?: boolean;
}

interface ToolbarEvents {
  openLinkDialog: () => void;
  openTableDialog: () => void;
  openAIDialog: () => void;
  openMediaDialog: () => void;
}

export const createSideToolbarItems = (
  editor: CustomEditor, events: ToolbarEvents
): SideToolbarItem[] => {
  const hasSelection = !editor.selection || Range.isCollapsed(editor.selection);

  const items: SideToolbarItem[] = [
    {
      key: 'undo',
      icon: <Undo />,
      title: '撤销',
      onSelect: () => editor.undo(),
      disabled: !editor.history?.undos.length,
    },
    {
      key: 'redo',
      icon: <Redo />,
      title: '重做',
      onSelect: () => editor.redo(),
      disabled: !editor.history?.redos.length,
    },
    {
      key: 'cut',
      icon: <ContentCut />,
      title: '剪切',
      onSelect: async () => {
        if (!editor.selection || hasSelection) return;
        const text = Editor.string(editor, editor.selection);
        await navigator.clipboard.writeText(text);
        Transforms.delete(editor);
      },
      disabled: hasSelection,
    },
    {
      key: 'copy',
      icon: <ContentCopy />,
      title: '复制',
      onSelect: async () => {
        if (!editor.selection || hasSelection) return;
        const text = Editor.string(editor, editor.selection);
        await navigator.clipboard.writeText(text);
      },
      disabled: hasSelection,
    },
    {
      key: 'paste',
      icon: <ContentPaste />,
      title: '粘贴',
      onSelect: async () => {
        try {
          const text = await navigator.clipboard.readText();
          if (text && editor.selection) {
            Transforms.insertText(editor, text);
          }
        } catch (err) {
          console.warn('Failed to read clipboard:', err);
        }
      },
    },
    {
      key: 'select-all',
      icon: <SelectAll />,
      title: '全选',
      onSelect: () => {
        Transforms.select(editor, {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        });
      },
    },
    {
      key: 'delete',
      icon: <DeleteOutline />,
      title: '删除',
      onSelect: () => {
        if (editor.selection) {
          Transforms.delete(editor);
        }
      },
      disabled: hasSelection,
    },
    {
      key: 'align-left',
      icon: <FormatAlignLeft />,
      title: '左对齐',
      onSelect: () => toggleAlign(editor, 'left'),
      active: isAlignActive(editor, 'left'),
    },
    {
      key: 'align-center',
      icon: <FormatAlignCenter />,
      title: '居中对齐',
      onSelect: () => toggleAlign(editor, 'center'),
      active: isAlignActive(editor, 'center'),
    },
    {
      key: 'align-right',
      icon: <FormatAlignRight />,
      title: '右对齐',
      onSelect: () => toggleAlign(editor, 'right'),
      active: isAlignActive(editor, 'right'),
    },
    {
      key: 'align-justify',
      icon: <FormatAlignJustify />,
      title: '两端对齐',
      onSelect: () => toggleAlign(editor, 'justify'),
      active: isAlignActive(editor, 'justify'),
    },
    {
      key: 'bulleted-list',
      icon: <FormatListBulleted />,
      title: '无序列表',
      onSelect: () => editor.toggleList('bulleted-list'),
      active: isBlockActive(editor, 'bulleted-list'),
    },
    {
      key: 'numbered-list',
      icon: <FormatListNumbered />,
      title: '有序列表',
      onSelect: () => editor.toggleList('numbered-list'),
      active: isBlockActive(editor, 'numbered-list'),
    },
    {
      key: 'blockquote',
      icon: <FormatQuote />,
      title: '引用',
      onSelect: () => toggleBlock(editor, 'blockquote'),
      active: isBlockActive(editor, 'blockquote'),
    },
    {
      key: 'ai-helper',
      icon: <AutoFixHigh />,
      title: 'AI助手',
      onSelect: () => {
        if (!editor.selection) return;
        const text = Editor.string(editor, editor.selection);
        events.openAIDialog();
      },
      disabled: hasSelection,
    },
    {
      key: 'media',
      icon: <Image />,
      title: '多媒体提取',
      onSelect: events.openMediaDialog,
    },
  ];

  return items;
};
