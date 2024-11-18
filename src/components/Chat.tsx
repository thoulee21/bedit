import { useAppSelector } from '@/store/hooks';
import { Send, SmartToy } from '@mui/icons-material';
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

const styles = stylex.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--background-paper)',
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid var(--divider-color)',
  },
  headerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-primary)',
  },
  messageList: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
  messageListDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.3) !important',
  },
  messageListLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.03) !important',
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
    backgroundColor: '#e3f2fd !important',
    width: '32px',
    height: '32px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  botAvatarIcon: {
    color: '#1565c0 !important',
  },
  messageBubble: {
    padding: '12px',
    maxWidth: '80%',
    borderRadius: '16px',
    position: 'relative',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  botBubbleDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.15) !important',
    color: '#fff !important',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  botBubbleLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.08) !important',
    color: 'rgba(0, 0, 0, 0.87) !important',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  userBubbleDark: {
    backgroundColor: '#90caf9 !important',
    color: '#000 !important',
  },
  userBubbleLight: {
    backgroundColor: '#1976d2 !important',
    color: '#fff !important',
  },
  inputContainer: {
    padding: '16px',
    paddingBottom: '32px',
    borderTop: '1px solid var(--divider-color)',
  },
  inputContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputContainerLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  input: {
    borderRadius: '16px',
    backgroundColor: 'var(--background-paper)',
  },
  sendButton: {
    alignSelf: 'flex-end',
    transition: 'transform 0.2s',
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
  const prefersDarkMode = useAppSelector(state => state.preferences.prefersDarkMode);

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
    <Box {...stylex.props(styles.container)}>
      <Box {...stylex.props(
        styles.header,
        prefersDarkMode ? styles.headerDark : styles.headerLight
      )}>
        <Typography variant="h6" {...stylex.props(styles.title)}>
          <SmartToy color="primary" />
          AI Assistant
        </Typography>
      </Box>

      <Box {...stylex.props(
        styles.messageList,
        prefersDarkMode ? styles.messageListDark : styles.messageListLight
      )}>
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
                  <SmartToy
                    sx={{ fontSize: 20 }}
                    {...stylex.props(styles.botAvatarIcon)}
                  />
                </Avatar>
              )}
              <Paper
                elevation={0}
                {...stylex.props(
                  styles.messageBubble,
                  message.isBot
                    ? prefersDarkMode ? styles.botBubbleDark : styles.botBubbleLight
                    : prefersDarkMode ? styles.userBubbleDark : styles.userBubbleLight
                )}
              >
                <Typography variant="body1">{message.content}</Typography>
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

      <Box {...stylex.props(
        styles.inputContainer,
        prefersDarkMode ? styles.inputContainerDark : styles.inputContainerLight
      )}>
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