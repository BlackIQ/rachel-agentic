"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Drawer,
  Fab,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

import Sidebar from "@/components/Sidebar";
import MessageBubble from "@/components/MessageBubble";
import Composer from "@/components/Composer";
import {
  createChat,
  deleteChat,
  getChat,
  getChats,
  sendMessage,
  updateChat,
} from "@/lib/chat";
import type { Chat, Message } from "@/lib/types";

const DRAWER_WIDTH = 300;

export default function ChatApp() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  const refreshChats = useCallback(async () => {
    const data = await getChats();
    const sorted = [...data].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
    setChats(sorted);
    return sorted;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const sorted = await refreshChats();
        if (cancelled) return;

        if (sorted.length > 0) {
          setActiveChatId(sorted[0].id);
          setLoadingMessages(true);
          const chat = await getChat(sorted[0].id);
          if (!cancelled) setMessages(chat.messages ?? []);
        }
      } catch {
        if (!cancelled) {
          setError("Could not reach Rachel API. Check backend URL and CORS.");
        }
      } finally {
        if (!cancelled) {
          setLoadingChats(false);
          setLoadingMessages(false);
        }
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [refreshChats]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending, scrollToBottom]);

  async function selectChat(chatId: string) {
    setMobileOpen(false);
    if (chatId === activeChatId) return;

    setActiveChatId(chatId);
    setMessages([]);
    setError(null);
    setLoadingMessages(true);

    try {
      const chat = await getChat(chatId);
      setMessages(chat.messages ?? []);
    } catch {
      setError("Could not load this conversation.");
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleNewChat() {
    setError(null);
    setMobileOpen(false);
    try {
      const chat = await createChat({ title: "New chat" });
      await refreshChats();
      setActiveChatId(chat.id);
      setMessages([]);
      setInput("");
    } catch {
      setError("Could not create a conversation.");
    }
  }

  async function handleDelete(chatId: string) {
    setError(null);
    try {
      await deleteChat(chatId);
      const remaining = await refreshChats();

      if (activeChatId === chatId) {
        if (remaining.length > 0) {
          setActiveChatId(remaining[0].id);
          setLoadingMessages(true);
          try {
            const chat = await getChat(remaining[0].id);
            setMessages(chat.messages ?? []);
          } finally {
            setLoadingMessages(false);
          }
        } else {
          setActiveChatId(null);
          setMessages([]);
        }
      }
    } catch {
      setError("Could not delete this conversation.");
    }
  }

  async function handleRename(chatId: string, title: string) {
    setError(null);
    try {
      await updateChat(chatId, { title });
      await refreshChats();
    } catch {
      setError("Could not rename this conversation.");
    }
  }

  async function handleSend() {
    const content = input.trim();
    if (!content || sending) return;

    setError(null);
    setSending(true);
    setInput("");

    const tempId = `temp-${Date.now()}`;
    const optimistic: Message = {
      id: tempId,
      chat_id: activeChatId ?? "",
      content,
      role: "user",
      tool_name: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      let chatId = activeChatId;

      if (!chatId) {
        const chat = await createChat({
          title: content.slice(0, 48) || "New chat",
        });
        chatId = chat.id;
        setActiveChatId(chatId);
      }

      const newMessages = await sendMessage(chatId, { content });

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempId);
        const existingIds = new Set(withoutTemp.map((m) => m.id));
        const toAdd = newMessages.filter((m) => !existingIds.has(m.id));
        return [...withoutTemp, ...toAdd];
      });

      await refreshChats();
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(content);
      setError("Sending failed. Check the backend and try again.");
    } finally {
      setSending(false);
    }
  }

  const sidebar = (
    <Sidebar
      chats={chats}
      activeChatId={activeChatId}
      loading={loadingChats}
      onSelect={(id) => void selectChat(id)}
      onNew={() => void handleNewChat()}
      onDelete={(id) => void handleDelete(id)}
      onRename={(id, title) => void handleRename(id, title)}
    />
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      {/* Desktop: always-visible sidebar */}
      {isDesktop && (
        <Box
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            borderRight: "1px solid",
            borderColor: "divider",
            height: "100%",
          }}
        >
          {sidebar}
        </Box>
      )}

      {/* Mobile: temporary drawer */}
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {sidebar}
        </Drawer>
      )}

      {/* Chat area — no navbar */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
      >
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ mx: 2, mt: 2, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: { xs: 1, sm: 3 },
            py: 3,
          }}
        >
          {loadingMessages ? (
            <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
              <CircularProgress size={28} />
            </Box>
          ) : messages.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                textAlign: "center",
                px: 2,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "action.hover",
                  color: "primary.main",
                  mb: 1,
                }}
              >
                <SmartToyOutlinedIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h5" fontWeight={700}>
                Hi, I&apos;m Rachel
              </Typography>
              <Typography color="text.secondary" maxWidth={360}>
                Ask about home temperature, control LEDs, or check the weather.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                maxWidth: 800,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1.75,
              }}
            >
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {sending && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pl: 0.5,
                  }}
                >
                  <CircularProgress size={14} />
                  <Typography variant="caption" color="text.secondary">
                    Rachel is thinking…
                  </Typography>
                </Box>
              )}

              <div ref={bottomRef} />
            </Box>
          )}
        </Box>

        <Box sx={{ maxWidth: 800, width: "100%", mx: "auto" }}>
          <Composer
            value={input}
            sending={sending}
            onChange={setInput}
            onSend={() => void handleSend()}
          />
        </Box>

        {/* Mobile only: floating open-sidebar control (not a navbar) */}
        {!isDesktop && (
          <Fab
            size="small"
            color="primary"
            aria-label="Open chats"
            onClick={() => setMobileOpen(true)}
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 2,
            }}
          >
            <MenuRoundedIcon />
          </Fab>
        )}
      </Box>
    </Box>
  );
}
