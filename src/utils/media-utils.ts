// 模拟OCR识别
export const mockOCR = async (file: File): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `[OCR识别结果]\n这是从图片中提取的文本内容...`;
};

// 模拟语音识别
export const mockASR = async (file: File): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return `[语音识别结果]\n这是从语音中识别的文本内容...`;
};

// PDF文本提取
export const extractPDFText = async (file: File): Promise<string> => {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += `[第${i}页]\n${pageText}\n\n`;
    }

    return fullText;
  } catch (error) {
    console.error('PDF处理失败:', error);
    throw error;
  }
}; 