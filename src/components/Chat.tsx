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
} from '@mui/material';
import { Send, SmartToy } from '@mui/icons-material';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 模拟AI响应
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 聊天标题 */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToy color="primary" />
          AI Assistant
        </Typography>
      </Box>

      {/* 消息列表 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((message) => (
          <Stack
            key={message.id}
            direction="row"
            spacing={2}
            sx={{
              alignSelf: message.isBot ? 'flex-start' : 'flex-end',
              maxWidth: '80%',
            }}
          >
            {message.isBot && (
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <SmartToy />
              </Avatar>
            )}
            <Paper
              elevation={1}
              sx={{
                p: 2,
                backgroundColor: message.isBot ? 'background.paper' : 'primary.main',
                color: message.isBot ? 'text.primary' : 'primary.contrastText',
                borderRadius: 2,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  ...(message.isBot
                    ? {
                        left: -8,
                        borderRight: '8px solid',
                        borderRightColor: 'background.paper',
                      }
                    : {
                        right: -8,
                        borderLeft: '8px solid',
                        borderLeftColor: 'primary.main',
                      }),
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                },
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
          </Stack>
        ))}
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
          backgroundColor: 'background.paper',
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