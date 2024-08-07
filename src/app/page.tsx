'use client'

import { Chat } from '@/components/Chat';
import { Header } from '@/components/Header';
import { createContextMenuItems } from '@/components/context-menu-items';
import { createSideToolbarItems } from '@/components/side-toolbar-items';
import { createToolbarItems } from '@/components/toolbar-items';
import { checkMarkdownSyntax } from '@/utils/check-markdown-syntax';
import { roboto } from '@/utils/fonts';
import { initialValue } from '@/utils/initial-value';
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
  InlineToolbar,
  useInlineToolbarEffect,
  withInlineToolbar
} from '@editablejs/plugin-toolbar/inline';
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
import { Close, SmartToy } from '@mui/icons-material';
import { Button, CircularProgress, createTheme, Paper, Snackbar, Stack, ThemeProvider } from '@mui/material';
import { useMemo, useState } from "react";
import { withDocx } from '../utils/docx/withDocx';
import { Preferences } from './PreferenceProvider';

export default function Home() {
  const aiLoadingPlaceHolder = 'Loading ai response...'
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackMsg, setSnackMsg] = useState(aiLoadingPlaceHolder)
  const [loading, setLoading] = useState(false)

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
    editable = withInlineToolbar(editable)
    editable = withContextMenu(editable)
    editable = withDocx(editable)

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

      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        //@ts-expect-error
        editable.saveDocx()
        return
      }

      // if (event.ctrlKey && event.key === 'o') {
      //   event.preventDefault()
      //   //@ts-expect-error
      //   editable.openDocx()
      //   return
      // }

      onKeydown(event)
    })

    return editable
  }, [])

  const selectedText = useMemo(() => {
    if (!editor.selection) { return '' }
    const fragments = editor.getFragment(editor.selection)
    let selected = ''
    for (let index = 0; index < fragments.length; index++) {
      //@ts-expect-error
      const children = fragments[index].children;
      for (let i = 0; i < children.length; i++) {
        const item = children[i];
        selected += item.text
      }
    }
    return selected
  }, [editor.selection])

  const askAI = async (type?: string) => {
    if (selectedText) {
      setSnackMsg(aiLoadingPlaceHolder)
      setLoading(true)
      setSnackbarOpen(true)

      try {
        const selected = selectedText.trim()
        const headersList = {
          "Accept": "*/*",
          "Content-Type": "application/json"
        }

        let prompt = ''
        switch (type) {
          case 'abstract':
            prompt = `请为以下文本写摘要："${selected}"，注意：只需要返回摘要内容，不需要返回多余的信息`
            break;
          case 'polish':
            prompt = `请为以下文本进行润色："${selected}"，注意：只需要返回润色后的内容，不需要返回多余的信息`
            break;
          case 'translate':
            prompt = `请将以下文本翻译成中文："${selected}"，注意：只需要返回翻译后的内容，不需要返回多余的信息`
            break;
          case 'continuation':
            prompt = `请续写以下文本："${selected}"，注意：只需要返回续写后的内容，不需要返回多余的信息`
            break;
          case 'correct':
            prompt = `请修正以下文本："${selected}"，注意：只需要返回修正后的内容，不需要返回多余的信息`
            break;
          default:
            prompt = selected;
        }

        if (!prompt) {
          throw new Error(`No text selected`)
        }

        const bodyContent = JSON.stringify({
          "prompt": prompt,
        });

        const resp = await fetch("//8.130.78.253:8080/chat", {
          method: "POST",
          body: bodyContent,
          headers: headersList
        })
        const aiTxt = await resp.text()

        setSnackMsg(aiTxt);
      }
      catch (e) {
        console.error(e)
        setSnackMsg(JSON.stringify(e))
      }
      finally {
        setLoading(false)
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
        return () => 'Waiting for input...'
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

  useInlineToolbarEffect(() => {
    InlineToolbar.setItems(editor, createToolbarItems(editor).slice(3, 15))
  }, editor)

  useSideToolbarMenuEffect((...a) => {
    SideToolbar.setItems(editor, createSideToolbarItems(editor, ...a))
  }, editor)

  useContextMenuEffect(() => {
    let contextMenu = createContextMenuItems(editor)
    contextMenu = contextMenu.concat([
      {
        type: 'separator'
      },
      {
        key: 'ai',
        title: 'Ask AI',
        icon: <SmartToy fontSize='inherit' />,
        disabled: loading || !selectedText,
        onSelect: () => askAI(),
      },
      {
        key: 'ai-abstract',
        title: 'Ask AI: Abstract',
        icon: <SmartToy fontSize='inherit' />,
        disabled: loading || !selectedText,
        onSelect: () => { askAI('abstract') },
      },
      {
        key: 'ai-polish',
        title: 'Ask AI: Polish',
        icon: <SmartToy fontSize='inherit' />,
        disabled: loading || !selectedText,
        onSelect: () => { askAI('polish') },
      },
      {
        key: 'ai-translate',
        title: 'Ask AI: Translate',
        icon: <SmartToy fontSize='inherit' />,
        disabled: loading || !selectedText,
        onSelect: () => { askAI('translate') },
      },
      {
        key: 'ai-continuation',
        title: 'Ask AI: Continuation',
        icon: <SmartToy fontSize='inherit' />,
        disabled: loading || !selectedText,
        onSelect: () => { askAI('continuation') },
      },
      {
        key: 'ai-correct',
        title: 'Ask AI: Correct',
        icon: <SmartToy fontSize='inherit' />,
        disabled: loading || !selectedText,
        onSelect: () => { askAI('correct') },
      }
    ])
    ContextMenu.setItems(editor, contextMenu)
  }, editor)

  const preferences = useMemo(() => ({
    prefersDarkMode,
    setPrefersDarkMode
  }), [prefersDarkMode])

  const snackbarAction = useMemo(() => {
    return (
      loading
        ? <CircularProgress color="inherit" size={15} />
        : (<>
          <Button
            disabled={snackMsg === aiLoadingPlaceHolder}
            onClick={() => {
              setSnackbarOpen(false);

              const madst = MarkdownDeserializer.toMdastWithEditor(editor, snackMsg)
              const content = MarkdownDeserializer.transformWithEditor(editor, madst)
              editor.insertFragment(content)

              setSnackMsg('');
            }}
          >
            Insert
          </Button>
          <Button
            aria-label="close"
            onClick={() => setSnackbarOpen(false)}
          >
            <Close fontSize="small" />
          </Button>
        </>)
    )
  }, [snackMsg, loading, editor])

  return (
    <Preferences.Provider value={preferences}>
      <ThemeProvider theme={appTheme}>
        <EditableProvider editor={editor} value={initialValue}>
          <Paper
            style={{
              backgroundColor: appTheme.palette.background.paper,
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <Header />

            <ToolbarComponent
              editor={editor}
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '0.5rem',
                marginTop: '7vh',
                flexWrap: 'wrap',
              }}
            />

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-start"
            >
              <Chat />
              <Paper
                style={{
                  paddingLeft: '3vw',
                  paddingRight: '3vw',
                  paddingTop: '1vh',
                  paddingBottom: '1vh',
                  marginTop: '1vh',
                  marginBottom: '4vh',
                  borderRadius: '10px'
                }}
                elevation={3}
              >
                <ContentEditable
                  placeholder="Start typing here..."
                  style={{
                    width: '44vw',
                    marginTop: '5vh',
                    marginBottom: '5vh',
                  }}
                />
              </Paper>
            </Stack>

            <Snackbar
              open={snackbarOpen}
              message={snackMsg}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              sx={{
                maxWidth: '40vw',
                maxHeight: '40vh',
              }}
              action={snackbarAction}
            />
          </Paper>
        </EditableProvider>
      </ThemeProvider>
    </Preferences.Provider>
  );
}
