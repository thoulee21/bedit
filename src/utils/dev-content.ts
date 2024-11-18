import { Descendant } from 'slate';

// 仅在开发环境使用的测试内容
export const DEV_INITIAL_CONTENT: Descendant[] = [
  {
    type: 'heading-one',
    children: [{ text: '欢迎使用 BEdit 编辑器' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
  {
    type: 'heading-two',
    children: [{ text: '基本功能演示' }],
  },
  {
    type: 'paragraph',
    children: [
      { text: '这是一个段落，演示基本的文本格式：' },
      { text: '粗体', bold: true },
      { text: '、' },
      { text: '斜体', italic: true },
      { text: '、' },
      { text: '下划线', underline: true },
      { text: '、' },
      { text: '删除线', strikethrough: true },
      { text: '、' },
      { text: '行内代码', code: true },
      { text: '。' },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
  {
    type: 'heading-three',
    children: [{ text: '列表示例' }],
  },
  {
    type: 'bulleted-list',
    children: [{ text: '无序列表项目 1' }],
  },
  {
    type: 'bulleted-list',
    children: [{ text: '无序列表项目 2' }],
  },
  {
    type: 'numbered-list',
    children: [{ text: '有序列表项目 1' }],
  },
  {
    type: 'numbered-list',
    children: [{ text: '有序列表项目 2' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
  {
    type: 'heading-three',
    children: [{ text: '引用和代码块' }],
  },
  {
    type: 'blockquote',
    children: [{ text: '这是一个引用块，用于展示重要的引用内容。' }],
  },
  {
    type: 'code-block',
    children: [{ text: 'function hello() {\n  console.log("Hello, World!");\n}' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
  {
    type: 'heading-three',
    children: [{ text: '对齐方式' }],
  },
  {
    type: 'paragraph',
    align: 'left',
    children: [{ text: '这是左对齐的文本' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: '这是居中对齐的文本' }],
  },
  {
    type: 'paragraph',
    align: 'right',
    children: [{ text: '这是右对齐的文本' }],
  },
  {
    type: 'paragraph',
    align: 'justify',
    children: [{ text: '这是两端对齐的文本，当文本较长时，可以看到两端对齐的效果。这是两端对齐的文本，当文本较长时，可以看到两端对齐的效果。' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
  {
    type: 'heading-three',
    children: [{ text: '链接和图片' }],
  },
  {
    type: 'paragraph',
    children: [
      { text: '这是一个' },
      {
        type: 'link',
        url: 'https://github.com',
        children: [{ text: '链接示例' }],
      },
      { text: '，点击可以访问。' },
    ],
  },
  {
    type: 'image',
    url: '/images/demo.jpg',
    children: [{ text: '' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
  {
    type: 'heading-three',
    children: [{ text: '表格示例' }],
  },
  {
    type: 'table',
    children: [
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [{ text: '表头 1' }],
          },
          {
            type: 'table-cell',
            children: [{ text: '表头 2' }],
          },
          {
            type: 'table-cell',
            children: [{ text: '表头 3' }],
          },
        ],
      },
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [{ text: '单元格 1' }],
          },
          {
            type: 'table-cell',
            children: [{ text: '单元格 2' }],
          },
          {
            type: 'table-cell',
            children: [{ text: '单元格 3' }],
          },
        ],
      },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
  {
    type: 'heading-three',
    children: [{ text: '快捷键提示' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '• Ctrl+B：加粗' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '• Ctrl+I：斜体' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '• Ctrl+U：下划线' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '• Ctrl+1 到 Ctrl+6：一级到六级标题' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '• Ctrl+[：减少缩进' }],
  },
  {
    type: 'paragraph',
    children: [{ text: '• Ctrl+]：增加缩进' }],
  },
]; 