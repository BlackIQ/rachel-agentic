# Libs
from typing import Any, Literal, Optional  # Typing
from pydantic import BaseModel  # Pydantic

ToolErrorCode = Literal[
    "auth_failed",
    "pico_unreachable",
    "pico_error",
    "unknown_led",
    "invalid_response",
    "tool_not_found",
    "missing_api_key",
    "weather_api_error",
    "network_error",
]


class ToolResult(BaseModel):
    """Standard envelope for every agent tool return value."""

    success: bool
    error: Optional[ToolErrorCode] = None
    message: Optional[str] = None
    data: Optional[dict[str, Any]] = None

    def to_agent(self) -> dict[str, Any]:
        """Dict passed to Ollama as tool content (JSON serializable)."""
        return self.model_dump(exclude_none=True)
