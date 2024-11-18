export const HOTKEYS = {
  'mod+b': { key: 'bold', title: '加粗' },
  'mod+i': { key: 'italic', title: '斜体' },
  'mod+u': { key: 'underline', title: '下划线' },
  'mod+`': { key: 'code', title: '行内代码' },
  'mod+q': { key: 'blockquote', title: '引用' },
  'mod+1': { key: 'heading-one', title: '一级标题' },
  'mod+2': { key: 'heading-two', title: '二级标题' },
  'mod+3': { key: 'heading-three', title: '三级标题' },
  'mod+4': { key: 'heading-four', title: '四级标题' },
  'mod+5': { key: 'heading-five', title: '五级标题' },
  'mod+6': { key: 'heading-six', title: '六级标题' },
  'mod+shift+7': { key: 'numbered-list', title: '有序列表' },
  'mod+shift+8': { key: 'bulleted-list', title: '无序列表' },
  'mod+shift+9': { key: 'code-block', title: '代码块' },
  'mod+z': { key: 'undo', title: '撤销' },
  'mod+shift+z': { key: 'redo', title: '重做' },
  'mod+l': { key: 'link', title: '插入链接' },
  'mod+shift+i': { key: 'image', title: '插入图片' },
  'mod+shift+t': { key: 'table', title: '插入表格' },
  'mod+[': { key: 'indent', title: '增加缩进' },
  'mod+]': { key: 'outdent', title: '减少缩进' },
} as const;

export const getHotkeyText = (key: string): string => {
  for (const hotkey in HOTKEYS) {
    if (HOTKEYS[hotkey as keyof typeof HOTKEYS].key === key) {
      return ` (${formatHotkey(hotkey)})`;
    }
  }
  return '';
};

export const formatHotkey = (hotkey: string): string => {
  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  return hotkey
    .replace(/mod/g, isMac ? '⌘' : 'Ctrl')
    .replace(/shift/g, isMac ? '⇧' : 'Shift')
    .replace(/\+/g, isMac ? ' ' : '+')
    .toUpperCase();
}; 