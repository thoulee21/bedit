import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { SaveOutlined } from '@mui/icons-material';
import { Editor, Element as SlateElement, Text, Node } from 'slate';
import { CustomEditor, CustomElement } from '@/types/slate';

interface SaveFileProps {
  editor: CustomEditor;
}

export const SaveFile = ({ editor }: SaveFileProps) => {
  const handleSave = () => {
    const content = convertToMarkdown(editor);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Tooltip title="保存">
      <IconButton onClick={handleSave} size="small">
        <SaveOutlined />
      </IconButton>
    </Tooltip>
  );
};

const convertToMarkdown = (editor: CustomEditor): string => {
  let result = '';
  let lastType: string | null = null;

  // 遍历所有节点
  const nodes = Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n): n is CustomElement => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          return true;
        }
        return false;
      },
    })
  );

  nodes.forEach(([node]) => {
    const element = node as CustomElement;
    
    // 根据节点类型添加适当的换行
    if (lastType && lastType !== element.type) {
      result += '\n';
    }
    lastType = element.type;

    // 获取节点的文本内容
    const text = element.children
      .map((child: Node) => Text.isText(child) ? child.text : '')
      .join('');

    // 根据节点类型添加格式
    switch (element.type) {
      case 'heading-one':
        result += `# ${text}\n`;
        break;
      case 'heading-two':
        result += `## ${text}\n`;
        break;
      case 'heading-three':
        result += `### ${text}\n`;
        break;
      case 'heading-four':
        result += `#### ${text}\n`;
        break;
      case 'heading-five':
        result += `##### ${text}\n`;
        break;
      case 'heading-six':
        result += `###### ${text}\n`;
        break;
      case 'paragraph':
        result += `${text}\n`;
        break;
      case 'blockquote':
        result += `> ${text}\n`;
        break;
      case 'code-block':
        result += `\`\`\`\n${text}\n\`\`\`\n`;
        break;
      case 'bulleted-list':
        result += `- ${text}\n`;
        break;
      case 'numbered-list':
        result += `1. ${text}\n`;
        break;
      case 'list-item':
        result += `- ${text}\n`;
        break;
      default:
        result += `${text}\n`;
    }
  });

  return result.trim();
};
