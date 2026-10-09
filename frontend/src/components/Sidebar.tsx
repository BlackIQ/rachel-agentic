"use client";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
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
  onClose?: () => void;
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
  onClose,
}: Props) {
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
            Home assistant
          </Typography>
        </Box>
        {onClose && (
          <IconButton size="small" onClick={onClose} aria-label="Close menu">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box sx={{ p: 1.5 }}>
        <Button
          fullWidth
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
                sx={{
                  display: "flex",
                  alignItems: "stretch",
                  mb: 0.5,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: active ? "action.selected" : "transparent",
                  border: "1px solid",
                  borderColor: active ? "primary.main" : "transparent",
                  "&:hover": {
                    bgcolor: active ? "action.selected" : "action.hover",
                  },
                  "&:hover .delete-btn": { opacity: 1 },
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
                    secondary={formatTime(chat.updated_at)}
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
                  className="delete-btn"
                  size="small"
                  aria-label={`Delete ${chat.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chat.id);
                  }}
                  sx={{
                    alignSelf: "center",
                    mr: 0.75,
                    opacity: { xs: 1, md: 0 },
                    color: "text.secondary",
                    transition: "opacity 120ms ease, color 120ms ease",
                    "&:hover": {
                      color: "error.main",
                      bgcolor: "rgba(240, 113, 120, 0.12)",
                    },
                  }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
