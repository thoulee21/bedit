export type AIAction = 'polish' | 'translate' | 'continue' | 'summarize';

export interface AIResponse {
  result: string;
  error?: string;
} 