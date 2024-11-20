import { Descendant } from 'slate';
import mammoth from 'mammoth';
import { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType, convertInchesToTwip, PageOrientation, PageSize } from 'docx';
import { saveAs } from 'file-saver';
import { CustomElement, CustomText } from '@/types/slate';

// 将编辑器内容转换为纯文本
export const convertToText = (nodes: Descendant[]): string => {
  return nodes
    .map(node => {
      if ('children' in node) {
        return convertToText(node.children);
      }
      return 'text' in node ? node.text : '';
    })
    .join('\n');
};

// 将编辑器内容转换为 Markdown
export const convertToMarkdown = (nodes: Descendant[]): string => {
  return nodes
    .map(node => {
      if (!('type' in node)) return '';
      
      switch (node.type) {
        case 'heading-one':
          return `# ${convertToText(node.children)}\n`;
        case 'heading-two':
          return `## ${convertToText(node.children)}\n`;
        case 'heading-three':
          return `### ${convertToText(node.children)}\n`;
        case 'paragraph':
          return `${convertToText(node.children)}\n`;
        case 'bulleted-list':
          return (node as CustomElement).children
            .map((item: CustomElement) => `* ${convertToText(item.children)}\n`)
            .join('');
        case 'numbered-list':
          return (node as CustomElement).children
            .map((item: CustomElement, i: number) => `${i + 1}. ${convertToText(item.children)}\n`)
            .join('');
        default:
          return convertToText(node.children);
      }
    })
    .join('\n');
};

// 将 Slate 节点转换为 Word 文档
const convertToDocx = async (nodes: Descendant[]): Promise<Blob> => {
  // 将 Slate 节点转换为 docx 段落
  const paragraphs = nodes.flatMap(node => {
    if (!('type' in node)) return [];

    // 获取节点的文本内容和格式
    const textRuns = (node as CustomElement).children.map((child: CustomElement | CustomText) => {
      if (!('text' in child)) return new TextRun({ text: '' });
      
      return new TextRun({
        text: child.text,
        bold: child.bold,
        italics: child.italic,
        underline: child.underline ? {} : undefined,
        size: 24, // 12pt = 24 half-points
      });
    });

    // 根据节点类型创建相应的段落
    switch (node.type) {
      case 'heading-one':
        return new Paragraph({
          children: textRuns,
          heading: HeadingLevel.HEADING_1,
          spacing: {
            before: convertInchesToTwip(0.83),
            after: convertInchesToTwip(0.42),
          },
        });
      case 'heading-two':
        return new Paragraph({
          children: textRuns,
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: convertInchesToTwip(0.67),
            after: convertInchesToTwip(0.33),
          },
        });
      case 'heading-three':
        return new Paragraph({
          children: textRuns,
          heading: HeadingLevel.HEADING_3,
          spacing: {
            before: convertInchesToTwip(0.5),
            after: convertInchesToTwip(0.25),
          },
        });
      case 'bulleted-list':
        return (node as CustomElement).children.map((item: CustomElement) => 
          new Paragraph({
            children: item.children.map((child: CustomElement | CustomText) => 
              new TextRun({ text: 'text' in child ? child.text || '' : '' })
            ),
            bullet: {
              level: 0,
            },
          })
        );
      case 'numbered-list':
        return (node as CustomElement).children.map((item: CustomElement, index: number) => 
          new Paragraph({
            children: item.children.map((child: CustomElement | CustomText) => 
              new TextRun({ text: 'text' in child ? child.text || '' : '' })
            ),
            numbering: {
              reference: 'default-numbering',
              level: 0,
              instance: index,
            },
          })
        );
      default:
        return new Paragraph({
          children: textRuns,
          spacing: {
            before: convertInchesToTwip(0),
            after: convertInchesToTwip(0.17),
          },
        });
    }
  });

  // 创建文档
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            orientation: PageOrientation.PORTRAIT,
            width: convertInchesToTwip(8.27), // A4 width
            height: convertInchesToTwip(11.69), // A4 height
          },
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
        },
      },
      children: paragraphs,
    }],
    numbering: {
      config: [
        {
          reference: 'default-numbering',
          levels: [
            {
              level: 0,
              format: 'decimal',
              text: '%1.',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
          ],
        },
      ],
    },
  });

  // 生成 blob
  return await Packer.toBlob(doc);
};

// 导出文件
export const exportFile = async (content: string | Blob, filename: string) => {
  if (content instanceof Blob) {
    saveAs(content, filename);
    return;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
};

// 修改导出处理函数
export const handleExport = async (content: Descendant[], format: 'txt' | 'md' | 'json' | 'docx'): Promise<{ content: string | Blob, filename: string }> => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  
  switch (format) {
    case 'txt':
      return {
        content: convertToText(content),
        filename: `document-${timestamp}.txt`
      };
    case 'md':
      return {
        content: convertToMarkdown(content),
        filename: `document-${timestamp}.md`
      };
    case 'json':
      return {
        content: JSON.stringify(content, null, 2),
        filename: `document-${timestamp}.json`
      };
    case 'docx':
      return {
        content: await convertToDocx(content),
        filename: `document-${timestamp}.docx`
      };
    default:
      throw new Error('Unsupported format');
  }
};

// 读取文件内容
export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// 将文本内容转换为 Slate 节点
export const textToSlateNodes = (content: string): Descendant[] => {
  // 按行分割文本，过滤掉空行
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  
  // 将每行转换为 Slate 节点
  return lines.map(line => ({
    type: 'paragraph',
    children: [{ text: line }],
  }));
};

// 将 HTML 转换为 Slate 节点
const htmlToSlateNodes = async (html: string): Promise<Descendant[]> => {
  // 创建临时 DOM 元素来解析 HTML
  const div = document.createElement('div');
  div.innerHTML = html;

  // 递归函数：将 DOM 节点转换为 Slate 节点
  const convertDomNode = (node: Node): Descendant[] => {
    // 处理文本节点
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      // 忽略纯空白文本节点
      if (!text.trim()) return [];
      return [{ text }];
    }

    // 忽略非元素节点
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return [];
    }

    const el = node as Element;
    let children: Descendant[] = [];

    // 收集所有子节点的内容
    el.childNodes.forEach(child => {
      const result = convertDomNode(child);
      if (result.length > 0) {
        children.push(...result);
      }
    });

    // 如果没有有效的子节点，添加一个空文本节点
    if (children.length === 0) {
      children = [{ text: '' }];
    }

    // 根据标签类型转换为相应的 Slate 节点
    switch (el.tagName.toLowerCase()) {
      case 'h1':
        return [{ type: 'heading-one', children }];
      case 'h2':
        return [{ type: 'heading-two', children }];
      case 'h3':
        return [{ type: 'heading-three', children }];
      case 'p':
        return [{ type: 'paragraph', children }];
      case 'ul':
        return [{ type: 'bulleted-list', children }];
      case 'ol':
        return [{ type: 'numbered-list', children }];
      case 'li':
        return [{ type: 'list-item', children }];
      case 'blockquote':
        return [{ type: 'blockquote', children }];
      case 'pre':
        return [{ type: 'code-block', children }];
      // 处理 Word 文档中的特殊样式
      case 'span':
      case 'strong':
      case 'b':
        return children.map(child => {
          if (typeof child === 'string') return { text: child, bold: true };
          return child;
        });
      case 'em':
      case 'i':
        return children.map(child => {
          if (typeof child === 'string') return { text: child, italic: true };
          return child;
        });
      case 'u':
        return children.map(child => {
          if (typeof child === 'string') return { text: child, underline: true };
          return child;
        });
      case 'br':
        return [{ text: '\n' }];
      default:
        // 对于未知标签，只返回其子节点内容
        return children;
    }
  };

  // 转换整个文档
  const nodes = convertDomNode(div);
  
  // 确保至少有一个段落节点
  if (nodes.length === 0) {
    return [{ type: 'paragraph', children: [{ text: '' }] }];
  }

  // 确保所有顶层节点都有类型
  return nodes.map(node => {
    if (!('type' in node)) {
      return { type: 'paragraph', children: [node] };
    }
    return node;
  });
};

// 处理 Word 文档
const handleDocx = async (file: File): Promise<Descendant[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const nodes = await htmlToSlateNodes(result.value);
        resolve(nodes);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
};

// 修改解析导入的文件内容函数
export const parseImportedContent = async (file: File): Promise<Descendant[]> => {
  const fileType = file.name.split('.').pop()?.toLowerCase() || '';
  
  try {
    switch (fileType) {
      case 'docx':
        return await handleDocx(file);
      case 'json':
        const content = await readFile(file);
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.every(node => 'type' in node && 'children' in node)) {
            return parsed;
          }
          return textToSlateNodes(content);
        } catch {
          return textToSlateNodes(content);
        }
      case 'md':
      case 'txt':
      default:
        const textContent = await readFile(file);
        return textToSlateNodes(textContent);
    }
  } catch (error) {
    console.error('Error parsing imported content:', error);
    return [{ type: 'paragraph', children: [{ text: '' }] }];
  }
}; 