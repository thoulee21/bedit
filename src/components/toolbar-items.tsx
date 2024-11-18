import { CustomEditor, CustomElement } from '@/types/slate'
import {
  AddBox,
  AddCircleOutline,
  Code,
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatStrikethrough,
  FormatUnderlined,
  Image as ImageIcon,
  Link as LinkIcon,
  Looks3,
  Looks4,
  Looks5,
  Looks6,
  LooksOne,
  LooksTwo,
  Redo,
  TableChart,
  Undo,
  AttachFile,
  InsertDriveFile,
  ImageOutlined,
  InsertDriveFileOutlined,
  TableChartOutlined,
  Link,
} from '@mui/icons-material'
import { Editor, Element as SlateElement, Transforms } from 'slate'
import { HistoryEditor } from 'slate-history'
import { insertAttachment, insertImage, insertLink, insertTable, insertTableColumn, insertTableRow, isInTable } from '../utils/editor-utils'
import { LinkDialog } from './dialogs/LinkDialog';
import React from 'react'
import { TableDialog } from './dialogs/TableDialog';

export interface ToolbarItem {
  key: string;
  title?: string;
  commandKey?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
  active?: boolean;
  disabled?: boolean;
  type?: 'separator' | string;
  sx?: any;
}

// Slate.js 官网: https://www.slatejs.org/
export type ToolbarEvents = {
  openLinkDialog: () => void;
  openTableDialog: () => void;
};

// 定义标记类型
type MarkFormat = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code';

// 检查标记是否激活
const isMarkActive = (editor: CustomEditor, format: MarkFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// 检查块级样式是否激活
const isBlockActive = (editor: CustomEditor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => 
      !Editor.isEditor(n) && 
      SlateElement.isElement(n) && 
      (n as CustomElement).type === format,
  });
  return !!match;
};

// 检查对齐方式是否激活
const isAlignActive = (editor: CustomEditor, align: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => 
      !Editor.isEditor(n) && 
      SlateElement.isElement(n) && 
      (n as CustomElement).align === align,
  });
  return !!match;
};

export const createToolbarItems = (editor: CustomEditor, events: ToolbarEvents): ToolbarItem[] => {
  const items: ToolbarItem[] = [
    {
      key: 'undo',
      title: '撤销',
      icon: <Undo fontSize="small" />,
      onSelect: () => HistoryEditor.undo(editor),
    },
    {
      key: 'redo',
      title: '重做',
      icon: <Redo fontSize="small" />,
      onSelect: () => HistoryEditor.redo(editor),
    },
    { type: 'separator', key: 'separator-0', title: '' },
    {
      key: 'heading-one',
      title: '一级标题',
      commandKey: 'Ctrl+1',
      icon: <LooksOne />,
      active: isBlockActive(editor, 'heading-one'),
      onSelect: () => toggleBlock(editor, 'heading-one'),
    },
    {
      key: 'heading-two',
      title: '二级标题',
      commandKey: 'Ctrl+2',
      icon: <LooksTwo />,
      active: isBlockActive(editor, 'heading-two'),
      onSelect: () => toggleBlock(editor, 'heading-two'),
    },
    {
      key: 'heading-three',
      title: '三级标题',
      commandKey: 'Ctrl+3',
      icon: <Looks3 />,
      active: isBlockActive(editor, 'heading-three'),
      onSelect: () => toggleBlock(editor, 'heading-three'),
    },
    {
      key: 'heading-four',
      title: '四级标题',
      commandKey: 'Ctrl+4',
      icon: <Looks4 />,
      active: isBlockActive(editor, 'heading-four'),
      onSelect: () => toggleBlock(editor, 'heading-four'),
    },
    {
      key: 'heading-five',
      title: '五级标题',
      commandKey: 'Ctrl+5',
      icon: <Looks5 />,
      active: isBlockActive(editor, 'heading-five'),
      onSelect: () => toggleBlock(editor, 'heading-five'),
    },
    {
      key: 'heading-six',
      title: '六级标题',
      commandKey: 'Ctrl+6',
      icon: <Looks6 />,
      active: isBlockActive(editor, 'heading-six'),
      onSelect: () => toggleBlock(editor, 'heading-six'),
    },
    { type: 'separator', key: 'separator-1', title: '' },
    {
      key: 'bold',
      title: '加粗',
      commandKey: 'Ctrl+B',
      icon: <FormatBold fontSize="small" />,
      active: isMarkActive(editor, 'bold'),
      onSelect: () => Editor.addMark(editor, 'bold', true),
    },
    {
      key: 'italic',
      title: '斜体',
      commandKey: 'Ctrl+I',
      icon: <FormatItalic fontSize="small" />,
      active: isMarkActive(editor, 'italic'),
      onSelect: () => Editor.addMark(editor, 'italic', true),
    },
    {
      key: 'underline',
      title: '下划线',
      commandKey: 'Ctrl+U',
      icon: <FormatUnderlined fontSize="small" />,
      active: isMarkActive(editor, 'underline'),
      onSelect: () => Editor.addMark(editor, 'underline', true),
    },
    {
      key: 'strikethrough',
      title: '删除线',
      commandKey: 'Alt+Shift+5',
      icon: <FormatStrikethrough fontSize="small" />,
      active: isMarkActive(editor, 'strikethrough'),
      onSelect: () => Editor.addMark(editor, 'strikethrough', true),
    },
    {
      key: 'code',
      title: '代码',
      commandKey: 'Ctrl+`',
      icon: <Code fontSize="small" />,
      active: isMarkActive(editor, 'code'),
      onSelect: () => Editor.addMark(editor, 'code', true),
    },
    { type: 'separator', key: 'separator-2', title: '' },
    {
      key: 'align-left',
      title: '左对齐',
      commandKey: 'Ctrl+Shift+L',
      icon: <FormatAlignLeft fontSize="small" />,
      active: isAlignActive(editor, 'left'),
      onSelect: () => toggleAlign(editor, 'left'),
    },
    {
      key: 'align-center',
      title: '居中对齐',
      commandKey: 'Ctrl+Shift+C',
      icon: <FormatAlignCenter fontSize="small" />,
      active: isAlignActive(editor, 'center'),
      onSelect: () => toggleAlign(editor, 'center'),
    },
    {
      key: 'align-right',
      title: '右对齐',
      commandKey: 'Ctrl+Shift+R',
      icon: <FormatAlignRight fontSize="small" />,
      active: isAlignActive(editor, 'right'),
      onSelect: () => toggleAlign(editor, 'right'),
    },
    {
      key: 'align-justify',
      title: '两端对齐',
      commandKey: 'Ctrl+Shift+J',
      icon: <FormatAlignJustify fontSize="small" />,
      active: isAlignActive(editor, 'justify'),
      onSelect: () => toggleAlign(editor, 'justify'),
    },
    { type: 'separator', key: 'separator-3', title: '' },
    {
      key: 'bulleted-list',
      title: '无序列表',
      commandKey: 'Ctrl+Shift+8',
      icon: <FormatListBulleted fontSize="small" />,
      active: isBlockActive(editor, 'bulleted-list'),
      onSelect: () => toggleBlock(editor, 'bulleted-list'),
    },
    {
      key: 'numbered-list',
      title: '有序列表',
      commandKey: 'Ctrl+Shift+7',
      icon: <FormatListNumbered fontSize="small" />,
      active: isBlockActive(editor, 'numbered-list'),
      onSelect: () => toggleBlock(editor, 'numbered-list'),
    },
    {
      key: 'blockquote',
      title: '引用',
      commandKey: 'Ctrl+Shift+.',
      icon: <FormatQuote fontSize="small" />,
      active: isBlockActive(editor, 'blockquote'),
      onSelect: () => toggleBlock(editor, 'blockquote'),
    },
    {
      key: 'code-block',
      title: '代码块',
      icon: <Code fontSize="small" />,
      active: isBlockActive(editor, 'code-block'),
      onSelect: () => toggleBlock(editor, 'code-block'),
    },
    { type: 'separator', key: 'separator-4', title: '' },
    {
      key: 'link',
      title: '插入链接',
      commandKey: 'Ctrl+K',
      icon: <Link />,
      onSelect: events.openLinkDialog,
    },
    {
      key: 'image',
      title: '插入图片',
      commandKey: 'Ctrl+Shift+I',
      icon: <ImageOutlined fontSize="small" />,
      onSelect: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            insertImage(editor, file);
          }
        };
        input.click();
      },
    },
    {
      key: 'attachment',
      title: '插入附件',
      commandKey: 'Ctrl+Shift+A',
      icon: <InsertDriveFileOutlined fontSize="small" />,
      onSelect: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = (e) => {
          const files = Array.from((e.target as HTMLInputElement).files || []);
          files.forEach(file => {
            insertAttachment(editor, file);
          });
        };
        input.click();
      },
    },
    {
      key: 'table',
      title: '插入表格',
      commandKey: 'Ctrl+Shift+T',
      icon: <TableChartOutlined fontSize="small" />,
      onSelect: events.openTableDialog,
    },
    ...(isInTable(editor) ? [
      {
        key: 'table-row',
        title: '添加行',
        icon: <AddCircleOutline fontSize="small" />,
        onSelect: () => insertTableRow(editor),
      },
      {
        key: 'table-column',
        title: '添加列',
        icon: <AddBox fontSize="small" />,
        onSelect: () => insertTableColumn(editor),
      },
    ] : []),
  ];

  return items.map(item => ({
    ...item,
    sx: {
      p: 0.75,
      borderRadius: 1,
      '&:hover': {
        backgroundColor: 'action.hover',
      },
      '&.Mui-disabled': {
        opacity: 0.5,
      },
    },
  }));
}

// 辅助函数
const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const newProperties: Partial<CustomElement> = {
    type: isActive ? 'paragraph' : format as any,
  }
  Transforms.setNodes(editor, newProperties)
}

const toggleAlign = (editor: CustomEditor, align: 'left' | 'center' | 'right' | 'justify') => {
  const newProperties: Partial<CustomElement> = {
    align,
  }
  Transforms.setNodes(editor, newProperties)
}
