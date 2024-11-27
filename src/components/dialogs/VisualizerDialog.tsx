import { mockVisualize } from '@/utils/visualizer-utils';
import { BarChart, PieChart, ShowChart, TableChart } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { ChartVisualizer } from '../visualizers/ChartVisualizer';

interface VisualizerDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (content: string) => void;
}

export const VisualizerDialog: React.FC<VisualizerDialogProps> = ({
  open,
  onClose,
  onInsert,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // TODO: 调用大模型API生成可视化内容
      const result = await mockVisualize(activeTab, input);
      setResult(result);
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (!result) return;

    // 如果是图表数据，创建图表节点
    if (activeTab >= 2) {  // 2,3,4 是图表类型
      const chartNode = {
        type: 'chart',
        data: result,
        children: [{ text: '' }],
      };
      onInsert(JSON.stringify(chartNode));
    } else {
      // 对于表格和思维导图，直接插入文本
      onInsert(result);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>智能可视化</DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<TableChart />} label="表格生成" />
          <Tab icon={<BarChart />} label="柱状图" />
          <Tab icon={<ShowChart />} label="折线图" />
          <Tab icon={<PieChart />} label="饼图" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeTab === 0
                ? '请输入需要整理成表格的文本内容...'
                : '请输入需要可视化的数据...'
            }
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : result ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                生成结果：
              </Typography>
              {activeTab === 0 ? (
                <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
              ) : (
                <ChartVisualizer data={result} />
              )}
              <Button
                variant="contained"
                onClick={handleInsert}
                sx={{ mt: 1 }}
              >
                插入到编辑器
              </Button>
            </Box>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={!input.trim() || loading}
        >
          生成
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 