'use client'

import styles from './page.module.css';

import { Header } from '@/components/Header';
import { marks } from '@/utils/mark';
import { ContentEditable, EditableProvider, withEditable } from "@editablejs/editor";
import { createEditor } from "@editablejs/models";
import { ContextMenu, useContextMenuEffect, withContextMenu } from '@editablejs/plugin-context-menu';
import { withHistory } from '@editablejs/plugin-history';
import {
  Toolbar as EditableToolbar,
  ToolbarComponent,
  useToolbarEffect,
  withToolbar
} from '@editablejs/plugin-toolbar';
import { MarkEditor, withPlugins } from '@editablejs/plugins';
import { Icon } from '@editablejs/ui';
import { CloudQueueRounded } from '@mui/icons-material';
import { Paper, Snackbar } from '@mui/material';
import Container from '@mui/material/Container';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useMemo, useState } from "react";
import { withDocx } from '../utils/docx/withDocx';

export default function Home() {
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const editor = useMemo(() => {
    let editable = withEditable(createEditor())
    editable = withToolbar(editable)
    editable = withContextMenu(editable)
    editable = withHistory(editable)
    editable = withPlugins(editable)
    editable = withDocx(editable)

    return editable
  }, [])

  useToolbarEffect(() => {
    EditableToolbar.setItems(editor, marks.map(mark => ({
      type: 'button',
      active: MarkEditor.isActive(editor, mark.name),
      content: (
        <ToggleButton
          key={mark.name}
          value={mark.name}
          selected={MarkEditor.isActive(editor, mark.name)}
          onClick={() => {
            MarkEditor.toggle(editor, mark.name)
          }}
        >
          {mark.icon}
        </ToggleButton>
      )
    })))
  }, editor)

  useContextMenuEffect(() => {
    ContextMenu.setItems(editor, [
      {
        key: 'copy',
        title: '复制',
        icon: <Icon name='copy' />,
        rightText: 'Ctrl+C',
        onSelect: () => {
          editor.copy()
        }
      },
      {
        key: 'paste',
        title: '粘贴',
        icon: <Icon name='paste' />,
        rightText: 'Ctrl+V',
        onSelect: () => {
          editor.insertFromClipboard()
        }
      },
      {
        key: 'ai',
        title: 'Ask AI',
        icon: <Icon name='blockquote' />,
        onSelect: async () => {
          if (editor.selection) {
            try {
              setSnackbarOpen(true)
              const fragment = editor.getFragment(editor.selection)
              //@ts-expect-error
              const selected = fragment[0].children[0].text
              const resp = await fetch(`http://localhost:8080/chat?prompt=${selected}&stream=true`)
              const aiTxt = await resp.text()

              setSnackbarOpen(false)
              editor.insertText(aiTxt)
            }
            catch (e) {
              console.info(e)
            } finally {
              setSnackbarOpen(false)
            }
          }
        }
      }
    ])
  }, editor)

  return (
    <div className={styles.root}>
      <EditableProvider editor={editor}>
        <Header />
        <ToggleButtonGroup
          color='primary'
          size='small'
          className={styles.toolbar}
        >
          <ToolbarComponent editor={editor} />
        </ToggleButtonGroup>

        <Container maxWidth="md" className={styles.main}>
          <ContentEditable placeholder="Waiting for input..." />
        </Container>
      </EditableProvider>

      <Snackbar
        open={snackbarOpen}
        message="Loading ai response..."
        action={<CloudQueueRounded fontSize='inherit' />}
      />
      <Paper className={styles.footer} elevation={5} square />
    </div>
  );
}
