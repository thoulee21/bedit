// 模拟可视化生成
export const mockVisualize = async (type: number, content: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  switch (type) {
    case 0: // 表格生成
      return `| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 数据1 | 数据2 | 数据3 |`;
    case 1: // 柱状图
      return `{
  "type": "bar",
  "data": {
    "labels": ["A", "B", "C", "D", "E"],
    "values": [10, 20, 30, 25, 15]
  },
  "options": {
    "title": "柱状图示例",
    "colors": ["rgba(54, 162, 235, 0.5)"]
  }
}`;
    case 2: // 折线图
      return `{
  "type": "line",
  "data": {
    "labels": ["一月", "二月", "三月", "四月", "五月"],
    "values": [5, 15, 10, 25, 20]
  },
  "options": {
    "title": "趋势图示例"
  }
}`;
    case 3: // 饼图
      return `{
  "type": "pie",
  "data": {
    "labels": ["类别A", "类别B", "类别C", "类别D"],
    "values": [30, 25, 20, 25]
  },
  "options": {
    "title": "占比分析"
  }
}`;
    default:
      return content;
  }
}; 