import { CustomElement } from '@/types/slate';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Editor, Node, Path } from 'slate';
import { ReactEditor } from 'slate-react';

interface DocumentOutlineProps {
  editor: Editor;
}

interface HeadingInfo {
  text: string;
  level: number | undefined;
  path: Path;
}

export const DocumentOutline = ({ editor }: DocumentOutlineProps) => {
  const [headings, setHeadings] = React.useState<HeadingInfo[]>([]);

  useEffect(() => {
    const newHeadings = Array.from(
      Editor.nodes(editor, {
        at: [],
        match: n => (n as CustomElement).type?.startsWith('heading'),
      })
    ).map(([node, path]) => ({
      text: Node.string(node),
      level: (node as CustomElement).level,
      path,
    }));

    setHeadings(newHeadings);
  }, [editor]);

  const handleClick = (path: Path) => {
    const start = Editor.start(editor, path);
    ReactEditor.focus(editor);
    editor.select(start);
    const domNode = ReactEditor.toDOMNode(editor, editor);
    const element = domNode.querySelector(`[data-slate-path="${path.join(',')}"]`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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
          <ListItemButton
            onClick={() => handleClick(heading.path)}
            sx={{
              pl: heading.level ? (heading.level - 1) * 2 : 0,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={heading.text}
              primaryTypographyProps={{
                noWrap: true,
                fontSize: heading.level ? `${1.2 - heading.level * 0.1}rem` : '1rem',
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}; 