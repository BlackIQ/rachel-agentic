# Libs
from fastapi import FastAPI  # FastAPI
from fastapi.middleware.cors import CORSMiddleware  # FastAPI CORS

# Application
from routers import application, chat, message  # Routers

app = FastAPI(
    title="Rachel Agent API",
    version="0.1.0",
    summary="Backend of Rachel Agent API",
    description="Bringing my old Rachel back alive! Rachel is an Agent to communicate with my home hardware things!",
    openapi_tags=[
        {"name": "Application", "description": "Application endpoints"},
        {"name": "Chat", "description": "Chat endpoints"},
        {"name": "Message", "description": "Message endpoints"},
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "http://10.1.30.253:3000",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(application.router, prefix="")
app.include_router(chat.router, prefix="/api")
app.include_router(message.router, prefix="/api")
