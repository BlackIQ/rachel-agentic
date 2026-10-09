"use client";

import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
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
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        pb: { xs: 2, sm: 2.5 },
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
          px: 1.5,
          py: 1,
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={5}
          variant="standard"
          placeholder="Message Rachel…"
          value={value}
          disabled={disabled || sending}
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
          slotProps={{
            htmlInput: { dir: "auto", "aria-label": "Message Rachel" },
            input: { disableUnderline: true },
          }}
          sx={{
            "& .MuiInputBase-root": {
              fontSize: "0.95rem",
              py: 0.75,
            },
          }}
        />

        <IconButton
          onClick={onSend}
          disabled={!value.trim() || sending || disabled}
          aria-label="Send"
          sx={{
            width: 42,
            height: 42,
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
            <CircularProgress size={20} color="inherit" />
          ) : (
            <SendRoundedIcon fontSize="small" />
          )}
        </IconButton>
      </Paper>
    </Box>
  );
}
