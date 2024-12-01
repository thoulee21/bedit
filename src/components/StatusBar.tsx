import { CustomEditor } from '@/types/slate';
import { Box, Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import { Editor, Node, Element as SlateElement } from 'slate';
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
      // 获取所有文本节点
      const nodes = Array.from(
        Editor.nodes(editor, {
          at: [],
          match: n => Node.isNode(n),
        })
      );

      // 计算总字符数和词数
      let text = '';
      nodes.forEach(([node]) => {
        if (Node.string(node)) {
          text += Node.string(node);
        }
      });

      const characters = text.length;
      const words = text.trim().split(/\s+/).filter(Boolean).length;

      // 计算行数
      const lines = nodes.filter(([node]) => 
        !Editor.isEditor(node) && 
        SlateElement.isElement(node) &&
        Editor.isBlock(editor, node)
      ).length;

      setWordCount({
        characters,
        words,
        lines: Math.max(1, lines), // 至少有一行
      });
    };

    // 初始更新
    updateWordCount();

    // 监听编辑器变化
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

      const path = editor.selection.anchor.path;
      const blockEntries = Array.from(Editor.nodes(editor, {
        at: [],
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && Editor.isBlock(editor, n),
      }));

      const currentBlockIndex = blockEntries.findIndex(([, p]) => 
        p.every((value, index) => path[index] === value)
      );

      const blockStart = Editor.start(editor, path.slice(0, 1));
      const offset = editor.selection.anchor.offset;
      const beforeText = Editor.string(editor, {
        anchor: blockStart,
        focus: editor.selection.anchor,
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