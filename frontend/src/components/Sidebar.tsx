"use client";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
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
}: Props) {
  return (
    <Box
      component="aside"
      sx={{
        width: { xs: 72, md: 280 },
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: { xs: 1, md: 2 },
          py: 2,
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
            bgcolor: "rgba(124,156,255,0.15)",
            color: "primary.main",
            flexShrink: 0,
          }}
        >
          <SmartToyOutlinedIcon fontSize="small" />
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" }, minWidth: 0 }}>
          <Typography fontWeight={700} noWrap>
            Rachel
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            Home assistant
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: { xs: 1, md: 1.5 } }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={onNew}
          sx={{
            justifyContent: { xs: "center", md: "flex-start" },
            minWidth: 0,
            px: { xs: 1, md: 2 },
            "& .MuiButton-startIcon": {
              mr: { xs: 0, md: 1 },
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
            New chat
          </Box>
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 0.75, md: 1.25 },
          pb: 1.5,
        }}
      >
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 4 }}>
            <CircularProgress size={22} />
          </Box>
        ) : chats.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: "none", md: "block" }, px: 1, py: 2 }}
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
                  alignItems: "center",
                  gap: 0.25,
                  mb: 0.5,
                  borderRadius: 2,
                  bgcolor: active ? "rgba(124,156,255,0.12)" : "transparent",
                  border: active
                    ? "1px solid rgba(124,156,255,0.25)"
                    : "1px solid transparent",
                  "&:hover .delete-btn": { opacity: 1 },
                }}
              >
                <Button
                  fullWidth
                  color="inherit"
                  onClick={() => onSelect(chat.id)}
                  sx={{
                    justifyContent: { xs: "center", md: "flex-start" },
                    textAlign: "left",
                    px: { xs: 1, md: 1.25 },
                    py: 1,
                    minWidth: 0,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{ display: { xs: "none", md: "block" }, minWidth: 0 }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={active ? 600 : 500}
                      noWrap
                    >
                      {chat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {formatTime(chat.updated_at)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: { xs: "grid", md: "none" },
                      placeItems: "center",
                      width: 28,
                      height: 28,
                      borderRadius: 1.5,
                      bgcolor: active
                        ? "rgba(124,156,255,0.2)"
                        : "action.hover",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {chat.title.slice(0, 1).toUpperCase()}
                  </Box>
                </Button>

                <IconButton
                  className="delete-btn"
                  size="small"
                  aria-label="Delete chat"
                  onClick={() => onDelete(chat.id)}
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    opacity: 0,
                    mr: 0.5,
                    color: "text.secondary",
                    transition: "opacity 150ms ease",
                    "&:hover": { color: "error.main" },
                  }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
