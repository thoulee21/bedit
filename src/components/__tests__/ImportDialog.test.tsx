import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImportDialog } from '../dialogs/ImportDialog';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

describe('ImportDialog', () => {
  const onClose = jest.fn();
  const onImport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImportDialog open={true} onClose={onClose} onImport={onImport} />
      </ThemeProvider>
    );

    expect(screen.getByText('导入文档')).toBeInTheDocument();
    expect(screen.getByText('选择文件')).toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(
      <ThemeProvider theme={theme}>
        <ImportDialog open={true} onClose={onClose} onImport={onImport} />
      </ThemeProvider>
    );

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });
    expect(onImport).toHaveBeenCalledWith(file);
    expect(onClose).toHaveBeenCalled();
  });
}); 