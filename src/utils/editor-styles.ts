import { Theme } from '@mui/material';

// 编辑器主题样式
export const getEditorStyles = (theme: Theme) => ({
  // 基础文本样式
  text: {
    color: theme.palette.text.primary,
    fontSize: '12pt',
    lineHeight: 1.75,
    letterSpacing: '0.01em',
  },

  // 标题样式
  headings: {
    h1: {
      fontSize: '24pt',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: theme.palette.primary.main,
      marginTop: '1.5em',
      marginBottom: '0.5em',
    },
    h2: {
      fontSize: '20pt',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.015em',
      color: theme.palette.text.primary,
      marginTop: '1.4em',
      marginBottom: '0.5em',
    },
    h3: {
      fontSize: '16pt',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: theme.palette.text.primary,
      marginTop: '1.3em',
      marginBottom: '0.5em',
    },
    h4: {
      fontSize: '14pt',
      fontWeight: 600,
      lineHeight: 1.35,
      color: theme.palette.text.primary,
      marginTop: '1.2em',
      marginBottom: '0.5em',
    },
    h5: {
      fontSize: '12pt',
      fontWeight: 600,
      lineHeight: 1.4,
      color: theme.palette.text.primary,
      marginTop: '1.1em',
      marginBottom: '0.5em',
    },
    h6: {
      fontSize: '10pt',
      fontWeight: 600,
      lineHeight: 1.45,
      color: theme.palette.text.primary,
      marginTop: '1em',
      marginBottom: '0.5em',
    },
  },

  // 块级元素样式
  blocks: {
    paragraph: {
      marginBottom: '1em',
    },
    blockquote: {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      margin: '1.5em 0',
      padding: '0.5em 0 0.5em 1em',
      backgroundColor: theme.palette.action.hover,
      borderRadius: '0 4px 4px 0',
      color: theme.palette.text.secondary,
      fontStyle: 'italic',
    },
    codeBlock: {
      margin: '1.5em 0',
      padding: '1em',
      backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
      borderRadius: '4px',
      overflow: 'auto',
      fontSize: '0.9em',
      lineHeight: 1.5,
      fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    },
  },

  // 内联元素样式
  inlines: {
    bold: {
      fontWeight: 600,
    },
    italic: {
      fontStyle: 'italic',
    },
    underline: {
      textDecoration: 'underline',
      textDecorationColor: theme.palette.text.primary,
    },
    strikethrough: {
      textDecoration: 'line-through',
      textDecorationColor: theme.palette.text.secondary,
    },
    code: {
      fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
      backgroundColor: theme.palette.action.hover,
      padding: '0.2em 0.4em',
      borderRadius: '3px',
      fontSize: '0.9em',
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      borderBottom: `1px solid ${theme.palette.primary.main}`,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: `${theme.palette.primary.main}20`,
      },
    },
  },

  // 列表样式
  lists: {
    bulletedList: {
      margin: '1em 0',
      paddingLeft: '2em',
      listStyleType: 'disc',
    },
    numberedList: {
      margin: '1em 0',
      paddingLeft: '2em',
      listStyleType: 'decimal',
    },
    listItem: {
      marginBottom: '0.5em',
      lineHeight: 1.6,
    },
  },

  // 表格样式
  table: {
    container: {
      margin: '1.5em 0',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '4px',
      overflow: 'hidden',
    },
    row: {
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:hover': {
        backgroundColor: `${theme.palette.action.hover}`,
      },
    },
    cell: {
      borderColor: theme.palette.divider,
      padding: '0.75em 1em',
      transition: 'background-color 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },

  // 图片样式
  image: {
    margin: '2em auto',
    maxWidth: '100%',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: theme.shadows[4],
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[8],
      transform: 'translateY(-2px)',
    },
  },

  // 对齐方式
  alignment: {
    left: { textAlign: 'left' },
    center: { textAlign: 'center' },
    right: { textAlign: 'right' },
    justify: { textAlign: 'justify' },
  },
}); 