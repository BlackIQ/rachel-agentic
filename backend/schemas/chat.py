# Libs
from uuid import UUID  # UUID

# Application
from base.schema import BaseSchema  # Base: Schema


# Create Chat
class ChatCreate(BaseSchema):
    title: str


# Update Chat
class ChatUpdate(BaseSchema):
    title: str | None = None


# Read Chat
class ChatRead(ChatCreate):
    id: UUID
