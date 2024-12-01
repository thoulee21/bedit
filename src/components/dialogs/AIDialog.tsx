import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  AutoFixHigh,
  Translate,
  ContentCopy,
  Add,
  Summarize,
} from '@mui/icons-material';
import { mockAICall } from '@/utils/ai-utils';

interface AIDialogProps {
  open: boolean;
  onClose: () => void;
  selectedText: string;
  onApplyAIResult: (result: string) => void;
}

export const AIDialog: React.FC<AIDialogProps> = ({
  open,
  onClose,
  selectedText,
  onApplyAIResult,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState('');

  const aiFeatures = [
    { icon: <AutoFixHigh />, title: '润色优化', action: 'polish' },
    { icon: <Translate />, title: '中英互译', action: 'translate' },
    { icon: <ContentCopy />, title: '续写内容', action: 'continue' },
    { icon: <Summarize />, title: '生成摘要', action: 'summarize' },
  ];

  const handleAIAction = async (action: string) => {
    setLoading(true);
    try {
      // TODO: 调用文心大模型API
      const result = await mockAICall(action, selectedText);
      setResult(result);
    } catch (error) {
      console.error('AI处理失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>AI 助手</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : result ? (
          <div>
            <pre>{result}</pre>
            <Button onClick={() => onApplyAIResult(result)}>
              应用修改
            </Button>
          </div>
        ) : (
          <List>
            {aiFeatures.map((feature) => (
              <ListItem key={feature.action} disablePadding>
                <ListItemButton onClick={() => handleAIAction(feature.action)}>
                  <ListItemIcon>{feature.icon}</ListItemIcon>
                  <ListItemText primary={feature.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}; 