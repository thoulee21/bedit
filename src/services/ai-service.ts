import { AIAction } from '../types/ai';

const API_ENDPOINT = process.env.NEXT_PUBLIC_AI_API_ENDPOINT || 'https://api.example.com/ai';

export async function processAIRequest(action: AIAction, text: string): Promise<string> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        text,
      }),
    });

    if (!response.ok) {
      throw new Error('AI 处理失败');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('AI 请求错误:', error);
    throw error;
  }
} 