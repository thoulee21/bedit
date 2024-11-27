import React, { CSSProperties } from 'react'
import { RenderElementProps } from 'slate-react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
  Link,
  Paper,
} from '@mui/material'
import { CustomElement } from '@/types/slate'
import Image from 'next/image'
import { ElementStyle } from '@/types/style';

export const Element = ({ attributes, children, element }: RenderElementProps) => {
  const theme = useTheme()
  const customStyle = (element as any).style as ElementStyle;
  const style = {
    ...customStyle,
  };
  const customElement = element as CustomElement

  const renderHeading = (level: number) => {
    const styles: CSSProperties = {
      ...style,
      fontSize: {
        1: '2.75rem',
        2: '2.25rem',
        3: '1.85rem',
        4: '1.5rem',
        5: '1.25rem',
        6: '1.1rem',
      }[level],
      fontWeight: level <= 2 ? 800 : 600,
      lineHeight: level <= 2 ? 1.3 : 1.4,
      marginTop: level <= 2 ? '2em' : '1.8em',
      marginBottom: '0.8em',
      padding: level <= 2 ? '0.2em 0' : undefined,
      color: {
        1: theme.palette.primary.main,
        2: theme.palette.primary.dark,
        3: theme.palette.text.primary,
        4: theme.palette.text.primary,
        5: theme.palette.text.primary,
        6: theme.palette.text.primary,
      }[level],
      borderBottom: {
        1: `3px solid ${theme.palette.primary.main}`,
        2: `2px solid ${theme.palette.primary.main}`,
        3: `1px solid ${theme.palette.divider}`,
        4: 'none',
        5: 'none',
        6: 'none',
      }[level],
      letterSpacing: level <= 2 ? '-0.02em' : 'normal',
      position: 'relative' as const,
    }

    return (
      <Box
        sx={{
          position: 'relative',
          '&::before': level <= 3 ? {
            content: '""',
            position: 'absolute',
            left: '-1rem',
            top: '0.3em',
            bottom: '0.3em',
            width: '4px',
            backgroundColor: level === 1
              ? theme.palette.primary.main
              : level === 2
                ? theme.palette.primary.light
                : theme.palette.divider,
            borderRadius: '2px',
          } : undefined,
          '&:hover': level <= 3 ? {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.03)'
              : 'rgba(0, 0, 0, 0.02)',
            transition: 'background-color 0.2s ease',
          } : undefined,
        }}
      >
        {React.createElement(
          `h${level}`,
          { ...attributes, style: styles },
          children
        )}
      </Box>
    )
  }

  switch (customElement.type) {
    case 'heading-one':
      return renderHeading(1)
    case 'heading-two':
      return renderHeading(2)
    case 'heading-three':
      return renderHeading(3)
    case 'heading-four':
      return renderHeading(4)
    case 'heading-five':
      return renderHeading(5)
    case 'heading-six':
      return renderHeading(6)

    case 'paragraph':
      return (
        <p
          {...attributes}
          style={{
            ...style,
            margin: '0.5em 0',
            lineHeight: 1.75,
            color: theme.palette.text.primary,
          }}
        >
          {children}
        </p>
      )

    case 'blockquote':
      return (
        <blockquote
          {...attributes}
          style={{
            ...style,
            margin: '1.5em 0',
            padding: '0.5em 0 0.5em 1em',
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.03)',
            borderRadius: '0 4px 4px 0',
            color: theme.palette.text.secondary,
            fontStyle: 'italic',
          }}
        >
          {children}
        </blockquote>
      )

    case 'code-block':
      return (
        <pre
          {...attributes}
          style={{
            ...style,
            margin: '1.5em 0',
            padding: '1em',
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.03)',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.9em',
            lineHeight: 1.5,
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            color: theme.palette.mode === 'dark'
              ? theme.palette.primary.light
              : theme.palette.primary.dark,
          }}
        >
          <code>{children}</code>
        </pre>
      )

    case 'bulleted-list':
      return (
        <ul
          {...attributes}
          style={{
            ...style,
            margin: '1em 0',
            paddingLeft: '2em',
            listStyle: 'disc',
            color: theme.palette.text.primary,
          }}
        >
          {children}
        </ul>
      )

    case 'numbered-list':
      return (
        <ol
          {...attributes}
          style={{
            ...style,
            margin: '1em 0',
            paddingLeft: '2em',
            listStyle: 'decimal',
            color: theme.palette.text.primary,
          }}
        >
          {children}
        </ol>
      )

    case 'list-item':
      return (
        <li
          {...attributes}
          style={{
            marginBottom: '0.5em',
            lineHeight: 1.6,
            color: theme.palette.text.primary,
          }}
        >
          {children}
        </li>
      )

    case 'link':
      return (
        <Link
          {...attributes}
          href={element.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              color: theme.palette.primary.dark,
            },
            cursor: 'pointer',
          }}
        >
          {children}
        </Link>
      )

    case 'image':
      return (
        <Box
          {...attributes}
          contentEditable={false}
          sx={{
            margin: '1em 0',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              maxWidth: '100%',
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: theme.shadows[2],
              display: 'inline-block',
              '&:hover': {
                boxShadow: theme.shadows[4],
              },
              transition: 'box-shadow 0.2s ease',
              position: 'relative',
              width: 'fit-content',
            }}
          >
            <Image
              src={element.url || ''}
              alt="Inserted content"
              width={800}
              height={600}
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                console.error('Failed to load image:', element.url);
              }}
            />
          </Box>
          {children}
        </Box>
      )

    case 'attachment':
      return (
        <Box
          {...attributes}
          contentEditable={false}
          sx={{
            margin: '1em 0',
            padding: '1em',
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.03)',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          }}
          onClick={() => {
            if (element.url) {
              window.open(element.url, '_blank');
            }
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ fontWeight: 500, mb: 0.5 }}>{element.name}</Box>
            <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              {formatFileSize(element.size || 0)}
            </Box>
          </Box>
          {children}
        </Box>
      )

    case 'table':
      return (
        <Box
          {...attributes}
          sx={{
            my: 2,
            overflowX: 'auto',
            overflowY: 'visible',
            position: 'relative',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.divider,
              borderRadius: '4px',
              '&:hover': {
                background: theme.palette.action.hover,
              },
            },
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 1,
              boxShadow: theme.shadows[1],
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'visible',
              minWidth: 'min-content',
            }}
          >
            <Table size="small" sx={{ tableLayout: 'fixed' }}>
              <TableBody>{children}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      )

    case 'table-row':
      return (
        <TableRow
          {...attributes}
          sx={{
            '&:last-child td, &:last-child th': { border: 0 },
            '&:nth-of-type(odd)': {
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.02)',
            },
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {children}
        </TableRow>
      )

    case 'table-cell':
      return (
        <TableCell
          {...attributes}
          sx={{
            borderColor: 'divider',
            padding: '12px 16px',
            position: 'relative',
            minWidth: 100,
            maxWidth: 400,
            verticalAlign: 'top',
            '& > *': {
              maxWidth: '100%',
            },
            '&:hover::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(0, 0, 0, 0.01)',
              pointerEvents: 'none',
            },
          }}
        >
          {children}
        </TableCell>
      )

    // ... 其他 case 保持不变
  }
}

// 辅助函数：格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}; 