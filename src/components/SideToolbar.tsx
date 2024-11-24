import { CustomEditor } from '@/types/slate';
import { IconButton, Paper, Portal, Stack, Tooltip } from '@mui/material';
import React from 'react';
import { Editor, Range } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { createSideToolbarItems } from './side-toolbar-items';

export const SideToolbar = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const editor = useSlate() as CustomEditor;
  const [show, setShow] = React.useState(false);
  const [position, setPosition] = React.useState({ top: -10000, left: -10000 });

  React.useEffect(() => {
    const updateToolbar = () => {
      const el = ref.current;
      const { selection } = editor;

      if (!el) {
        return;
      }

      if (
        !selection ||
        !ReactEditor.isFocused(editor) ||
        Range.isCollapsed(selection) ||
        Editor.string(editor, selection) === ''
      ) {
        setShow(false);
        return;
      }

      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount === 0) {
        return;
      }

      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();

      setPosition({
        top: rect.top - el.offsetHeight - 6 + window.pageYOffset,
        left: rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2,
      });
      setShow(true);
    };

    // 初始更新
    updateToolbar();

    // 监听选择变化
    const onSelectionChange = () => {
      if (ReactEditor.isFocused(editor)) {
        updateToolbar();
      }
    };

    document.addEventListener('selectionchange', onSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [editor]);

  const toolbarItems = createSideToolbarItems(editor);

  return (
    <Portal>
      <Paper
        ref={ref}
        sx={{
          padding: 0.5,
          position: 'absolute',
          zIndex: 1,
          top: position.top,
          left: position.left,
          visibility: show ? 'visible' : 'hidden',
          opacity: show ? 1 : 0,
          transition: 'opacity 0.2s',
          backgroundColor: 'background.paper',
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Stack direction="row" spacing={0.5}>
          {toolbarItems.map((item) => (
            <Tooltip key={item.key} title={item.title}>
              <IconButton
                size="small"
                onClick={item.onSelect}
                disabled={item.disabled}
                sx={{
                  p: 0.5,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      </Paper>
    </Portal>
  );
}; 