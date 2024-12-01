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