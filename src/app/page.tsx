'use client'
import styles from './page.module.css';

import { ContentEditable, EditableProvider, withEditable } from "@editablejs/editor";
import { Transforms, createEditor } from "@editablejs/models";
import { ContextMenu, useContextMenuEffect, withContextMenu } from '@editablejs/plugin-context-menu';
import { withHistory } from '@editablejs/plugin-history';
import { Toolbar, ToolbarComponent, useToolbarEffect, withToolbar } from '@editablejs/plugin-toolbar';
import { MarkEditor, MarkFormat, withPlugins } from '@editablejs/plugins';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import SubscriptIcon from '@mui/icons-material/Subscript';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import { useMemo } from "react";
import { withDocx } from '../utils/docx/withDocx';

interface Mark {
  name: MarkFormat;
  icon: any;
}

const marks: Mark[] = [
  {
    name: 'bold',
    icon: <FormatBoldIcon />,
  },
  {
    name: 'italic',
    icon: <FormatItalicIcon />,
  },
  {
    name: 'underline',
    icon: <FormatUnderlinedIcon />,
  },
  {
    name: 'strikethrough',
    icon: <FormatStrikethroughIcon />,
  },
  {
    name: 'code',
    icon: <CodeIcon />,
  },
  {
    name: 'sub',
    icon: <SubscriptIcon />,
  },
  {
    name: 'sup',
    icon: <SuperscriptIcon />,
  },
]

export default function Home() {
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
    Toolbar.setItems(editor, marks.map(mark => ({
      type: 'button',
      active: MarkEditor.isActive(editor, mark.name),
      onToggle: () => {
        MarkEditor.toggle(editor, mark.name)
      },
      icon: mark.icon,
    })))
  }, editor)

  useContextMenuEffect(() => {
    ContextMenu.setItems(editor, [
      {
        key: 'copy',
        title: '复制',
        icon: <ContentCopyIcon />,
        onSelect: () => {
          editor.copy()
        }
      },
      {
        key: 'paste',
        title: '粘贴',
        icon: <ContentPasteIcon />,
        onSelect: () => {
          editor.insertFromClipboard()
        }
      },
      {
        key: 'upload',
        title: '上传',
        icon: <FileUploadIcon />,
        content:
          <div>
            <input
              type="file"
              accept=".docx"
              onChange={async (event) => {
                const fileObj = event.target.files && event.target.files[0];
                if (!fileObj) {
                  return;
                }

                const reader = new FileReader();
                reader.readAsArrayBuffer(fileObj);

                reader.onload = function () {
                  Transforms.deselect(editor);
                  //@ts-expect-error
                  editor.loadDocx(this.result);
                }
              }}
            />
          </div>
      }
    ])
  }, editor)

  return (
    <div className={styles.main}>
      <EditableProvider editor={editor}>
        <ToolbarComponent editor={editor} className={styles.toolbar} />
        <ContentEditable placeholder="Waiting for input..." />
      </EditableProvider>
    </div>
  );
}
