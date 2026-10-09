"use client";

import {
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Paper,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

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
          py: 0.5,
          borderRadius: 2.5,
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
            px: 1.25,
            py: 1.1,
            fontSize: "0.95rem",
            lineHeight: 1.55,
          }}
        />

        <IconButton
          type="submit"
          disabled={!value.trim() || busy}
          aria-label="Send"
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            mb: 0.35,
            borderRadius: 2,
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
            <CircularProgress size={18} color="inherit" />
          ) : (
            <SendRoundedIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      </Paper>
    </Box>
  );
}
