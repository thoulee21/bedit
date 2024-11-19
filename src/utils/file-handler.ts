import { Editor, Element as SlateElement, Node, Text } from 'slate';
import { CustomEditor, CustomElement, CustomText } from '@/types/slate';
import { saveAs } from 'file-saver';
import { htmlToSlate, markdownToSlate, slateToHtml, slateToMarkdown, textToSlate } from './file-converter';

// 文件类型定义
export type FileType = 'txt' | 'md' | 'html' | 'docx' | 'pdf';

// 导入文件
export const importFile = async (file: File): Promise<Node[]> => {
  const text = await file.text();
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'md':
      return markdownToSlate(text);
    case 'html':
      return htmlToSlate(text);
    case 'txt':
    default:
      return textToSlate(text);
  }
};

// 导出文件
export const exportFile = (
  nodes: Node[],
  type: FileType,
  filename: string
): void => {
  let content: string;
  let mimeType: string;

  switch (type) {
    case 'md':
      content = slateToMarkdown(nodes);
      mimeType = 'text/markdown';
      break;
    case 'html':
      content = slateToHtml(nodes);
      mimeType = 'text/html';
      break;
    case 'txt':
    default:
      content = nodes
        .map(node => {
          if ('children' in node) {
            return node.children
              .map((child: { text: any; }) => ('text' in child ? child.text : ''))
              .join('');
          }
          return '';
        })
        .join('\n\n');
      mimeType = 'text/plain';
  }

  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  saveAs(blob, `${filename}.${type}`);
};

// 自动保存
export const autoSave = (nodes: Node[]): void => {
  try {
    localStorage.setItem('editor-content', JSON.stringify(nodes));
    localStorage.setItem('editor-timestamp', new Date().toISOString());
  } catch (error) {
    console.error('Auto save failed:', error);
  }
};

// 加载自动保存的内容
export const loadAutoSave = (): {
  content: Node[] | null;
  timestamp: Date | null;
} => {
  try {
    const content = localStorage.getItem('editor-content');
    const timestamp = localStorage.getItem('editor-timestamp');

    return {
      content: content ? JSON.parse(content) : null,
      timestamp: timestamp ? new Date(timestamp) : null,
    };
  } catch (error) {
    console.error('Load auto save failed:', error);
    return { content: null, timestamp: null };
  }
};

// 清除自动保存的内容
export const clearAutoSave = (): void => {
  try {
    localStorage.removeItem('editor-content');
    localStorage.removeItem('editor-timestamp');
  } catch (error) {
    console.error('Clear auto save failed:', error);
  }
};

// 检查是否有自动保存的内容
export const hasAutoSave = (): boolean => {
  return !!localStorage.getItem('editor-content');
};

// 获取最近文档列表
export const getRecentDocs = (): {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}[] => {
  try {
    const recentDocs = localStorage.getItem('recent-docs');
    return recentDocs ? JSON.parse(recentDocs) : [];
  } catch (error) {
    console.error('Get recent docs failed:', error);
    return [];
  }
};

// 添加到最近文档列表
export const addToRecentDocs = (
  title: string,
  content: Node[]
): void => {
  try {
    const recentDocs = getRecentDocs();
    const preview = content
      .map(node => {
        if ('children' in node) {
          return node.children
            .map((child: { text: any; }) => ('text' in child ? child.text : ''))
            .join('');
        }
        return '';
      })
      .join(' ')
      .slice(0, 100);

    const newDoc = {
      id: Date.now().toString(),
      title,
      timestamp: new Date(),
      preview,
    };

    const updatedDocs = [newDoc, ...recentDocs.slice(0, 9)];
    localStorage.setItem('recent-docs', JSON.stringify(updatedDocs));
  } catch (error) {
    console.error('Add to recent docs failed:', error);
  }
};

// 从最近文档列表中移除
export const removeFromRecentDocs = (id: string): void => {
  try {
    const recentDocs = getRecentDocs();
    const updatedDocs = recentDocs.filter(doc => doc.id !== id);
    localStorage.setItem('recent-docs', JSON.stringify(updatedDocs));
  } catch (error) {
    console.error('Remove from recent docs failed:', error);
  }
};

const getNodeText = (node: Node): string => {
  if (Text.isText(node)) {
    return node.text;
  } else if ('children' in node) {
    return node.children
      .map((child: CustomText | CustomElement) => {
        if (Text.isText(child)) {
          return child.text;
        }
        return '';
      })
      .join('');
  }
  return '';
};

const convertToText = (node: Node): string => {
  if (Text.isText(node)) {
    return node.text;
  } else if ('children' in node) {
    return node.children
      .map((child: CustomText | CustomElement) => {
        if (Text.isText(child)) {
          return child.text;
        }
        return '';
      })
      .join('');
  }
  return '';
};

const parseMarkdown = (content: string): Node[] => {
  return content.split('\n').map((line): CustomElement => {
    return {
      type: 'paragraph',
      children: [{ text: line }],
    } as CustomElement;
  });
};
  