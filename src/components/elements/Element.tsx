import React from 'react'
import { RenderElementProps } from 'slate-react'
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, useTheme } from '@mui/material'
import { CustomElement } from '@/types/slate'
import Image from 'next/image'

export const Element = ({ attributes, children, element }: RenderElementProps) => {
  const theme = useTheme()
  const style = element.align ? { textAlign: element.align } : {}
  const customElement = element as CustomElement

  switch (customElement.type) {
    case 'heading-one':
      return (
        <h1 
          style={{
            ...style,
            fontSize: '2.5em',
            fontWeight: 600,
            color: theme.palette.text.primary,
            marginTop: '1em',
            marginBottom: '0.5em',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }} 
          {...attributes}
        >
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 
          style={{
            ...style,
            fontSize: '2em',
            fontWeight: 600,
            color: theme.palette.text.primary,
            marginTop: '1em',
            marginBottom: '0.5em',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }} 
          {...attributes}
        >
          {children}
        </h2>
      )
    case 'heading-three':
      return (
        <h3 
          style={{
            ...style,
            fontSize: '1.75em',
            fontWeight: 600,
            color: theme.palette.text.primary,
            marginTop: '1em',
            marginBottom: '0.5em',
            lineHeight: 1.3,
          }} 
          {...attributes}
        >
          {children}
        </h3>
      )
    case 'heading-four':
      return (
        <h4 
          style={{
            ...style,
            fontSize: '1.5em',
            fontWeight: 600,
            color: theme.palette.text.primary,
            marginTop: '1em',
            marginBottom: '0.5em',
            lineHeight: 1.3,
          }} 
          {...attributes}
        >
          {children}
        </h4>
      )
    case 'heading-five':
      return (
        <h5 
          style={{
            ...style,
            fontSize: '1.25em',
            fontWeight: 600,
            color: theme.palette.text.primary,
            marginTop: '1em',
            marginBottom: '0.5em',
            lineHeight: 1.4,
          }} 
          {...attributes}
        >
          {children}
        </h5>
      )
    case 'heading-six':
      return (
        <h6 
          style={{
            ...style,
            fontSize: '1.1em',
            fontWeight: 600,
            color: theme.palette.text.primary,
            marginTop: '1em',
            marginBottom: '0.5em',
            lineHeight: 1.4,
          }} 
          {...attributes}
        >
          {children}
        </h6>
      )
    case 'blockquote':
      return (
        <blockquote
          style={{
            ...style,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            margin: '1.5em 0',
            padding: '0.5em 0 0.5em 1em',
            backgroundColor: theme.palette.action.hover,
            borderRadius: '0 4px 4px 0',
            color: theme.palette.text.secondary,
            fontStyle: 'italic',
          }}
          {...attributes}
        >
          {children}
        </blockquote>
      )
    case 'code-block':
      return (
        <pre
          style={{
            ...style,
            margin: '1.5em 0',
            padding: '1em',
            backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.9em',
            lineHeight: 1.5,
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          }}
          {...attributes}
        >
          <code style={{ color: theme.palette.text.primary }}>{children}</code>
        </pre>
      )
    case 'bulleted-list':
      return (
        <ul 
          style={{
            ...style,
            margin: '1em 0',
            paddingLeft: '2em',
            listStyleType: 'disc',
          }} 
          {...attributes}
        >
          {children}
        </ul>
      )
    case 'numbered-list':
      return (
        <ol 
          style={{
            ...style,
            margin: '1em 0',
            paddingLeft: '2em',
            listStyleType: 'decimal',
          }} 
          {...attributes}
        >
          {children}
        </ol>
      )
    case 'list-item':
      return (
        <li 
          style={{
            ...style,
            marginBottom: '0.5em',
            lineHeight: 1.6,
          }} 
          {...attributes}
        >
          {children}
        </li>
      )
    case 'link':
      return (
        <a
          {...attributes}
          href={element.url}
          style={{ 
            color: theme.palette.primary.main,
            textDecoration: 'none',
            borderBottom: `1px solid ${theme.palette.primary.main}`,
            transition: 'all 0.2s ease-in-out',
            ...style,
          }}
          onClick={(e) => {
            if (element.url) {
              e.preventDefault()
              window.open(element.url, '_blank')
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.primary.main + '20'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {children}
        </a>
      )
    case 'image':
      return (
        <Box
          {...attributes}
          contentEditable={false}
          sx={{
            margin: '2em auto',
            textAlign: 'center',
            position: 'relative',
            height: '20em',
            maxWidth: '90%',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: theme.shadows[4],
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: theme.shadows[8],
              transform: 'translateY(-2px)',
            },
            '& > span': {
              maxWidth: '100% !important',
              height: '100% !important',
            },
          }}
        >
          <Image
            src={element.url || ''}
            alt="Inserted content"
            fill
            style={{ 
              objectFit: 'contain',
              backgroundColor: theme.palette.background.paper,
            }}
          />
          {children}
        </Box>
      )
    case 'table':
      return (
        <TableContainer 
          {...attributes}
          sx={{
            margin: '1.5em 0',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Table 
            size="small"
            sx={{
              '& th, & td': {
                borderColor: theme.palette.divider,
                padding: '0.75em 1em',
              },
              '& tr:nth-of-type(even)': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <TableBody>
              {children}
            </TableBody>
          </Table>
        </TableContainer>
      )
    case 'table-row':
      return (
        <TableRow 
          {...attributes}
          sx={{
            '&:hover': {
              backgroundColor: `${theme.palette.action.hover} !important`,
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
          style={style}
          sx={{
            transition: 'background-color 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {children}
        </TableCell>
      )
    default:
      return (
        <p 
          style={{
            ...style,
            margin: '1em 0',
            lineHeight: 1.75,
            color: theme.palette.text.primary,
          }} 
          {...attributes}
        >
          {children}
        </p>
      )
  }
} 