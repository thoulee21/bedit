import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MaterialUISwitch } from '../MaterialUISwitch';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

describe('MaterialUISwitch', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MaterialUISwitch checked={false} onChange={onChange} />
      </ThemeProvider>
    );

    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
  });

  it('handles change events', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MaterialUISwitch checked={false} onChange={onChange} />
      </ThemeProvider>
    );

    const input = container.querySelector('input[type="checkbox"]');
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalled();
  });

  it('reflects checked state', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MaterialUISwitch checked={true} onChange={onChange} />
      </ThemeProvider>
    );

    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toBeChecked();
  });

  it('handles size prop correctly', () => {
    const { container, rerender } = render(
      <ThemeProvider theme={theme}>
        <MaterialUISwitch checked={false} onChange={onChange} size="small" />
      </ThemeProvider>
    );

    expect(container.firstChild).toHaveClass('MuiSwitch-sizeSmall');

    rerender(
      <ThemeProvider theme={theme}>
        <MaterialUISwitch checked={false} onChange={onChange} size="medium" />
      </ThemeProvider>
    );

    expect(container.firstChild).not.toHaveClass('MuiSwitch-sizeSmall');
  });
}); 