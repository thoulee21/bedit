import { CustomEditor, CustomElement } from '@/types/slate';
import { Box, IconButton, Stack } from '@mui/material';
import isHotkey from 'is-hotkey';
import React, { useCallback } from 'react';
import { Descendant, Editor, Element as SlateElement, Transforms } from 'slate';
import { Editable, Slate } from 'slate-react';
import { ContextMenu } from './ContextMenu';
import { Element } from './elements/Element';
import { Leaf } from './elements/Leaf';
import { SideToolbar } from './SideToolbar';
import { createToolbarItems } from './toolbar-items';
import { ToolbarTooltip } from './ToolbarTooltip';

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

const SlateEditor: React.FC<SlateEditorProps> = ({ editor, value, onChange }) => {
  const toolbarItems = createToolbarItems(editor);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  // 处理快捷键
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
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
    },
    [editor]
  );

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

  return (
    <Slate 
      editor={editor} 
      initialValue={value} 
      onChange={onChange}
    >
      {/* 工具栏 */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          p: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexWrap: 'wrap',
          backgroundColor: 'background.paper',
        }}
      >
        {toolbarItems.map((item) => 
          item.type === 'separator' ? (
            <Box
              key={item.key}
              sx={{
                height: 24,
                borderLeft: '1px solid',
                borderColor: 'divider',
                mx: 0.5,
              }}
            />
          ) : (
            <ToolbarTooltip
              key={item.key}
              title={item.title}
              commandKey={item.key}
            >
              <IconButton
                size="small"
                onClick={item.onSelect}
                disabled={item.disabled}
                color={item.active ? 'primary' : 'default'}
                sx={{ 
                  p: 0.75,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                {item.icon}
              </IconButton>
            </ToolbarTooltip>
          )
        )}
      </Stack>

      <Box 
        sx={{ 
          height: 'calc(100% - 56px)', 
          overflow: 'auto',
          backgroundColor: 'background.paper',
          position: 'relative',
        }}
        onContextMenu={handleContextMenu}
      >
        <Editable 
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="开始输入..."
          onKeyDown={handleKeyDown}
          style={{
            minHeight: '100%',
            padding: '2rem',
            outline: 'none',
          }}
        />
        <SideToolbar />
      </Box>

      {/* 添加右键菜单 */}
      <ContextMenu
        editor={editor}
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : null
        }
        onClose={handleCloseContextMenu}
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
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });
  return !!match;
};

const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};

export default SlateEditor; 