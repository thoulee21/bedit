'use client'

import styles from './page.module.css';

import { Header } from '@/components/Header';
import { createContextMenuItems } from '@/components/context-menu-items';
import { createSideToolbarItems } from '@/components/side-toolbar-items';
import { createToolbarItems } from '@/components/toolbar-items';
import { checkMarkdownSyntax } from '@/config/check-markdown-syntax';
import { roboto } from '@/utils/fonts';
import { initialValue } from '@/utils/initial-value';
import { css as codemirrorCss } from '@codemirror/lang-css';
import { html as codemirrorHtml } from '@codemirror/lang-html';
import { javascript as codemirrorJavascript } from '@codemirror/lang-javascript';
import { HTMLDeserializer } from '@editablejs/deserializer/html';
import { MarkdownDeserializer } from '@editablejs/deserializer/markdown';
import {
  ContentEditable,
  Editable,
  EditableProvider,
  isTouchDevice,
  parseDataTransfer,
  Placeholder,
  useIsomorphicLayoutEffect,
  withEditable
} from "@editablejs/editor";
import { createEditor, Editor, Range, Transforms } from "@editablejs/models";
import { withCodeBlock } from '@editablejs/plugin-codeblock';
import {
  ContextMenu,
  useContextMenuEffect,
  withContextMenu
} from '@editablejs/plugin-context-menu';
import { withHistory } from '@editablejs/plugin-history';
import { TitleEditor, withTitle } from '@editablejs/plugin-title';
import { withTitleHTMLDeserializerTransform } from '@editablejs/plugin-title/deserializer/html';
import { withTitleHTMLSerializerTransform } from '@editablejs/plugin-title/serializer/html';
import {
  Toolbar as EditableToolbar,
  ToolbarComponent,
  useToolbarEffect,
  withToolbar
} from '@editablejs/plugin-toolbar';
import {
  SideToolbar,
  useSideToolbarMenuEffect,
  withSideToolbar
} from '@editablejs/plugin-toolbar/side';
import { MentionUser, withMention, withPlugins } from '@editablejs/plugins';
import { withHTMLDeserializerTransform } from '@editablejs/plugins/deserializer/html';
import {
  withMarkdownDeserializerPlugin,
  withMarkdownDeserializerTransform
} from '@editablejs/plugins/deserializer/markdown';
import { withHTMLSerializerTransform } from '@editablejs/plugins/serializer/html';
import {
  withMarkdownSerializerPlugin,
  withMarkdownSerializerTransform
} from '@editablejs/plugins/serializer/markdown';
import { withTextSerializerTransform } from '@editablejs/plugins/serializer/text';
import { HTMLSerializer } from '@editablejs/serializer/html';
import { Icon } from '@editablejs/ui';
import { CloudQueueRounded } from '@mui/icons-material';
import { Container, createTheme, Paper, Snackbar, ThemeProvider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo, useState } from "react";
import { withDocx } from '../utils/docx/withDocx';
import { Preferences } from './PreferenceProvider';

export default function Home() {
  const systemPrefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [prefersDarkMode, setPrefersDarkMode] = useState(systemPrefersDarkMode);

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

    editable = withHistory(editable)
    editable = withPlugins(editable)
    editable = withMention(editable, {
      onSearch: _ => {
        return new Promise<MentionUser[]>(resolve => {
          const users: MentionUser[] = [{
            id: '1',
            name: 'John Doe',
            avatar: 'https://i.pravatar.cc/150?img=1',
          }]

          resolve(users)
        })
      },
      match: () => !Editor.above(editor, { match: n => TitleEditor.isTitle(editor, n) }),
    })

    editable = withTitle(editable)
    editable = withToolbar(editable)
    editable = withContextMenu(editable)
    editable = withDocx(editable)

    editable = withCodeBlock(editable, {
      languages: [
        {
          value: 'plain',
          content: 'Plain text',
        },
        {
          value: 'javascript',
          content: 'JavaScript',
          plugin: codemirrorJavascript(),
        },
        {
          value: 'html',
          content: 'HTML',
          plugin: codemirrorHtml(),
        },
        {
          value: 'css',
          content: 'CSS',
          plugin: codemirrorCss(),
        },
      ],
    })

    if (!isTouchDevice) {
      editable = withSideToolbar(editable, {
        match: n => !TitleEditor.isTitle(editable, n),
      })
    }

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

        const madst = MarkdownDeserializer.toMdastWithEditor(editor, aiTxt)
        const content = MarkdownDeserializer.transformWithEditor(editor, madst)
        editor.insertFragment(content)
      }
      catch (e) {
        console.info(e)
      } finally {
        setSnackbarOpen(false)
      }
    }
  }

  useIsomorphicLayoutEffect(() => {
    const unsubscribe = Placeholder.subscribe(editor, ([node]) => {
      if (
        Editable.isFocused(editor) &&
        Editor.isBlock(editor, node) &&
        !TitleEditor.isTitle(editor, node)
      )
        return () => "Type / evoke more"
    })
    return () => unsubscribe()
  }, [editor])

  useIsomorphicLayoutEffect(() => {
    withMarkdownDeserializerPlugin(editor) // Adds a markdown deserializer plugin to the editor
    withMarkdownSerializerPlugin(editor) // Adds a markdown serializer plugin to the editor
    withTextSerializerTransform(editor) // Adds a text serializer transform to the editor
    withHTMLSerializerTransform(editor) // Adds an HTML serializer transform to the editor
    withMarkdownSerializerTransform(editor) // Adds a markdown serializer transform to the editor
    withHTMLDeserializerTransform(editor) // Adds an HTML deserializer transform to the editor
    withMarkdownDeserializerTransform(editor) // Adds a markdown deserializer transform to the editor

    HTMLDeserializer.withEditor(editor, withTitleHTMLDeserializerTransform, {})
    HTMLSerializer.withEditor(editor, withTitleHTMLSerializerTransform, {})

    const { onPaste } = editor
    editor.onPaste = event => {
      const { clipboardData, type } = event
      if (!clipboardData || !editor.selection) return onPaste(event)
      const { text, fragment, html, files } = parseDataTransfer(clipboardData)
      const isPasteText = type === 'pasteText'
      if (!isPasteText && (fragment.length > 0 || files.length > 0)) {
        return onPaste(event)
      }
      if (Range.isExpanded(editor.selection)) {
        Transforms.delete(editor)
      }
      const anchor = Range.start(editor.selection)
      onPaste(event)
      // check markdown syntax
      if (checkMarkdownSyntax(text, html) && editor.selection) {
        const focus = Range.end(editor.selection)
        Promise.resolve().then(() => {
          const madst = MarkdownDeserializer.toMdastWithEditor(editor, text)
          const content = MarkdownDeserializer.transformWithEditor(editor, madst)
          editor.selection = { anchor, focus }
          editor.insertFragment(content)
        })
      }
    }

    return () => {
      editor.onPaste = onPaste
    }
  }, [editor])

  useToolbarEffect(() => {
    EditableToolbar.setItems(editor, createToolbarItems(editor))
  }, editor)

  useSideToolbarMenuEffect((...a) => {
    SideToolbar.setItems(editor, createSideToolbarItems(editor, ...a))
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

  const preferences = useMemo(() => ({
    prefersDarkMode,
    setPrefersDarkMode
  }), [prefersDarkMode])

  return (
    <Preferences.Provider value={preferences}>
      <ThemeProvider theme={appTheme}>
        <EditableProvider editor={editor} value={initialValue}>
          <Paper className={styles.root} color={appTheme.palette.background.paper}>
            <Header />

            <ToolbarComponent editor={editor} className={styles.toolbar} />
            <Container maxWidth="md" className={styles.main}>
              <ContentEditable
                lang='en-US'
                placeholder="Start typing here..."
              />
            </Container>

            <Snackbar
              open={snackbarOpen}
              message="Loading ai response..."
              action={<CloudQueueRounded fontSize='inherit' />}
            />
            <Paper className={styles.footer} elevation={5} square />
          </Paper>
        </EditableProvider>
      </ThemeProvider>
    </Preferences.Provider>
  );
}
