# Libs
from enum import StrEnum  # Enum


# Enum: Reminder
class RoleEnum(StrEnum):
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"
    SYSTEM = "system"
