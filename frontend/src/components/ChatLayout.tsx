"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

import {
  createChat,
  deleteChat,
  getChat,
  getChats,
  sendMessage,
} from "@/lib/chat";

import type { Chat, Message } from "@/lib/types";

export default function ChatLayout() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshChats = useCallback(async () => {
    const data = await getChats();
    setChats(data);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getChats();

        if (cancelled) return;

        setChats(data);

        if (data.length > 0) {
          setActiveChat(data[0].id);

          const chat = await getChat(data[0].id);

          if (!cancelled) {
            setMessages(chat.messages);
          }
        }
      } catch {
        if (!cancelled) {
          setError(
            "Could not connect to Rachel API. Check the backend URL and CORS settings.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingChats(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function selectChat(chatId: string) {
    setActiveChat(chatId);
    setMessages([]);
    setError(null);
    setLoadingMessages(true);

    try {
      const chat = await getChat(chatId);
      setMessages(chat.messages);
    } catch {
      setError("Could not load this conversation.");
    } finally {
      setLoadingMessages(false);
    }
  }

  async function newChat() {
    setError(null);

    try {
      const chat = await createChat({
        title: "New conversation",
      });

      await refreshChats();
      setActiveChat(chat.id);
      setMessages([]);
      setInput("");
    } catch {
      setError("Could not create a conversation.");
    }
  }

  async function removeChat(chatId: string) {
    setError(null);

    try {
      await deleteChat(chatId);

      const remaining = chats.filter((chat) => chat.id !== chatId);

      setChats(remaining);

      if (activeChat === chatId) {
        setActiveChat(null);
        setMessages([]);

        if (remaining.length > 0) {
          await selectChat(remaining[0].id);
        }
      }
    } catch {
      setError("Could not delete this conversation.");
    }
  }

  async function handleSend() {
    const content = input.trim();

    if (!content || sending) return;

    setError(null);
    setSending(true);

    try {
      let chatId = activeChat;

      if (!chatId) {
        const chat = await createChat({
          title: content.slice(0, 60),
        });

        chatId = chat.id;
        setActiveChat(chatId);
        setMessages([]);
      }

      setInput("");

      const updatedMessages = await sendMessage(chatId, {
        content,
      });

      setMessages(updatedMessages);
      await refreshChats();
    } catch {
      setError(
        "Message sending failed. Please check the backend and try again.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <Box className="chat-shell">
      <Box component="aside" className="chat-sidebar">
        <Box className="brand">
          <Avatar className="brand-avatar">
            <SmartToyOutlinedIcon />
          </Avatar>
          <Box>
            <Typography fontWeight={700}>Rachel</Typography>
            <Typography variant="caption" color="text.secondary">
              Personal AI
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={newChat}
          className="new-chat-button"
        >
          New conversation
        </Button>

        <Typography
          variant="overline"
          color="text.secondary"
          className="section-label"
        >
          Recent conversations
        </Typography>

        <Box className="conversation-list">
          {loadingChats ? (
            <CircularProgress size={22} />
          ) : chats.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No conversations yet.
            </Typography>
          ) : (
            chats.map((chat) => (
              <Box key={chat.id} className="conversation-item">
                <Button
                  fullWidth
                  color="inherit"
                  variant={activeChat === chat.id ? "outlined" : "text"}
                  startIcon={<ChatBubbleOutlineRoundedIcon />}
                  className="conversation-button"
                  onClick={() => void selectChat(chat.id)}
                >
                  {chat.title}
                </Button>

                <IconButton
                  size="small"
                  aria-label={`Delete ${chat.title}`}
                  title="Delete conversation"
                  onClick={() => void removeChat(chat.id)}
                >
                  <Typography component="span" variant="caption">
                    ×
                  </Typography>
                </IconButton>
              </Box>
            ))
          )}
        </Box>

        <Box className="sidebar-footer">
          <Divider />
          <Typography variant="caption" color="text.secondary">
            Rachel · Connected interface
          </Typography>
        </Box>
      </Box>

      <Box component="main" className="chat-main">
        <Box className="chat-topbar">
          <Box>
            <Typography fontWeight={600}>Assistant</Typography>
            <Typography variant="caption" color="text.secondary">
              Rachel Agent
            </Typography>
          </Box>

          <Avatar className="assistant-avatar">
            <SmartToyOutlinedIcon />
          </Avatar>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <Box className="chat-content">
          {loadingMessages ? (
            <Box className="welcome">
              <CircularProgress />
            </Box>
          ) : messages.length === 0 ? (
            <Box className="welcome">
              <Avatar className="welcome-avatar">
                <SmartToyOutlinedIcon />
              </Avatar>

              <Typography variant="h4" fontWeight={700}>
                What can I help with?
              </Typography>

              <Typography color="text.secondary">
                Ask a question or start a conversation with Rachel.
              </Typography>
            </Box>
          ) : (
            <Box className="message-list">
              {messages.map((message) => (
                <Box key={message.id} className={`message-row ${message.role}`}>
                  {message.role === "assistant" && (
                    <Avatar className="message-avatar">
                      <SmartToyOutlinedIcon />
                    </Avatar>
                  )}

                  <Paper
                    elevation={0}
                    className={`message-bubble ${message.role}`}
                  >
                    {message.role === "tool" && (
                      <Typography variant="caption" color="text.secondary">
                        Tool{message.tool_name ? ` · ${message.tool_name}` : ""}
                      </Typography>
                    )}

                    {message.role === "system" && (
                      <Typography variant="caption" color="text.secondary">
                        System
                      </Typography>
                    )}

                    <Typography
                      component="div"
                      dir="auto"
                      sx={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        lineHeight: 1.8,
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box className="composer-area">
          <Paper elevation={0} className="composer">
            <TextField
              fullWidth
              multiline
              maxRows={6}
              variant="standard"
              placeholder="Message Rachel..."
              value={input}
              disabled={sending}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              slotProps={{
                htmlInput: {
                  dir: "auto",
                  "aria-label": "Message Rachel",
                },
                input: {
                  disableUnderline: true,
                },
              }}
            />

            <IconButton
              color="primary"
              onClick={() => void handleSend()}
              disabled={!input.trim() || sending}
              aria-label="Send message"
            >
              {sending ? <CircularProgress size={22} /> : <SendRoundedIcon />}
            </IconButton>
          </Paper>

          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
          >
            Rachel can make mistakes. Verify important information.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
