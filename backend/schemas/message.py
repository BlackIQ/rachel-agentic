# Libs
from uuid import UUID  # UUID

# Application
from base.schema import BaseSchema  # Base: Schema
from enums.role import RoleEnum  # Enums: Role


# Create Message
class MessageCreate(BaseSchema):
    content: str


# Read Chat
class MessageRead(MessageCreate):
    id: UUID

    chat_id: UUID

    role: RoleEnum
    tool_name: str | None = None
