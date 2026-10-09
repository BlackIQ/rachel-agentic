# Libs
from fastapi import APIRouter, Depends, HTTPException, status  # FastAPI
from sqlalchemy.orm import Session  # SQLAlchemy ORM
from uuid import UUID  # UUID

# Application
from dependencies.database import get_db  # Dependencies: Database
from schemas.message import MessageRead, MessageCreate  # Schemas: Chat
from models.message import Message  # Models: Message
from models.chat import Chat  # Models: Chat
from enums.role import RoleEnum  # Enums: Role

# Router
router = APIRouter(
    prefix="/messages",
    tags=["Message"],
)


# GET - All messages
@router.get("/{chat_id}", response_model=list[MessageRead])
async def all_messages(
    chat_id: UUID,
    db: Session = Depends(get_db),
):
    db_chat = db.get(Chat, chat_id)

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
    "/{chat_id}", response_model=MessageRead, status_code=status.HTTP_201_CREATED
)
async def create_message(
    chat_id: UUID,
    message_data: MessageCreate,
    db: Session = Depends(get_db),
):
    db_chat = db.get(Chat, chat_id)

    if not db_chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    db_message = Message(
        **message_data.model_dump(),
        role=RoleEnum.USER,
        chat_id=db_chat.id,
    )

    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    return db_message
