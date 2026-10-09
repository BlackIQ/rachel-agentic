"use client";

import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

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

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

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
    if (renameId && title) {
      onRename(renameId, title);
    }
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
            width: 36,
            height: 36,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
            color: "primary.main",
            flexShrink: 0,
          }}
        >
          <SmartToyOutlinedIcon fontSize="small" />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={700} noWrap>
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
          size="large"
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={onNew}
        >
          New chat
        </Button>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 2, pb: 0.75, fontWeight: 600, letterSpacing: "0.04em" }}
      >
        Conversations
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
                sx={{
                  display: "flex",
                  alignItems: "stretch",
                  mb: 0.5,
                  borderRadius: 1,
                  overflow: "hidden",
                  bgcolor: active ? "action.selected" : "transparent",
                  border: "1px solid",
                  borderColor: active ? "primary.main" : "transparent",
                  "&:hover": {
                    bgcolor: active ? "action.selected" : "action.hover",
                  },
                }}
              >
                <ListItemButton
                  onClick={() => onSelect(chat.id)}
                  sx={{
                    flex: 1,
                    py: 1.1,
                    px: 1.5,
                    borderRadius: 0,
                    minWidth: 0,
                  }}
                >
                  <ListItemText
                    primary={chat.title}
                    // secondary={formatTime(chat.updated_at)}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontWeight: active ? 600 : 500,
                      fontSize: "0.9rem",
                    }}
                    secondaryTypographyProps={{
                      noWrap: true,
                      fontSize: "0.72rem",
                    }}
                  />
                </ListItemButton>

                <IconButton
                  size="small"
                  aria-label="Chat options"
                  onClick={(e) => openMenu(e, chat)}
                  sx={{
                    alignSelf: "center",
                    mr: 0.5,
                    color: "text.secondary",
                  }}
                >
                  <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
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
      >
        <MenuItem onClick={startRename}>Rename</MenuItem>
        <MenuItem onClick={confirmDelete} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        fullWidth
        maxWidth="xs"
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
        <DialogActions>
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
