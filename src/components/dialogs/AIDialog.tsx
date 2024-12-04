import { AIAction } from '@/types/ai';
import { processAIRequest } from '@/services/ai-service';
import {
  AutoFixHigh,
  Translate,
  ContentCopy,
  Summarize,
} from '@mui/icons-material';
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
  Alert,
} from '@mui/material';
import React from 'react';

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
  const [error, setError] = React.useState<string | null>(null);

  const aiFeatures = [
    { icon: <AutoFixHigh />, title: '润色优化', action: 'polish' as AIAction },
    { icon: <Translate />, title: '中英互译', action: 'translate' as AIAction },
    { icon: <ContentCopy />, title: '续写内容', action: 'continue' as AIAction },
    { icon: <Summarize />, title: '生成摘要', action: 'summarize' as AIAction },
  ];

  const handleAIAction = async (action: AIAction) => {
    setLoading(true);
    setError(null);
    try {
      const result = await processAIRequest(action, selectedText);
      setResult(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : '处理失败');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>AI 助手</DialogTitle>
      <DialogContent>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <CircularProgress />
            <div style={{ marginTop: '1rem' }}>正在处理...</div>
          </div>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : result ? (
          <div>
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-word',
              backgroundColor: 'rgba(0,0,0,0.03)',
              padding: '1rem',
              borderRadius: '4px'
            }}>
              {result}
            </pre>
            <Button 
              variant="contained" 
              onClick={() => onApplyAIResult(result)}
              sx={{ mt: 2 }}
            >
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
        <Button onClick={handleClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}; 