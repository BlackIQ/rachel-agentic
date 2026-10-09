"use client";

import { Box, Chip, Paper, Typography } from "@mui/material";
import type { Message } from "@/lib/types";

function formatToolContent(content: string): string {
  try {
    const parsed = JSON.parse(content) as {
      success?: boolean;
      message?: string;
      data?: unknown;
      error?: string;
    };

    if (parsed.message) return parsed.message;
    if (parsed.success === false && parsed.error) return String(parsed.error);
    if (parsed.data && typeof parsed.data === "object") {
      const data = parsed.data as Record<string, unknown>;
      if ("temperature" in data || "humidity" in data) {
        const parts: string[] = [];
        if (data.temperature != null) parts.push(`${data.temperature}°C`);
        if (data.humidity != null) parts.push(`${data.humidity}% humidity`);
        return parts.join(" · ");
      }
    }
    return content;
  } catch {
    return content;
  }
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const isTool = message.role === "tool";
  const isAssistant = message.role === "assistant";

  if (isTool) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          px: { xs: 1, sm: 0 },
        }}
      >
        <Chip
          size="small"
          label={`${message.tool_name ?? "tool"} · ${formatToolContent(message.content)}`}
          sx={{
            maxWidth: "100%",
            height: "auto",
            py: 0.75,
            px: 0.5,
            borderRadius: 2,
            bgcolor: "rgba(124, 156, 255, 0.12)",
            color: "primary.light",
            border: "1px solid rgba(124, 156, 255, 0.22)",
            "& .MuiChip-label": {
              whiteSpace: "normal",
              fontSize: "0.75rem",
              lineHeight: 1.45,
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        px: { xs: 1, sm: 0 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: { xs: "92%", sm: "75%" },
          px: 2,
          py: 1.4,
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
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
            fontSize: "0.95rem",
            lineHeight: 1.7,
          }}
        >
          {message.content}
        </Typography>
      </Paper>
    </Box>
  );
}
