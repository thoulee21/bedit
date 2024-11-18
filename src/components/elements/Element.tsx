import React from 'react'
import { RenderElementProps } from 'slate-react'
import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { CustomElement } from '@/types/slate'
import Image from 'next/image'

export const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = element.align ? { textAlign: element.align } : {}
  const customElement = element as CustomElement

  switch (customElement.type) {
    case 'heading-one':
      return <h1 style={style} {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 style={style} {...attributes}>{children}</h2>
    case 'heading-three':
      return <h3 style={style} {...attributes}>{children}</h3>
    case 'heading-four':
      return <h4 style={style} {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 style={style} {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 style={style} {...attributes}>{children}</h6>
    case 'blockquote':
      return (
        <blockquote
          style={{
            borderLeft: '2px solid #ddd',
            marginLeft: 0,
            marginRight: 0,
            paddingLeft: '10px',
            color: '#aaa',
            fontStyle: 'italic',
            ...style
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
            background: '#f4f4f4',
            padding: '10px',
            borderRadius: '4px',
            ...style
          }}
          {...attributes}
        >
          <code>{children}</code>
        </pre>
      )
    case 'bulleted-list':
      return <ul style={style} {...attributes}>{children}</ul>
    case 'numbered-list':
      return <ol style={style} {...attributes}>{children}</ol>
    case 'list-item':
      return <li style={style} {...attributes}>{children}</li>
    case 'link':
      return (
        <a
          {...attributes}
          href={element.url}
          style={{ color: '#0077cc', textDecoration: 'underline', ...style }}
          onClick={(e) => {
            if (element.url) {
              e.preventDefault()
              window.open(element.url, '_blank')
            }
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
            margin: '1em 0',
            textAlign: 'center',
            position: 'relative',
            height: '20em',
            '& > span': {
              maxWidth: '100% !important',
              height: '100% !important'
            }
          }}
        >
          <Image
            src={element.url || ''}
            alt="Inserted content"
            fill
            style={{ objectFit: 'contain' }}
          />
          {children}
        </Box>
      )
    case 'table':
      return (
        <TableContainer {...attributes}>
          <Table size="small">
            <TableBody>
              {children}
            </TableBody>
          </Table>
        </TableContainer>
      )
    case 'table-row':
      return <TableRow {...attributes}>{children}</TableRow>
    case 'table-cell':
      return (
        <TableCell {...attributes} style={style}>
          {children}
        </TableCell>
      )
    default:
      return <p style={style} {...attributes}>{children}</p>
  }
} 