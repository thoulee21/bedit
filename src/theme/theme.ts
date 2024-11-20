import { createTheme, alpha } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import { themeVariables } from './variables';

export const getTheme = (mode: PaletteMode) => {
  const variables = themeVariables[mode];

  // 将变量应用到 document
  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });

  return createTheme({
    palette: {
      mode,
      primary: {
        main: variables['--primary-main'],
        light: variables['--primary-light'],
        dark: variables['--primary-dark'],
        contrastText: variables['--primary-contrast'],
      },
      background: {
        default: variables['--background-default'],
        paper: variables['--background-paper'],
      },
      text: {
        primary: variables['--text-primary'],
        secondary: variables['--text-secondary'],
        disabled: variables['--text-disabled'],
      },
      divider: variables['--divider'],
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(0, 0, 0, 0.3)',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      // ... 其他组件样式覆盖
    },
  });
}; 