# Libs
from fastapi import APIRouter  # FastAPI

# Application
from schemas.common import MessageSchema  # Schemas: Chat

# Router
router = APIRouter(
    prefix="",
    tags=["Application"],
)


# GET - Index
@router.get("/", response_model=MessageSchema)
async def index():
    return MessageSchema(
        message="Rachel Agent API is running",
    )
