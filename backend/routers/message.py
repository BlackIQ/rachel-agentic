# Libs
from fastapi import APIRouter, Depends, HTTPException, status  # FastAPI
from sqlalchemy.orm import Session  # SQLAlchemy ORM
from datetime import datetime, timezone  # Datetime
from uuid import UUID  # UUID

# Application
from dependencies.database import get_db  # Dependencies: Database
from schemas.message import MessageRead, MessageCreate  # Schemas: Chat
from models.message import Message  # Models: Message
from models.chat import Chat  # Models: Chat
from enums.role import RoleEnum  # Enums: Role
from services.agent import run_agent  # Services: Agent

# Router
router = APIRouter(
    prefix="/messages",
    tags=["Message"],
)


# GET - All messages
@router.get(
    "/{chat_id}",
    response_model=list[MessageRead],
)
async def all_messages(
    chat_id: UUID,
    db: Session = Depends(get_db),
):
    db_chat = (
        db.query(Chat)
        .where(
            Chat.id == chat_id,
            Chat.deleted_at.is_(None),
        )
        .one_or_none()
    )

    if not db_chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    db_messages = (
        db.query(Message)
        .where(Message.chat_id == db_chat.id)
        .order_by(Message.created_at.asc())
        .all()
    )

    return db_messages


# POST - Create message
@router.post(
    "/{chat_id}",
    response_model=list[MessageRead],
    status_code=status.HTTP_201_CREATED,
)
async def create_message(
    chat_id: UUID,
    message_data: MessageCreate,
    db: Session = Depends(get_db),
):
    db_chat = (
        db.query(Chat)
        .where(
            Chat.id == chat_id,
            Chat.deleted_at.is_(None),
        )
        .one_or_none()
    )

    if not db_chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    user_message = Message(
        content=message_data.content,
        role=RoleEnum.USER,
        chat_id=db_chat.id,
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    db_messages = (
        db.query(Message)
        .where(
            Message.chat_id == db_chat.id,
        )
        .order_by(
            Message.created_at.asc(),
        )
        .all()
    )

    history = [
        {
            "role": m.role.value if hasattr(m.role, "value") else m.role,
            "content": m.content,
            "tool_name": m.tool_name,
        }
        for m in db_messages
    ]

    new_messages_data = run_agent(history)

    saved_messages = [user_message]

    for msg_data in new_messages_data:
        db_msg = Message(
            content=msg_data["content"],
            role=msg_data["role"],
            tool_name=msg_data.get("tool_name"),
            chat_id=db_chat.id,
        )

        db.add(db_msg)

        saved_messages.append(db_msg)

    db_chat.updated_at = datetime.now(timezone.utc)

    db.commit()

    for msg in saved_messages:
        db.refresh(msg)

    return saved_messages
