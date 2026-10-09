# Libs
from fastapi import APIRouter, Depends, HTTPException, status  # FastAPI
from sqlalchemy.orm import Session  # SQLAlchemy ORM
from datetime import datetime, timezone  # Datetime
from uuid import UUID  # UUID

# Application
from dependencies.database import get_db  # Dependencies: Database
from schemas.chat import ChatRead, ChatCreate, ChatUpdate  # Schemas: Chat
from models.chat import Chat  # Models: Chat

# Router
router = APIRouter(
    prefix="/chats",
    tags=["Chat"],
)


# GET - All chats
@router.get("", response_model=list[ChatRead])
async def all_chats(
    db: Session = Depends(get_db),
):
    db_chats = db.query(Chat).order_by(Chat.created_at.desc()).all()

    return db_chats


# POST - Create chat
@router.post("", response_model=ChatRead, status_code=status.HTTP_201_CREATED)
async def create_chats(
    chat_data: ChatCreate,
    db: Session = Depends(get_db),
):
    db_chat = Chat(**chat_data.model_dump())

    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)

    return db_chat


# GET - Get chat
@router.get("/{chat_id}", response_model=ChatRead)
async def get_chat(
    chat_id: UUID,
    db: Session = Depends(get_db),
):
    db_chat = db.get(Chat, chat_id)

    if not db_chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    return db_chat


# PATCH - Update chat
@router.patch("/{chat_id}", response_model=ChatRead)
async def update_chat(
    chat_id: UUID,
    chat_data: ChatUpdate,
    db: Session = Depends(get_db),
):
    db_chat = db.get(Chat, chat_id)

    if not db_chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    for key, value in chat_data.model_dump(exclude_unset=True).items():
        setattr(db_chat, key, value)

    db.commit()
    db.refresh(db_chat)

    return db_chat


# DELETE - Delete chat
@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(
    chat_id: UUID,
    db: Session = Depends(get_db),
):
    db_chat = db.get(Chat, chat_id)

    if not db_chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found",
        )

    db_chat.deleted_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(db_chat)

    return None
