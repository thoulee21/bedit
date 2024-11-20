import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Stack,
  Avatar,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Send, SmartToy } from '@mui/icons-material';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--background-paper)',
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid var(--divider)',
    backgroundColor: 'var(--background-hover)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-primary)',
  },
  messageList: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
    backgroundColor: 'var(--background-default)',
  },
  emptyState: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    padding: '24px',
    fontStyle: 'italic',
  },
  messageRow: {
    marginBottom: '16px',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    backgroundColor: 'var(--primary-light)',
    width: '32px',
    height: '32px',
    boxShadow: 'var(--shadow-1)',
  },
  botAvatarIcon: {
    color: 'var(--primary-dark)',
    fontSize: '20px',
  },
  messageBubble: {
    padding: '12px 16px',
    maxWidth: '80%',
    borderRadius: '16px',
    position: 'relative',
    boxShadow: 'var(--shadow-1)',
  },
  botBubble: {
    backgroundColor: 'var(--background-paper)',
    color: 'var(--text-primary)',
    border: '1px solid var(--divider)',
  },
  userBubble: {
    backgroundColor: 'var(--primary-main)',
    color: 'var(--primary-contrast)',
  },
  inputContainer: {
    padding: '16px',
    paddingBottom: '32px',
    borderTop: '1px solid var(--divider)',
    backgroundColor: 'var(--background-hover)',
  },
  input: {
    backgroundColor: 'var(--background-paper)',
    borderRadius: '8px',
  },
  sendButton: {
    alignSelf: 'flex-end',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
});

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
    <Box {...stylex.props(styles.container)}>
      <Box {...stylex.props(styles.header)}>
        <Typography variant="h6" {...stylex.props(styles.headerTitle)}>
          <SmartToy color="primary" />
          AI Assistant
        </Typography>
      </Box>

      <Box {...stylex.props(styles.messageList)}>
        {messages.length === 0 ? (
          <Box {...stylex.props(styles.emptyState)}>
            <Typography variant="body2">
              开始与 AI 助手对话...
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <Stack
              key={message.id}
              direction="row"
              spacing={1}
              {...stylex.props(
                styles.messageRow,
                message.isBot ? styles.botMessage : styles.userMessage
              )}
            >
              {message.isBot && (
                <Avatar {...stylex.props(styles.botAvatar)}>
                  <SmartToy {...stylex.props(styles.botAvatarIcon)} />
                </Avatar>
              )}
              <Box
                {...stylex.props(
                  styles.messageBubble,
                  message.isBot ? styles.botBubble : styles.userBubble
                )}
              >
                <Typography variant="body1">{message.content}</Typography>
              </Box>
            </Stack>
          ))
        )}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      <Box {...stylex.props(styles.inputContainer)}>
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
            {...stylex.props(styles.input)}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            {...stylex.props(styles.sendButton)}
          >
            <Send />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};