# Libs
from sqlalchemy import Uuid, ForeignKey  # SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship  # SQLAlchemy ORM
import uuid  # UUID

# Application
from base.model import BaseModel  # Base: Model


# Message Model
class Message(BaseModel):
    __tablename__ = "messages"

    # Columns
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )

    # Foreign Keys
    counter_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("chats.id"),
        index=True,
        nullable=False,
    )

    # Relationships
    chat: Mapped["Chat"] = relationship(
        "Chat",
        back_populates="messages",
    )
