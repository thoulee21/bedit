import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  type: 'bar' | 'line' | 'pie';
  data: {
    labels: string[];
    values: number[];
  };
  options?: {
    title?: string;
    colors?: string[];
  };
}

interface ChartVisualizerProps {
  data: string;
}

export const ChartVisualizer: React.FC<ChartVisualizerProps> = ({ data }) => {
  try {
    const chartData: ChartData = JSON.parse(data);
    
    const colors = chartData.options?.colors || [
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 99, 132, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(153, 102, 255, 0.5)',
    ];

    const commonConfig = {
      labels: chartData.data.labels,
      datasets: [
        {
          label: '数据',
          data: chartData.data.values,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.5', '1')),
          borderWidth: 1,
        },
      ],
    };

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: chartData.options?.title || '数据可视化',
        },
      },
    };

    return (
      <div style={{ width: '100%', height: '300px' }}>
        {chartData.type === 'bar' && (
          <Bar data={commonConfig} options={commonOptions} />
        )}
        {chartData.type === 'line' && (
          <Line data={commonConfig} options={commonOptions} />
        )}
        {chartData.type === 'pie' && (
          <Pie data={commonConfig} options={commonOptions} />
        )}
      </div>
    );
  } catch (error) {
    console.error('解析图表数据失败:', error);
    return null;
  }
}; 