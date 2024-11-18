import React from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';
import { Editor } from 'slate';
import { CustomEditor } from '@/types/slate';

interface StatusBarProps {
  editor: CustomEditor;
}

export const StatusBar = ({ editor }: StatusBarProps) => {
  // 计算字数
  const wordCount = React.useMemo(() => {
    const text = Editor.string(editor, []);
    return {
      characters: text.length,
      words: text.trim().split(/\s+/).filter(Boolean).length,
      lines: text.split('\n').length,
    };
  }, [editor]);

  // 获取当前光标位置
  const cursorPosition = React.useMemo(() => {
    if (!editor.selection) return { line: 1, column: 1 };
    
    const text = Editor.string(editor, []);
    const offset = Editor.start(editor, editor.selection).offset;
    
    const lines = text.slice(0, offset).split('\n');
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
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