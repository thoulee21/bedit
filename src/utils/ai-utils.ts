export const mockAICall = async (action: string, text: string): Promise<string> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  switch (action) {
    case 'polish':
      return `优化后的文本: ${text}`;
    case 'translate':
      return `翻译结果: ${text}`;
    case 'continue':
      return `${text} [续写的内容...]`;
    case 'summarize':
      return `摘要: ${text}的主要内容是...`;
    default:
      return text;
  }
}; 