import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AboutDialog } from '../dialogs/AboutDialog';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

describe('AboutDialog', () => {
  const onClose = jest.fn();

  it('renders correctly when open', () => {
    render(
      <ThemeProvider theme={theme}>
        <AboutDialog open={true} onClose={onClose} />
      </ThemeProvider>
    );

    expect(screen.getByText('关于 BEdit')).toBeInTheDocument();
    expect(screen.getByText(/BEdit 是一个基于 Web 的富文本编辑器/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <ThemeProvider theme={theme}>
        <AboutDialog open={true} onClose={onClose} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('关闭'));
    expect(onClose).toHaveBeenCalled();
  });
}); 