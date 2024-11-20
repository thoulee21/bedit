import React, { useEffect } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Editor, Node } from 'slate';
import { useSlate } from 'slate-react';
import { CustomElement } from '@/types/slate';

interface DocumentOutlineProps {
  editor: Editor;
}

interface HeadingInfo {
  text: string;
  level: number | undefined;
}

export const DocumentOutline = ({ editor }: DocumentOutlineProps) => {
  const [headings, setHeadings] = React.useState<HeadingInfo[]>([]);

  useEffect(() => {
    const newHeadings = Array.from(
      Editor.nodes(editor, {
        at: [],
        match: n => (n as CustomElement).type?.startsWith('heading'),
      })
    ).map(([node]) => ({
      text: Node.string(node),
      level: (node as CustomElement).level,
    }));

    setHeadings(newHeadings);
  }, [editor]);

  if (headings.length === 0) {
    return (
      <Box sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          没有标题
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {headings.map((heading, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton>
            <ListItemText primary={heading.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}; 