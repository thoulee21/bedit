import { Editor, Element as SlateElement, Node, Text } from 'slate';
import { CustomEditor, CustomElement, CustomText } from '@/types/slate';
import { htmlToSlate, markdownToSlate, slateToHtml, slateToMarkdown, textToSlate } from './file-converter';
import { saveAs } from 'file-saver';

// 支持的文件类型
export type FileFormat = 'txt' | 'md' | 'html' | 'docx' | 'pdf';

// 文件处理选项
interface ProcessOptions {
  preserveFormatting?: boolean;
  includeMetadata?: boolean;
  encoding?: string;
}

// 文件元数据
interface FileMetadata {
  title: string;
  author?: string;
  createdAt: Date;
  modifiedAt: Date;
  format: FileFormat;
  size: number;
}

// 处理结果
interface ProcessResult {
  content: Node[];
  metadata: FileMetadata;
  success: boolean;
  error?: string;
}

// 导入文件
export const importFile = async (
  file: File,
  options: ProcessOptions = {}
): Promise<ProcessResult> => {
  try {
    const text = await file.text();
    const format = file.name.split('.').pop()?.toLowerCase() as FileFormat;
    let content: Node[];

    switch (format) {
      case 'md':
        content = markdownToSlate(text);
        break;
      case 'html':
        content = htmlToSlate(text);
        break;
      case 'txt':
      default:
        content = textToSlate(text);
    }

    const metadata: FileMetadata = {
      title: file.name,
      createdAt: new Date(),
      modifiedAt: new Date(),
      format,
      size: file.size,
    };

    return {
      content,
      metadata,
      success: true,
    };
  } catch (error) {
    console.error('Import failed:', error);
    return {
      content: [{ type: 'paragraph', children: [{ text: '' }] }],
      metadata: {
        title: file.name,
        createdAt: new Date(),
        modifiedAt: new Date(),
        format: 'txt',
        size: 0,
      },
      success: false,
      error: error instanceof Error ? error.message : '导入失败',
    };
  }
};

// 导出文件
export const exportFile = (
  content: Node[],
  format: FileFormat,
  filename: string,
  options: ProcessOptions = {}
): void => {
  try {
    let result: string;
    let mimeType: string;

    switch (format) {
      case 'md':
        result = slateToMarkdown(content);
        mimeType = 'text/markdown';
        break;
      case 'html':
        result = slateToHtml(content);
        mimeType = 'text/html';
        break;
      case 'txt':
      default:
        result = content
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

    // 添加元数据
    if (options.includeMetadata) {
      const metadata = {
        title: filename,
        exportedAt: new Date().toISOString(),
        format,
      };
      result = `---\n${JSON.stringify(metadata, null, 2)}\n---\n\n${result}`;
    }

    // 设置编码
    const encoding = options.encoding || 'utf-8';
    const blob = new Blob([result], { type: `${mimeType};charset=${encoding}` });

    // 保存文件
    saveAs(blob, `${filename}.${format}`);
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('导出失败');
  }
};

// 获取文件预览
export const getFilePreview = (content: Node[]): string => {
  return content
    .map(node => {
      if ('children' in node) {
        return node.children
          .map((child: { text: any; }) => ('text' in child ? child.text : ''))
          .join('');
      }
      return '';
    })
    .join(' ')
    .slice(0, 200)
    .trim();
};

// 解析文件元数据
export const parseFileMetadata = (file: File): FileMetadata => {
  return {
    title: file.name,
    createdAt: new Date(file.lastModified),
    modifiedAt: new Date(file.lastModified),
    format: file.name.split('.').pop()?.toLowerCase() as FileFormat || 'txt',
    size: file.size,
  };
};

// 验证文件格式
export const validateFileFormat = (file: File): boolean => {
  const format = file.name.split('.').pop()?.toLowerCase();
  return ['txt', 'md', 'html', 'docx', 'pdf'].includes(format || '');
};

// 获取文件大小描述
export const getFileSizeDescription = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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

const processNode = (node: Node): string => {
  if (Text.isText(node)) {
    return node.text;
  } else if ('children' in node) {
    return node.children
      .map((child: CustomText | CustomElement) => {
        if (Text.isText(child)) {
          return child.text;
        }
        return processNode(child);
      })
      .join('');
  }
  return '';
}; 