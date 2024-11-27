// 模拟可视化生成
export const mockVisualize = async (type: number, content: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  switch (type) {
    case 0: // 表格生成
      return `| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 数据1 | 数据2 | 数据3 |`;
    case 1: // 思维导图
      return `- 主题\n  - 分支1\n    - 子分支1\n    - 子分支2\n  - 分支2\n    - 子分支3\n    - 子分支4`;
    case 2: // 数据可视化
      return `{
  "type": "bar",
  "data": {
    "labels": ["A", "B", "C"],
    "values": [10, 20, 30]
  }
}`;
    default:
      return content;
  }
}; 