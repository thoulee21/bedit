import { Editor, Element, Transforms, Node, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { CustomEditor, CustomElement, CustomText } from '@/types/slate';
import isHotkey from 'is-hotkey';

// 定义标记类型
export type MarkFormat = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code';

// 定义块级元素类型
export type BlockFormat = 
  | 'paragraph'
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'heading-four'
  | 'heading-five'
  | 'heading-six'
  | 'numbered-list'
  | 'bulleted-list'
  | 'list-item'
  | 'blockquote'
  | 'code-block';

// 定义对齐方式类型
export type AlignFormat = 'left' | 'center' | 'right' | 'justify';

// 切换标记
export const toggleMark = (editor: CustomEditor, format: MarkFormat) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// 检查标记是否激活
export const isMarkActive = (editor: CustomEditor, format: MarkFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// 切换块级样式
export const toggleBlock = (editor: CustomEditor, format: BlockFormat) => {
  const isActive = isBlockActive(editor, format);

  Transforms.setNodes<CustomElement>(
    editor,
    {
      type: isActive ? 'paragraph' : format,
    },
    { match: n => Editor.isBlock(editor, n) }
  );
};

// 检查块级样式是否激活
export const isBlockActive = (editor: CustomEditor, format: BlockFormat) => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      (n as CustomElement).type === format,
  });
  return !!match;
};

// 切换对齐方式
export const toggleAlign = (editor: CustomEditor, align: AlignFormat) => {
  const isActive = isAlignActive(editor, align);
  const newProperties: Partial<CustomElement> = {
    align: isActive ? undefined : align,
  };
  Transforms.setNodes<CustomElement>(editor, newProperties);
};

// 检查对齐方式是否激活
export const isAlignActive = (editor: CustomEditor, align: AlignFormat) => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      (n as CustomElement).align === align,
  });
  return !!match;
};

// 创建自定义编辑器
export const withCustomEditor = (editor: Editor & ReactEditor) => {
  const customEditor = editor as CustomEditor;
  const { isInline, isVoid } = customEditor;

  // 重写 isInline 方法
  customEditor.isInline = (element: CustomElement) => {
    return ['link'].includes(element.type) || isInline(element);
  };

  // 重写 isVoid 方法，添加 attachment 类型
  customEditor.isVoid = (element: CustomElement) => {
    return ['image', 'attachment'].includes(element.type) || isVoid(element);
  };

  // 添加列表相关的方法
  const getListType = (format: string): CustomElement | null => {
    switch (format) {
      case 'numbered-list':
        return { 
          type: 'numbered-list', 
          children: [{ type: 'list-item', children: [{ text: '' }] }] 
        } as CustomElement;
      case 'bulleted-list':
        return { 
          type: 'bulleted-list', 
          children: [{ type: 'list-item', children: [{ text: '' }] }] 
        } as CustomElement;
      case 'list-item':
        return { 
          type: 'list-item', 
          children: [{ text: '' }] 
        } as CustomElement;
      default:
        return null;
    }
  };

  // 转换为列表
  customEditor.toggleList = (format: string) => {
    const isList = format === 'bulleted-list' || format === 'numbered-list';
    const isActive = isListActive(customEditor, format);

    Transforms.unwrapNodes(customEditor, {
      match: n =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        (n as CustomElement).type &&
        ['bulleted-list', 'numbered-list'].includes((n as CustomElement).type),
      split: true,
    });

    if (!isActive && isList) {
      const listType = getListType(format);
      if (listType) {
        Transforms.wrapNodes(customEditor, listType);
      }
    }
  };

  return customEditor;
};

// 检查是否在表格中
export const isInTable = (editor: CustomEditor) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table',
  });
  return !!match;
};

// 检查列表是否激活
export const isListActive = (editor: CustomEditor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      (n as CustomElement).type === format,
  });
  return !!match;
};

// 处理快捷键
export const handleHotkeys = (editor: CustomEditor, event: React.KeyboardEvent) => {
  if (isHotkey('mod+b', event)) {
    event.preventDefault();
    toggleMark(editor, 'bold');
    return true;
  }
  if (isHotkey('mod+i', event)) {
    event.preventDefault();
    toggleMark(editor, 'italic');
    return true;
  }
  if (isHotkey('mod+u', event)) {
    event.preventDefault();
    toggleMark(editor, 'underline');
    return true;
  }
  if (isHotkey('mod+shift+7', event)) {
    event.preventDefault();
    editor.toggleList('numbered-list');
    return true;
  }
  if (isHotkey('mod+shift+8', event)) {
    event.preventDefault();
    editor.toggleList('bulleted-list');
    return true;
  }
  return false;
};

// 插入附件
export const insertAttachment = (editor: CustomEditor, file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    const attachment = {
      type: 'attachment',
      name: file.name,
      size: file.size,
      mimeType: file.type,
      url: URL.createObjectURL(file),
      children: [{ text: '' }],
    } as CustomElement;
    
    Transforms.insertNodes(editor, attachment);
    Transforms.move(editor); // 移动光标到附件后面
  };
  reader.readAsDataURL(file);
};

// 插入图片
export const insertImage = (editor: CustomEditor, file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    const url = reader.result as string;
    const image = {
      type: 'image',
      url,
      children: [{ text: '' }],
    } as CustomElement;
    
    Transforms.insertNodes(editor, image);
    Transforms.move(editor);
  };
  reader.readAsDataURL(file);
};

// 处理文件拖放
export const handleFileDrop = (
  editor: CustomEditor,
  event: React.DragEvent<HTMLDivElement>
) => {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      insertImage(editor, file);
    } else {
      insertAttachment(editor, file);
    }
  });
};

// 插入链接
export const insertLink = (editor: CustomEditor, url: string, text: string) => {
  const link = {
    type: 'link',
    url,
    children: [{ text }],
  } as CustomElement;
  Transforms.insertNodes(editor, link);
};

// 插入表格
export const insertTable = (editor: CustomEditor, rows: number, cols: number) => {
  const createCell = (): CustomElement => ({
    type: 'table-cell' as const,
    children: [{ text: '' }] as CustomText[],
  });

  const createRow = (): CustomElement => ({
    type: 'table-row' as const,
    children: Array.from({ length: cols }, () => createCell()),
  });

  const table: CustomElement = {
    type: 'table' as const,
    children: Array.from({ length: rows }, () => createRow()),
  };

  Transforms.insertNodes(editor, table);
};

// 插入表格行
export const insertTableRow = (editor: CustomEditor) => {
  const row = {
    type: 'table-row',
    children: [
      { type: 'table-cell', children: [{ text: '' }] },
      { type: 'table-cell', children: [{ text: '' }] },
      { type: 'table-cell', children: [{ text: '' }] },
    ],
  } as CustomElement;
  Transforms.insertNodes(editor, row);
};

// 插入表格列
export const insertTableColumn = (editor: CustomEditor) => {
  const [table] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && (n as CustomElement).type === 'table',
  });
  if (table) {
    const [node, path] = table;
    const rows = (node as CustomElement).children;
    rows.forEach((row: Node, index: number) => {
      const cell = { type: 'table-cell', children: [{ text: '' }] } as CustomElement;
      Transforms.insertNodes(editor, cell, {
        at: [...path, index, (row as CustomElement).children.length],
      });
    });
  }
};

// 添加新的工具函数
export const getCurrentBlock = (editor: CustomEditor) => {
  const [block] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n),
    mode: 'lowest',
  });
  return block;
};

export const getParentBlock = (editor: CustomEditor) => {
  const [block] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n),
    mode: 'lowest',
    at: Path.parent(editor.selection?.anchor.path || []),
  });
  return block;
}; 