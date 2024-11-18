import { CustomEditor, CustomElement } from '@/types/slate';
import { handleHotkeys, handleFileDrop, insertLink, insertTable } from '@/utils/editor-utils';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import isHotkey from 'is-hotkey';
import React, { useCallback } from 'react';
import { Editor, Element as SlateElement, Transforms, type Descendant } from 'slate';
import { Editable, Slate } from 'slate-react';
import { ContextMenu } from './ContextMenu';
import { Element } from './elements/Element';
import { Leaf } from './elements/Leaf';
import { SideToolbar } from './SideToolbar';
import { LinkDialog } from './dialogs/LinkDialog';
import { TableDialog } from './dialogs/TableDialog';
import { createToolbarItems, ToolbarEvents } from './toolbar-items';

// 定义编辑器快捷键
const EDITOR_HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
  'mod+q': 'blockquote',
  'mod+1': 'heading-one',
  'mod+2': 'heading-two',
  'mod+3': 'heading-three',
  'mod+4': 'heading-four',
  'mod+5': 'heading-five',
  'mod+6': 'heading-six',
  'mod+shift+7': 'numbered-list',
  'mod+shift+8': 'bulleted-list',
  'mod+shift+9': 'code-block',
} as const;

// 定义 props 接口
interface SlateEditorProps {
  editor: CustomEditor;
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

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
  // 标题样式
  '& h1': { fontSize: '24pt', marginTop: '1em', marginBottom: '0.5em' },
  '& h2': { fontSize: '20pt', marginTop: '1em', marginBottom: '0.5em' },
  '& h3': { fontSize: '16pt', marginTop: '1em', marginBottom: '0.5em' },
  '& h4': { fontSize: '14pt', marginTop: '1em', marginBottom: '0.5em' },
  '& h5': { fontSize: '12pt', marginTop: '1em', marginBottom: '0.5em' },
  '& h6': { fontSize: '10pt', marginTop: '1em', marginBottom: '0.5em' },
  // 段落样式
  '& p': { marginBottom: '1em' },
  // 列表样式
  '& ul, & ol': { marginBottom: '1em', paddingLeft: '2em' },
  // 引用样式
  '& blockquote': { margin: '1em 0', padding: '0.5em 1em' },
  // 代码块样式
  '& pre': { margin: '1em 0', padding: '1em', borderRadius: '4px' },
  // 表格样式
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1em',
  },
  '& th, & td': {
    border: `1px solid ${theme.palette.divider}`,
    padding: '0.5em',
  },
}));

export const SlateEditor: React.FC<SlateEditorProps> = ({ editor, value, onChange }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
  const [tableDialogOpen, setTableDialogOpen] = React.useState(false);

  const toolbarEvents: ToolbarEvents = {
    openLinkDialog: () => setLinkDialogOpen(true),
    openTableDialog: () => setTableDialogOpen(true),
  };

  const toolbarItems = createToolbarItems(editor, toolbarEvents);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  // 处理快捷键
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (handleHotkeys(editor, event)) {
      return;
    }
    for (const hotkey in EDITOR_HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault();
        const mark = EDITOR_HOTKEYS[hotkey as keyof typeof EDITOR_HOTKEYS];

        if (mark.startsWith('heading-')) {
          toggleBlock(editor, mark);
        } else if (['numbered-list', 'bulleted-list', 'code-block', 'blockquote'].includes(mark)) {
          toggleBlock(editor, mark);
        } else {
          toggleMark(editor, mark);
        }
      }
    }
  };

  // 添加右键菜单状态
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  // 处理右键点击
  const handleContextMenu = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX,
          mouseY: event.clientY,
        }
        : null,
    );
  }, [contextMenu]);

  // 关闭右键菜单
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // 监听滚动事件
  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsScrolled(target.scrollTop > 10);
    };

    const editorElement = document.querySelector('.editor-content');
    if (editorElement) {
      editorElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <Slate
      editor={editor}
      initialValue={value}
      onChange={onChange}
    >
      <Box
        className="editor-content"
        sx={{
          height: '100%',
          overflow: 'auto',
          overscrollBehavior: 'none',
          backgroundColor: 'background.paper',
          position: 'relative',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme => theme.palette.divider,
            borderRadius: '4px',
            '&:hover': {
              background: theme => theme.palette.action.hover,
            },
          },
        }}
        onContextMenu={handleContextMenu}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleFileDrop(editor, e)}
      >
        <StyledEditable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="开始输入..."
          onKeyDown={handleKeyDown}
        />
        <SideToolbar />
      </Box>

      {/* 右键菜单 */}
      <ContextMenu
        editor={editor}
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : null
        }
        onClose={handleCloseContextMenu}
      />

      <LinkDialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onConfirm={(url, text) => {
          insertLink(editor, url, text);
          setLinkDialogOpen(false);
        }}
      />

      <TableDialog
        open={tableDialogOpen}
        onClose={() => setTableDialogOpen(false)}
        onConfirm={(rows, cols) => {
          insertTable(editor, rows, cols);
          setTableDialogOpen(false);
        }}
      />
    </Slate>
  );
};

// 获取快捷键提示文本
const getHotkeyText = (key: string): string => {
  for (const hotkey in EDITOR_HOTKEYS) {
    if (EDITOR_HOTKEYS[hotkey as keyof typeof EDITOR_HOTKEYS] === key) {
      return ` (${hotkey.replace('mod', isMac() ? '⌘' : 'Ctrl')})`;
    }
  }
  return '';
};

// 检测是否为 Mac 系统
const isMac = () => {
  return typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
};

// 辅助函数
const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const newProperties: Partial<CustomElement> = {
    type: isActive ? 'paragraph' : format as any,
  };
  Transforms.setNodes(editor, newProperties);
};

const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: CustomEditor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as CustomElement).type === format,
  });
  return !!match;
};

const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};

export default SlateEditor; 