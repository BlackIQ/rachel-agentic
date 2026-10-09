"use client";

// React
import { useState } from "react";

// MUI
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

// MUI Icons
import {
  AddRounded,
  MoreHorizRounded,
  SmartToyOutlined,
} from "@mui/icons-material";

type Chat = {
  id: string;
  title: string;
  updated_at: string;
};

type Props = {
  chats: Chat[];
  activeChatId: string | null;
  loading?: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
};

export default function Sidebar({
  chats,
  activeChatId,
  loading,
  onSelect,
  onNew,
  onDelete,
  onRename,
}: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuChat, setMenuChat] = useState<Chat | null>(null);

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameId, setRenameId] = useState<string | null>(null);

  function openMenu(event: React.MouseEvent<HTMLElement>, chat: Chat) {
    event.stopPropagation();
    event.preventDefault();
    setMenuAnchor(event.currentTarget);
    setMenuChat(chat);
  }

  function closeMenu() {
    setMenuAnchor(null);
    setMenuChat(null);
  }

  function startRename() {
    if (!menuChat) return;
    setRenameId(menuChat.id);
    setRenameValue(menuChat.title);
    setRenameOpen(true);
    closeMenu();
  }

  function confirmRename() {
    const title = renameValue.trim();
    if (renameId && title) onRename(renameId, title);
    setRenameOpen(false);
    setRenameId(null);
    setRenameValue("");
  }

  function confirmDelete() {
    if (!menuChat) return;
    const id = menuChat.id;
    closeMenu();
    onDelete(id);
  }

  return (
    <Box
      sx={{
        width: 300,
        maxWidth: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2,
          py: 1.75,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
            color: "primary.main",
            flexShrink: 0,
          }}
        >
          <SmartToyOutlined fontSize="small" />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
            Rachel
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            Personal Assistant
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddRounded />}
          onClick={onNew}
        >
          New chat
        </Button>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 2, pb: 0.75, fontWeight: 600, letterSpacing: "0.06em" }}
      >
        CONVERSATIONS
      </Typography>

      <Box sx={{ flex: 1, overflowY: "auto", px: 1, pb: 1.5 }}>
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 4 }}>
            <CircularProgress size={22} />
          </Box>
        ) : chats.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ px: 1.5, py: 2 }}
          >
            No chats yet
          </Typography>
        ) : (
          chats.map((chat) => {
            const active = chat.id === activeChatId;
            return (
              <Box
                key={chat.id}
                onClick={() => onSelect(chat.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.35,
                  px: 1.25,
                  py: 1.05,
                  borderRadius: 1.5,
                  cursor: "pointer",
                  bgcolor: active ? "action.selected" : "transparent",
                  transition: "background-color 120ms ease",
                  "&:hover": {
                    bgcolor: active ? "action.selected" : "action.hover",
                  },
                  "&:hover .chat-menu-btn": { opacity: 1 },
                }}
              >
                <Typography
                  noWrap
                  color="text.primary"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {chat.title}
                </Typography>

                <IconButton
                  className="chat-menu-btn"
                  size="small"
                  aria-label="Chat options"
                  onClick={(e) => openMenu(e, chat)}
                  sx={{
                    width: 26,
                    height: 26,
                    flexShrink: 0,
                    opacity: active ? 0.65 : 0,
                    color: "text.secondary",
                    borderRadius: 1,
                    transition: "opacity 120ms ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                      color: "text.primary",
                    },
                  }}
                >
                  <MoreHorizRounded sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            );
          })
        )}
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: { minWidth: 140, borderRadius: 1.5 } },
        }}
      >
        <MenuItem onClick={startRename} dense>
          Rename
        </MenuItem>
        <MenuItem onClick={confirmDelete} dense sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 2 } } }}
      >
        <DialogTitle>Rename chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Title"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirmRename();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={confirmRename}
            disabled={!renameValue.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
