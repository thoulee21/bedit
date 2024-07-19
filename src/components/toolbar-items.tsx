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
import {
  CheckBox,
  Code,
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Image,
  Link,
  Redo,
  Undo
} from '@mui/icons-material'
import { MenuItem, Select, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material'
import React, { FC, useState } from 'react'

const fontSizes = [
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
]

const headings = [
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
]

const leadings = [
  {
    value: 'default',
    content: 'Leading',
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
]

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
      key={children?.toString()}
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
    <Icon
      name={name}
      key={name}
      color={appTheme.palette.text.secondary}
      style={{ fontSize: '20px' }}
    />
  )
}

export const AlignDropdown: FC = () => {
  const alignKeys = [
    {
      value: 'left',
      icon: <FormatAlignLeft fontSize='small' />,
    },
    {
      value: 'center',
      icon: <FormatAlignCenter fontSize='small' />,
    },
    {
      value: 'right',
      icon: <FormatAlignRight fontSize='small' />,
    },
    {
      value: 'justify',
      icon: <FormatAlignJustify fontSize='small' />
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
          key='undo'
          onClick={() => {
            HistoryEditor.undo(editor)
          }}
          disabled={!HistoryEditor.canUndo(editor)}
        >
          <Undo fontSize='small' />
        </ToolButton>
      ),
    },
    {
      content: (
        <ToolButton
          key='redo'
          onClick={() => {
            HistoryEditor.redo(editor)
          }}
          disabled={!HistoryEditor.canRedo(editor)}
        >
          <Redo fontSize='small' />
        </ToolButton>
      )
    },
  ]
  const markItems: ToolbarItem[] = marks.map(mark => ({
    content: (
      <ToolButton
        key={mark}
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
          key='font-size'
          onValueChange={(value) => {
            FontSizeEditor.toggle(editor, value)
          }}
          values={fontSizes}
        />
      )
    },
    'separator',
    {
      content: (
        <DropDown
          key='heading'
          values={headings}
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
      content: (
        <ToolButton
          onClick={() => {
            LinkEditor.open(editor)
          }}
          selected={LinkEditor.isActive(editor)}
        >
          <Link fontSize='small' />
        </ToolButton>
      )
    },
    {
      content: (
        <ToolButton
          onClick={() => {
            ImageEditor.open(editor)
          }}
          selected={ImageEditor.isActive(editor)}
        >
          <Image fontSize='small' />
        </ToolButton>
      )
    },
    {
      content: (
        <ToolButton
          onClick={() => {
            BlockquoteEditor.toggle(editor)
          }}
          selected={BlockquoteEditor.isActive(editor)}
        >
          <FormatQuote fontSize="small" />
        </ToolButton>
      )
    },
    {
      content: (
        <ToolButton
          onClick={() => {
            UnorderedListEditor.toggle(editor)
          }}
          selected={!!UnorderedListEditor.queryActive(editor)}
        >
          <FormatListBulleted fontSize="small" />
        </ToolButton>
      )
    },
    {
      content: (
        <ToolButton
          onClick={() => {
            OrderedListEditor.toggle(editor)
          }}
          selected={!!OrderedListEditor.queryActive(editor)}
        >
          <FormatListNumbered fontSize="small" />
        </ToolButton>
      )
    },
    {
      content: (
        <ToolButton
          onClick={() => {
            TaskListEditor.toggle(editor)
          }}
          selected={!!TaskListEditor.queryActive(editor)}
        >
          <CheckBox fontSize="small" />
        </ToolButton>
      )
    },
    {
      content: (
        <ToolButton
          onClick={() => {
            TableEditor.insert(editor)
          }}
          selected={TableEditor.isActive(editor)}
        >
          <MUIcon name="table" />
        </ToolButton>
      )
    },
    'separator',
    { content: <AlignDropdown /> },
    'separator',
    {
      content: (
        <DropDown
          key='leading'
          values={leadings}
          onValueChange={value => {
            LeadingEditor.toggle(editor, value === 'default' ? undefined : value)
          }}
        />
      )
    },
    'separator',
    {
      content: (
        <ToolButton
          onClick={() => {
            HrEditor.insert(editor)
          }}
          selected={HrEditor.isActive(editor)}
        >
          <MUIcon name="hr" />
        </ToolButton>
      )
    },
    'separator',
    {
      content: (
        <ToolButton
          onClick={() => {
            CodeBlockEditor.insert(editor)
          }}
          selected={CodeBlockEditor.isActive(editor)}
        >
          <Code fontSize='small' />
        </ToolButton>
      )
    }
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
