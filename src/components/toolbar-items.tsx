import { Editable, useEditable } from '@editablejs/editor'
import { Grid } from '@editablejs/models'
import { HistoryEditor } from '@editablejs/plugin-history'
import { ToolbarItem } from '@editablejs/plugin-toolbar'
import {
  AlignEditor,
  AlignKeys,
  BackgroundColorEditor,
  BlockquoteEditor,
  CodeBlockEditor,
  FontColorEditor,
  FontSizeEditor,
  HeadingEditor,
  HeadingType,
  HrEditor,
  ImageEditor,
  LeadingEditor,
  LinkEditor,
  MarkEditor,
  MarkFormat,
  OrderedListEditor,
  TableEditor,
  TaskListEditor,
  UnorderedListEditor
} from '@editablejs/plugins'
import { DropdownItemProps, Icon, IconMap } from '@editablejs/ui'
import { FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight, Redo, Undo } from '@mui/icons-material'
import { MenuItem, Select, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material'
import React, { FC, useCallback, useState } from 'react'

export const DropDown = ({ values, onValueChange }: {
  values: DropdownItemProps[],
  onValueChange: (value: string) => void
}) => {
  const [value, setValue] = useState(values[0].value);

  return (
    <Select
      variant="standard"
      size="small"
      value={value}
      onChange={(e) => {
        const newValue = e.target.value.toString()
        setValue(newValue)
        onValueChange(newValue)
        console.log(newValue)
      }}
    >
      {values.map((menu) => (
        <MenuItem
          key={menu.value}
          value={menu.value}
        >
          {menu.content ?? menu.value}
        </MenuItem>
      ))}
    </Select>
  )
}

export const ToolButton = ({ children, onClick, disabled, selected }: {
  children: React.ReactNode,
  onClick: () => void,
  disabled?: boolean,
  selected?: boolean
}) => {
  const appTheme = useTheme()

  return (
    <ToggleButton
      size="small"
      value=""
      disabled={disabled}
      selected={selected}
      color="primary"
      sx={{
        color: appTheme.palette.text.secondary,
        '&:hover': {
          color: appTheme.palette.text.primary,
        },
      }}
      onClick={onClick}
    >
      {children}
    </ToggleButton>
  )
}

const MUIcon = ({ name }: { name: keyof typeof IconMap }) => {
  const appTheme = useTheme()
  return (
    <Icon name={name} color={appTheme.palette.text.secondary} />
  )
}

export const AlignDropdown: FC = () => {
  const alignKeys = [
    {
      value: 'left',
      icon: <FormatAlignLeft fontSize='inherit' />,
    },
    {
      value: 'center',
      icon: <FormatAlignCenter fontSize='inherit' />,
    },
    {
      value: 'right',
      icon: <FormatAlignRight fontSize='inherit' />,
    },
    {
      value: 'justify',
      icon: <FormatAlignJustify fontSize='inherit' />
    }
  ]

  const editor = useEditable()

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      exclusive
      value={AlignEditor.queryActive(editor)}
      onChange={(_, value: string) => {
        AlignEditor.toggle(editor, value as AlignKeys)
        console.log(AlignEditor.queryActive(editor));
      }}
    >
      {alignKeys.map((item) => (
        <ToggleButton
          key={item.value}
          value={item.value}
        >
          {item.icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

const marks: MarkFormat[] = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'sub', 'sup']

export const defaultFontColor = '#262626'
export const defaultBackgroundColor = 'transparent'

export const createToolbarItems = (editor: Editable) => {
  const items: ToolbarItem[] = [
    {
      content: (
        <ToolButton
          onClick={() => {
            HistoryEditor.undo(editor)
          }}
          disabled={!HistoryEditor.canUndo(editor)}
        >
          <Undo fontSize='inherit' />
        </ToolButton>
      ),
    },
    {
      content: (
        <ToolButton
          onClick={() => {
            HistoryEditor.redo(editor)
          }}
          disabled={!HistoryEditor.canRedo(editor)}
        >
          <Redo fontSize='inherit' />
        </ToolButton>
      )
    },
  ]
  const markItems: ToolbarItem[] = marks.map(mark => ({
    content: (
      <ToolButton
        onClick={() => {
          MarkEditor.toggle(editor, mark)
        }}
        selected={MarkEditor.isActive(editor, mark)}
      >
        <MUIcon name={mark} />
      </ToolButton>
    )
  }))
  items.push('separator', ...markItems)
  items.push(
    'separator',
    {
      type: 'color-picker',
      defaultValue: '#F5222D',
      defaultColor: {
        color: defaultFontColor,
        title: 'Default Color'
      },
      title: 'Font Color',
      children: <MUIcon name="fontColor" />,
      onSelect: color => {
        FontColorEditor.toggle(editor, color)
      },
    },
    {
      type: 'color-picker',
      defaultValue: '#FADB14',
      defaultColor: {
        color: defaultBackgroundColor,
        title: 'No Background Color',
      },
      title: 'Background Color',
      children: <MUIcon name="backgroundColor" />,
      onSelect: color => {
        BackgroundColorEditor.toggle(editor, color)
      },
    },
  )
  items.push(
    'separator',
    {
      content: (
        <DropDown
          onValueChange={(value) => {
            FontSizeEditor.toggle(editor, value)
          }}
          values={[
            {
              value: '14px',

            },
            {
              value: '16px',
            },
            {
              value: '20px',
            },
            {
              value: '22px',
            },
            {
              value: '24px',
            },
            {
              value: '28px',
            },
          ]}
        />
      )
    },
    {
      content: (
        <DropDown
          values={[
            {
              value: 'paragraph',
              content: 'Paragraph',
            },
            {
              value: 'heading-one',
              content: 'Heading 1',
            },
            {
              value: 'heading-two',
              content: 'Heading 2',
            },
            {
              value: 'heading-three',
              content: 'Heading 3',
            },
            {
              value: 'heading-four',
              content: 'Heading 4',
            },
            {
              value: 'heading-five',
              content: 'Heading 5',
            },
            {
              value: 'heading-six',
              content: 'Heading 6',
            },
          ]}
          onValueChange={(value) => {
            HeadingEditor.toggle(editor, value as HeadingType)
          }}
        />
      )
    },
  )
  items.push(
    'separator',
    {
      type: 'button',
      title: 'Link',
      active: LinkEditor.isActive(editor),
      onToggle: () => {
        LinkEditor.open(editor)
      },
      icon: <MUIcon name="link" />,
    },
    {
      type: 'button',
      title: 'Image',
      active: ImageEditor.isActive(editor),
      onToggle: () => {
        ImageEditor.open(editor)
      },
      icon: <MUIcon name="image" />,
    },
    {
      type: 'button',
      title: 'Blockquote',
      active: BlockquoteEditor.isActive(editor),
      onToggle: () => {
        BlockquoteEditor.toggle(editor)
      },
      icon: <MUIcon name="blockquote" />,
    },
    {
      type: 'button',
      title: 'Unordered List',
      active: !!UnorderedListEditor.queryActive(editor),
      onToggle: () => {
        UnorderedListEditor.toggle(editor)
      },
      icon: <MUIcon name="unorderedList" />,
    },
    {
      type: 'button',
      title: 'Ordered List',
      active: !!OrderedListEditor.queryActive(editor),
      onToggle: () => {
        OrderedListEditor.toggle(editor)
      },
      icon: <MUIcon name="orderedList" />,
    },
    {
      type: 'button',
      title: 'Task List',
      active: !!TaskListEditor.queryActive(editor),
      onToggle: () => {
        TaskListEditor.toggle(editor)
      },
      icon: <MUIcon name="taskList" />,
    },
    {
      type: 'button',
      title: 'Table',
      disabled: !!TableEditor.isActive(editor),
      onToggle: () => {
        TableEditor.insert(editor)
      },
      icon: <MUIcon name="table" />,
    },
    'separator',
    {
      content: <AlignDropdown />
    },
    {
      type: 'dropdown',
      title: 'Leading',
      items: [
        {
          value: 'default',
          content: 'Default',
        },
        {
          value: '1',
        },
        {
          value: '1.15',
        },
        {
          value: '1.5',
        },
        {
          value: '2',
        },
        {
          value: '3',
        },
      ],
      value: LeadingEditor.queryActive(editor) ?? 'default',
      children: <MUIcon name="leading" />,
      onSelect: value => {
        LeadingEditor.toggle(editor, value === 'default' ? undefined : value)
      },
    },
    {
      type: 'button',
      title: 'Horizontal Rule',
      active: HrEditor.isActive(editor),
      onToggle: () => {
        HrEditor.insert(editor)
      },
      icon: <MUIcon name="hr" />,
    },
    'separator',
    {
      type: 'button',
      title: 'Code Block',
      active: CodeBlockEditor.isActive(editor),
      onToggle: () => {
        CodeBlockEditor.insert(editor)
      },
      icon: <MUIcon name="codeBlock" />,
    },
  )

  const grid = Grid.above(editor)
  if (grid) {
    items.push(
      'separator',
      {
        type: 'button',
        title: 'Merge Cells',
        disabled: !Grid.canMerge(editor, grid),
        onToggle: () => {
          Grid.mergeCell(editor, grid)
        },
        icon: <MUIcon name="tableMerge" />,
      },
      {
        type: 'button',
        title: 'Split Cell',
        icon: <MUIcon name="tableSplit" />,
        disabled: !Grid.canSplit(editor, grid),
        onToggle: () => {
          Grid.splitCell(editor, grid)
        },
      },
    )
  }
  return items
}
