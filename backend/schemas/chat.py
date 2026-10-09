# Libs
from uuid import UUID  # UUID
from datetime import datetime  # Datetime

# Application
from base.schema import BaseSchema  # Base: Schema
from schemas.message import MessageRead  # Schemas: Message


# Create Chat
class ChatCreate(BaseSchema):
    title: str


# Update Chat
class ChatUpdate(BaseSchema):
    title: str | None = None


# Read Chat
class ChatRead(ChatCreate):
    id: UUID

    created_at: datetime
    updated_at: datetime


class ChatWithMessages(ChatRead):
    messages: list[MessageRead] = []
