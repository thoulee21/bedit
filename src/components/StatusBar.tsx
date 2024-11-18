import React from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';
import { Editor, Node, Element, Path } from 'slate';
import { CustomEditor } from '@/types/slate';
import { ReactEditor } from 'slate-react';

interface StatusBarProps {
  editor: CustomEditor;
}

export const StatusBar = ({ editor }: StatusBarProps) => {
  const [wordCount, setWordCount] = React.useState({
    characters: 0,
    words: 0,
    lines: 0,
  });

  const [cursorPosition, setCursorPosition] = React.useState({
    line: 1,
    column: 1,
  });

  // 更新字数统计
  React.useEffect(() => {
    const updateWordCount = () => {
      const nodes = Array.from(
        Editor.nodes(editor, {
          at: [],
          match: n => Element.isElement(n),
        })
      );

      const text = Editor.string(editor, []);
      const characters = text.length;
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const lines = nodes.filter(([node]) => 
        Element.isElement(node) && 
        (!Node.string(node).trim() || Node.string(node).includes('\n'))
      ).length + 1;

      setWordCount({
        characters,
        words,
        lines,
      });
    };

    updateWordCount();

    const { onChange } = editor;
    editor.onChange = (...args) => {
      onChange(...args);
      updateWordCount();
    };

    return () => {
      editor.onChange = onChange;
    };
  }, [editor]);

  // 更新光标位置
  React.useEffect(() => {
    const updateCursorPosition = () => {
      if (!editor.selection) {
        setCursorPosition({ line: 1, column: 1 });
        return;
      }

      // 获取当前光标所在的路径
      const path = editor.selection.focus.path;
      
      // 计算行数
      const blockEntries = Array.from(Editor.nodes(editor, {
        at: [],
        match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      }));
      
      const currentBlockIndex = blockEntries.findIndex(([, p]) => 
        Path.isAncestor(p, path) || Path.equals(p, path)
      );

      // 计算列数
      const blockPath = blockEntries[currentBlockIndex][1];
      const blockStart = Editor.start(editor, blockPath);
      const offset = editor.selection.focus.offset;
      const beforeText = Editor.string(editor, {
        anchor: blockStart,
        focus: editor.selection.focus,
      });

      setCursorPosition({
        line: currentBlockIndex + 1,
        column: beforeText.length + 1,
      });
    };

    // 初始更新
    updateCursorPosition();

    // 监听选择变化
    const onSelectionChange = () => {
      if (ReactEditor.isFocused(editor)) {
        updateCursorPosition();
      }
    };

    document.addEventListener('selectionchange', onSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [editor]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '24px',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 1200,
        mt: '-1px',
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ height: '100%' }}
      >
        <Typography variant="caption" color="text.secondary">
          字符数: {wordCount.characters}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          词数: {wordCount.words}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          行数: {wordCount.lines}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          行 {cursorPosition.line}, 列 {cursorPosition.column}
        </Typography>
      </Stack>
    </Box>
  );
}; 