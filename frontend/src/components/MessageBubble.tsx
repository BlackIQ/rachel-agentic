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
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Chip
          size="small"
          label={`${message.tool_name ?? "tool"} · ${formatToolContent(message.content)}`}
          sx={{
            maxWidth: "100%",
            height: "auto",
            py: 0.75,
            px: 0.5,
            borderRadius: 2,
            bgcolor: "action.hover",
            color: "text.secondary",
            border: "1px solid",
            borderColor: "divider",
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
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: { xs: "92%", sm: "75%" },
          px: 2,
          py: 1.35,
          borderRadius: 2.5,
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
