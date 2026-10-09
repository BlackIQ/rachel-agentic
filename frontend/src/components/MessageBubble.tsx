"use client";

import { Box, Paper, Typography } from "@mui/material";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
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

function friendlyToolName(name: string | null): string {
  if (!name) return "Tool";
  return name
    .replace(/^get_/, "")
    .replace(/^turn_/, "")
    .replace(/_/g, " ");
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const isTool = message.role === "tool";
  const isAssistant = message.role === "assistant";

  if (isTool) {
    const label = friendlyToolName(message.tool_name);
    const detail = formatToolContent(message.content);

    return (
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            maxWidth: { xs: "95%", sm: "80%" },
            px: 1.25,
            py: 1,
            borderRadius: 1.5,
            borderLeft: "3px solid",
            borderColor: "primary.main",
            bgcolor: (t) =>
              t.palette.mode === "dark"
                ? "rgba(107, 207, 154, 0.10)"
                : "rgba(27, 122, 74, 0.08)",
          }}
        >
          <BuildOutlinedIcon
            sx={{
              fontSize: 16,
              mt: 0.2,
              color: "primary.main",
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="primary.main"
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                display: "block",
                lineHeight: 1.3,
              }}
            >
              {label}
            </Typography>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{
                mt: 0.25,
                fontSize: "0.82rem",
                lineHeight: 1.45,
                overflowWrap: "anywhere",
              }}
            >
              {detail}
            </Typography>
          </Box>
        </Box>
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
