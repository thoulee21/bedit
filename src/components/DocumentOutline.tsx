import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import { Editor, Element as SlateElement, Text, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { CustomEditor, CustomElement } from '@/types/slate';

interface DocumentOutlineProps {
  editor: CustomEditor;
}

const headingLevels = {
  'heading-one': 1,
  'heading-two': 2,
  'heading-three': 3,
  'heading-four': 4,
  'heading-five': 5,
  'heading-six': 6,
} as const;

export const DocumentOutline = ({ editor }: DocumentOutlineProps) => {
  const theme = useTheme();

  // 获取所有标题节点
  const headings = Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n): n is CustomElement => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          const element = n as CustomElement;
          return Object.keys(headingLevels).includes(element.type);
        }
        return false;
      },
    })
  ).map(([node, path]) => {
    const element = node as CustomElement;
    const text = element.children
      .map((child: Node) => Text.isText(child) ? child.text : '')
      .join('')
      .trim();

    return {
      text,
      level: headingLevels[element.type as keyof typeof headingLevels],
      path,
    };
  });

  // 如果没有标题，显示提示信息
  if (headings.length === 0) {
    return (
      <Box sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          使用工具栏的标题按钮来添加标题
        </Typography>
      </Box>
    );
  }

  // 点击标题时滚动到对应位置
  const handleClick = (path: number[]) => {
    const domNode = ReactEditor.toDOMNode(editor, editor.children[path[0]]);
    domNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {headings.map(({ text, level, path }, index) => (
        <ListItem
          key={index}
          disablePadding
          sx={{
            pl: (level - 1) * 2,
          }}
        >
          <ListItemButton
            onClick={() => handleClick(path)}
            sx={{
              borderRadius: 1,
              mx: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
                color: 'primary.main',
              },
            }}
          >
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                variant: level <= 2 ? 'body1' : 'body2',
                fontWeight: level <= 2 ? 500 : 400,
                color: 'text.primary',
                noWrap: true,
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}; 