# Libs
from sqlalchemy import Uuid, String  # SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship  # SQLAlchemy ORM
import uuid  # UUID

# Application
from base.model import BaseModel  # Base: Model


# Chat Model
class Chat(BaseModel):
    __tablename__ = "chats"

    # Columns
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="New Chat",
    )

    # Relationships
    messages: Mapped[list["Message"]] = relationship(
        "Message",
        back_populates="chat",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )
