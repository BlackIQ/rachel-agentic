"use client";

// React
import { useState } from "react";

// MUI
import { Box, Collapse, Typography } from "@mui/material";

// MUI Icons
import {
  CheckCircleOutlineRounded,
  ExpandMoreRounded,
} from "@mui/icons-material";

// Lib
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
  if (!name) return "tool";
  return name
    .replace(/^get_/, "")
    .replace(/^turn_/, "")
    .replace(/_/g, " ");
}

type Props = {
  tools: Message[];
};

export default function ToolGroup({ tools }: Props) {
  const [open, setOpen] = useState(false);

  const summary =
    tools.length === 1
      ? formatToolContent(tools[0].content)
      : `${tools.length} actions`;

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
      <Box sx={{ maxWidth: { xs: "95%", sm: "80%" } }}>
        <Box
          component="button"
          type="button"
          onClick={() => setOpen((v) => !v)}
          sx={{
            all: "unset",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
            px: 0.75,
            py: 0.35,
            borderRadius: 1,
            color: "text.secondary",
            transition: "color 120ms ease, background-color 120ms ease",
            "&:hover": {
              color: "text.primary",
              bgcolor: "action.hover",
            },
          }}
        >
          <CheckCircleOutlineRounded sx={{ fontSize: 15, opacity: 0.85 }} />
          <Typography
            component="span"
            sx={{
              fontSize: "0.75rem",
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            {summary}
          </Typography>
          <ExpandMoreRounded
            sx={{
              fontSize: 16,
              opacity: 0.7,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 150ms ease",
            }}
          />
        </Box>

        <Collapse in={open}>
          <Box
            sx={{
              mt: 0.75,
              ml: 0.5,
              pl: 1.25,
              borderLeft: "2px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            {tools.map((t) => (
              <Typography
                key={t.id}
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: "0.75rem",
                  lineHeight: 1.45,
                  overflowWrap: "anywhere",
                }}
              >
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "text.primary", mr: 0.5 }}
                >
                  {friendlyToolName(t.tool_name)}
                </Box>
                {formatToolContent(t.content)}
              </Typography>
            ))}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
