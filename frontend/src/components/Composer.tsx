"use client";

// MUI
import {
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Paper,
} from "@mui/material";

// MUI Icons
import { SendRounded } from "@mui/icons-material";

type Props = {
  value: string;
  disabled?: boolean;
  sending?: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
};

export default function Composer({
  value,
  disabled,
  sending,
  onChange,
  onSend,
}: Props) {
  const busy = disabled || sending;

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        pb: { xs: "max(12px, env(safe-area-inset-bottom))", sm: 2.5 },
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={0}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 0.75,
          px: 1,
          py: 0.4,
          borderRadius: 1.5,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          transition: "border-color 120ms ease",
          "&:focus-within": {
            borderColor: "primary.main",
          },
        }}
      >
        <InputBase
          fullWidth
          multiline
          maxRows={5}
          placeholder="Message Rachel…"
          value={value}
          disabled={busy}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              onSend();
            }
          }}
          inputProps={{
            dir: "auto",
            "aria-label": "Message Rachel",
          }}
          sx={{
            px: 1.1,
            py: 1,
            fontSize: "0.925rem",
            lineHeight: 1.5,
          }}
        />

        <IconButton
          type="submit"
          disabled={!value.trim() || busy}
          aria-label="Send"
          sx={{
            width: 38,
            height: 38,
            flexShrink: 0,
            mb: 0.3,
            borderRadius: 1.25,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": { bgcolor: "primary.dark" },
            "&.Mui-disabled": {
              bgcolor: "action.hover",
              color: "text.disabled",
            },
          }}
        >
          {sending ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <SendRounded sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Paper>
    </Box>
  );
}
