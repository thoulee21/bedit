import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportDialog } from '../dialogs/ExportDialog';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

describe('ExportDialog', () => {
  const onClose = jest.fn();
  const onExport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <ThemeProvider theme={theme}>
        <ExportDialog open={true} onClose={onClose} onExport={onExport} />
      </ThemeProvider>
    );

    expect(screen.getByText('导出文档')).toBeInTheDocument();
    expect(screen.getByText('纯文本文档')).toBeInTheDocument();
    expect(screen.getByText('Markdown 文档')).toBeInTheDocument();
    expect(screen.getByText('Word 文档')).toBeInTheDocument();
    expect(screen.getByText('JSON 文档')).toBeInTheDocument();
  });

  it('calls onExport with correct format when format is selected', () => {
    render(
      <ThemeProvider theme={theme}>
        <ExportDialog open={true} onClose={onClose} onExport={onExport} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('纯文本文档'));
    expect(onExport).toHaveBeenCalledWith('txt');
  });
}); 