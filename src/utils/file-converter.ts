import { Descendant, Element } from 'slate';
import { CustomElement, CustomText } from '@/types/slate';

// 将纯文本转换为 Slate 文档结构
export const textToSlate = (text: string): Descendant[] => {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map(paragraph => ({
    type: 'paragraph',
    children: [{ text: paragraph }],
  }));
};

// 标题级别映射
const headingLevels = {
  1: 'heading-one',
  2: 'heading-two',
  3: 'heading-three',
  4: 'heading-four',
  5: 'heading-five',
  6: 'heading-six',
} as const;

type HeadingType = typeof headingLevels[keyof typeof headingLevels];

// 将 Markdown 转换为 Slate 文档结构
export const markdownToSlate = (markdown: string): Descendant[] => {
  const lines = markdown.split('\n');
  const nodes: Descendant[] = [];
  let currentBlock: CustomElement | null = null;

  for (const line of lines) {
    // 处理标题
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const headingType = headingLevels[level as keyof typeof headingLevels];
      nodes.push({
        type: headingType,
        children: [{ text }],
      });
      continue;
    }

    // 处理引用块
    if (line.startsWith('> ')) {
      nodes.push({
        type: 'blockquote',
        children: [{ text: line.slice(2) }],
      });
      continue;
    }

    // 处理代码块
    if (line.startsWith('```')) {
      if (!currentBlock) {
        currentBlock = {
          type: 'code-block',
          children: [{ text: '' }],
        };
      } else {
        nodes.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // 处理列表
    const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const [, indent, marker, text] = listMatch;
      const isOrdered = /\d+\./.test(marker);
      nodes.push({
        type: isOrdered ? 'numbered-list' : 'bulleted-list',
        children: [{
          type: 'list-item',
          children: [{ text }],
        }],
      });
      continue;
    }

    // 处理普通段落
    if (line.trim()) {
      nodes.push({
        type: 'paragraph',
        children: [{ text: line }],
      });
    }
  }

  return nodes;
};

// 将 Slate 文档结构转换为 Markdown
export const slateToMarkdown = (nodes: Descendant[]): string => {
  return nodes.map(node => {
    if (!Element.isElement(node)) return '';

    const text = (node.children[0] as CustomText).text;
    switch (node.type) {
      case 'heading-one':
        return `# ${text}\n`;
      case 'heading-two':
        return `## ${text}\n`;
      case 'heading-three':
        return `### ${text}\n`;
      case 'heading-four':
        return `#### ${text}\n`;
      case 'heading-five':
        return `##### ${text}\n`;
      case 'heading-six':
        return `###### ${text}\n`;
      case 'blockquote':
        return `> ${text}\n`;
      case 'code-block':
        return `\`\`\`\n${text}\n\`\`\`\n`;
      case 'bulleted-list':
        return `- ${text}\n`;
      case 'numbered-list':
        return `1. ${text}\n`;
      case 'paragraph':
        return `${text}\n\n`;
      default:
        return '';
    }
  }).join('');
};

// 将 HTML 转换为 Slate 文档结构
export const htmlToSlate = (html: string): Descendant[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes: Descendant[] = [];

  const processNode = (domElement: HTMLElement): CustomElement => {
    const text = domElement.textContent || '';
    switch (domElement.tagName.toLowerCase()) {
      case 'h1':
        return { type: 'heading-one', children: [{ text }] };
      case 'h2':
        return { type: 'heading-two', children: [{ text }] };
      case 'h3':
        return { type: 'heading-three', children: [{ text }] };
      case 'h4':
        return { type: 'heading-four', children: [{ text }] };
      case 'h5':
        return { type: 'heading-five', children: [{ text }] };
      case 'h6':
        return { type: 'heading-six', children: [{ text }] };
      case 'blockquote':
        return { type: 'blockquote', children: [{ text }] };
      case 'pre':
        return { type: 'code-block', children: [{ text }] };
      case 'ul':
        return { type: 'bulleted-list', children: [{ text }] };
      case 'ol':
        return { type: 'numbered-list', children: [{ text }] };
      case 'li':
        return { type: 'list-item', children: [{ text }] };
      case 'p':
      default:
        return { type: 'paragraph', children: [{ text }] };
    }
  };

  doc.body.childNodes.forEach(node => {
    if (node instanceof HTMLElement) {
      nodes.push(processNode(node));
    }
  });

  return nodes;
};

// 将 Slate 文档结构转换为 HTML
export const slateToHtml = (nodes: Descendant[]): string => {
  return nodes.map(node => {
    if (!Element.isElement(node)) return '';

    const text = (node.children[0] as CustomText).text;
    switch (node.type) {
      case 'heading-one':
        return `<h1>${text}</h1>`;
      case 'heading-two':
        return `<h2>${text}</h2>`;
      case 'heading-three':
        return `<h3>${text}</h3>`;
      case 'heading-four':
        return `<h4>${text}</h4>`;
      case 'heading-five':
        return `<h5>${text}</h5>`;
      case 'heading-six':
        return `<h6>${text}</h6>`;
      case 'blockquote':
        return `<blockquote>${text}</blockquote>`;
      case 'code-block':
        return `<pre><code>${text}</code></pre>`;
      case 'bulleted-list':
        return `<ul><li>${text}</li></ul>`;
      case 'numbered-list':
        return `<ol><li>${text}</li></ol>`;
      case 'paragraph':
        return `<p>${text}</p>`;
      default:
        return '';
    }
  }).join('\n');
}; 