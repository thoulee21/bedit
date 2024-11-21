import React from 'react';
import { render, screen } from '@testing-library/react';
import { DocumentOutline } from '../DocumentOutline';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

describe('DocumentOutline', () => {
  const editor = withHistory(withReact(createEditor()));

  it('shows empty state when no headings', () => {
    editor.children = [
      {
        type: 'paragraph',
        children: [{ text: 'Hello World' }],
      },
    ];

    render(
      <ThemeProvider theme={theme}>
        <DocumentOutline editor={editor} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('没有标题')).toBeInTheDocument();
  });

  it('handles item click', () => {
    editor.children = [
      {
        type: 'heading-one',
        children: [{ text: 'Test Heading' }],
      },
    ];

    render(
      <ThemeProvider theme={theme}>
        <DocumentOutline editor={editor} />
      </ThemeProvider>
    );

    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });
}); 