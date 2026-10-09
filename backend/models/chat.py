# Libs
from sqlalchemy import Uuid  # SQLAlchemy
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

    # Relationships
    messages: Mapped[list["Message"]] = relationship(
        "Message",
        back_populates="chat",
    )
