"use client";

import { Box, Paper, Typography } from "@mui/material";
import type { Message } from "@/lib/types";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  // tool messages are rendered via ToolGroup
  if (message.role === "tool") return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: { xs: "92%", sm: "75%" },
          px: 1.75,
          py: 1.2,
          borderRadius: 1.5,
          bgcolor: isUser ? "primary.main" : "background.paper",
          color: isUser ? "primary.contrastText" : "text.primary",
          border: isAssistant ? "1px solid" : "none",
          borderColor: "divider",
        }}
      >
        <Typography
          component="div"
          dir="auto"
          sx={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            fontSize: "0.925rem",
            lineHeight: 1.65,
          }}
        >
          {message.content}
        </Typography>
      </Paper>
    </Box>
  );
}
