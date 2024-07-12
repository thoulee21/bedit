'use client'

import styles from './page.module.css';

import { Header } from '@/components/Header';
import { createContextMenuItems } from '@/configs/context-menu-items';
import { createToolbarItems } from '@/configs/toolbar-items';
import { roboto } from '@/utils/fonts';
import { ContentEditable, EditableProvider, withEditable } from "@editablejs/editor";
import { createEditor, Transforms } from "@editablejs/models";
import { ContextMenu, useContextMenuEffect, withContextMenu } from '@editablejs/plugin-context-menu';
import { withHistory } from '@editablejs/plugin-history';
import { Toolbar as EditableToolbar, ToolbarComponent, useToolbarEffect, withToolbar } from '@editablejs/plugin-toolbar';
import { withPlugins } from '@editablejs/plugins';
import { Icon } from '@editablejs/ui';
import { CloudQueueRounded } from '@mui/icons-material';
import { Container, createTheme, Paper, Snackbar, ThemeProvider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo, useState } from "react";
import { withDocx } from '../utils/docx/withDocx';

export default function Home() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const appTheme = createTheme({
    typography: {
      fontFamily: roboto.style.fontFamily
    },
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light'
    }
  })

  const editor = useMemo(() => {
    let editable = withEditable(createEditor())
    editable = withToolbar(editable)
    editable = withContextMenu(editable)
    editable = withHistory(editable)
    editable = withPlugins(editable)
    editable = withDocx(editable)

    const { onKeydown } = editable

    editable.onKeydown = ((event) => {
      if (event.key === 'Tab') {
        event.preventDefault()
        Transforms.insertText(editable, '    ')
        return
      }

      if (event.ctrlKey && event.key === 'i') {
        askAI()
        return
      }

      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        //@ts-expect-error
        editable.saveDocx()
        return
      }

      if (event.ctrlKey && event.key === 'o') {
        event.preventDefault()
        //@ts-expect-error
        editable.openDocx()
        return
      }

      onKeydown(event)
    })

    return editable
  }, [])

  const askAI = async () => {
    if (editor.selection) {
      try {
        setSnackbarOpen(true)
        const fragment = editor.getFragment(editor.selection)
        //@ts-expect-error
        const selected = fragment[0].children[0].text

        const headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json"
        }

        const bodyContent = JSON.stringify({
          "prompt": selected,
        });

        const resp = await fetch("//8.130.78.253:8080/chat", {
          method: "POST",
          body: bodyContent,
          headers: headersList
        })
        const aiTxt = await resp.text()

        setSnackbarOpen(false)
        Transforms.insertText(editor, aiTxt)
      }
      catch (e) {
        console.info(e)
      } finally {
        setSnackbarOpen(false)
      }
    }
  }

  useToolbarEffect(() => {
    EditableToolbar.setItems(editor, createToolbarItems(editor))
  }, editor)

  useContextMenuEffect(() => {
    const contextMenu = createContextMenuItems(editor)
    contextMenu.push({
      key: 'ai',
      title: 'Ask AI',
      icon: <Icon name='blockquote' />,
      onSelect: askAI,
      rightText: 'Ctrl + I'
    })

    ContextMenu.setItems(editor, contextMenu)
  }, editor)

  return (
    <ThemeProvider theme={appTheme}>
      <div className={styles.root}>
        <EditableProvider editor={editor}>
          <Header />
          <ToolbarComponent editor={editor} className={styles.toolbar} />

          <Container maxWidth="md" className={styles.main}>
            <ContentEditable
              placeholder="Start typing here..."
            />
          </Container>
        </EditableProvider>

        <Snackbar
          open={snackbarOpen}
          message="Loading ai response..."
          action={<CloudQueueRounded fontSize='inherit' />}
        />
        <Paper className={styles.footer} elevation={5} square />
      </div>
    </ThemeProvider>
  );
}
