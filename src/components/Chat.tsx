import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    Avatar,
    CircularProgress,
    Divider,
    InputAdornment,
    Paper,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import { ChatBox, ReceiverMessage, SenderMessage } from "mui-chat-box";
import { useState } from "react";
import { v7 as uuid } from 'uuid';
import initMsgs from "../utils/initial-chats.json";

export interface MessageItem {
    role: string,
    content: string
}

export const Chat = ({ hidden }: { hidden?: boolean }) => {
    const [msg, setMsg] = useState('')
    const [chatHistory, setChatHistory] = useState(initMsgs)
    const [loading, setLoading] = useState(false)

    function rowRenderer(msgItem: MessageItem) {
        switch (msgItem.role) {
            case 'user':
                return (
                    <SenderMessage
                        key={uuid()}
                        avatar={<Avatar>U</Avatar>}
                    >
                        {msgItem.content}
                    </SenderMessage>
                )
            case 'assistant':
                return (
                    <ReceiverMessage
                        key={uuid()}
                        avatar={<Avatar>AI</Avatar>}
                    >
                        {msgItem.content}
                    </ReceiverMessage>
                )
            default:
                break;
        }
    }

    const sendMsg = async (e: { key: string; }) => {
        if (e.key === 'Enter') {
            setMsg('');
            setChatHistory(prev => [
                ...prev,
                { role: 'user', content: msg },
            ]);

            const fetchUrl = '//8.130.78.253:8080/chat';
            const params = {
                prompt: msg,
                stream: true,
                former_messages: chatHistory.slice(-3)
            };
            setLoading(true);
            const res = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            const resTxt = await res.text();
            setLoading(false);

            setChatHistory(prev => [
                ...prev,
                { role: 'assistant', content: resTxt }
            ]);
        }
    };

    if (hidden) return null
    return (
        <Paper
            style={{
                width: '23vw',
                marginLeft: '0.5vw',
                paddingTop: '1vh',
                paddingBottom: '0.5vh',
                paddingLeft: '0.5vw',
                paddingRight: '0.5vw',
                marginTop: '1vh',
                marginBottom: '4vh',
                borderRadius: '10px',
                height: 'max-content',
            }}
            elevation={3}
        >
            <Toolbar
                style={{
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h6">Chat with AI</Typography>
                {/* <IconButton
                    onClick={() => {
                        alert('close chat')
                    }}
                >
                    <CloseOutlined />
                </IconButton> */}
            </Toolbar>
            <Divider />

            <Paper
                style={{
                    marginTop: '1vh',
                    paddingBottom: '1vh',
                    overflowY: 'scroll',
                    maxHeight: '70vh'
                }}
                elevation={0}
            >
                <ChatBox>
                    {chatHistory.map(rowRenderer)}
                </ChatBox>
            </Paper>

            <TextField
                size="small"
                margin="normal"
                fullWidth
                label="Send a message"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {loading ?
                                <CircularProgress size={20} />
                                : <ArrowForwardIcon />}
                        </InputAdornment>
                    ),
                }}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={sendMsg}
            />
        </Paper>
    )
}