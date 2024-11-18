import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Stack,
  Avatar,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Send, SmartToy } from '@mui/icons-material';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export const Chat = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '这是一个AI助手的示例回复。',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(0, 0, 0, 0.3)' 
        : theme.palette.background.paper,
    }}>
      {/* 聊天标题 */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: theme.palette.mode === 'dark' 
              ? theme.palette.primary.light
              : theme.palette.primary.main,
          }}
        >
          <SmartToy color="inherit" />
          AI Assistant
        </Typography>
      </Box>

      {/* 消息列表 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(0, 0, 0, 0.2)' 
            : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.text.secondary,
              textAlign: 'center',
              p: 3,
            }}
          >
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              开始与 AI 助手对话...
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <Stack
              key={message.id}
              direction="row"
              spacing={1}
              sx={{
                mb: 2,
                justifyContent: message.isBot ? 'flex-start' : 'flex-end',
              }}
            >
              {message.isBot && (
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 32,
                    height: 32,
                  }}
                >
                  <SmartToy sx={{ fontSize: 20 }} />
                </Avatar>
              )}
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  maxWidth: '80%',
                  borderRadius: 2,
                  position: 'relative',
                  backgroundColor: message.isBot
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)'
                    : theme.palette.primary.main,
                  color: message.isBot
                    ? theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.text.primary
                    : '#fff',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 8,
                    ...(message.isBot
                      ? {
                          left: -8,
                          borderRight: '8px solid',
                          borderRightColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.04)',
                        }
                      : {
                          right: -8,
                          borderLeft: '8px solid',
                          borderLeftColor: theme.palette.primary.main,
                        }),
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                  },
                }}
              >
                <Typography 
                  variant="body1"
                  sx={{
                    color: message.isBot
                      ? theme.palette.mode === 'dark'
                        ? theme.palette.primary.light
                        : theme.palette.text.primary
                      : '#fff',
                  }}
                >
                  {message.content}
                </Typography>
              </Paper>
            </Stack>
          ))
        )}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* 输入框 */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : theme.palette.background.paper,
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& .MuiInputBase-input': {
                color: theme.palette.mode === 'dark'
                  ? theme.palette.primary.light
                  : theme.palette.text.primary,
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            sx={{
              alignSelf: 'flex-end',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <Send />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};