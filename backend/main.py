# Libs
from fastapi import FastAPI  # FastAPI
from fastapi.middleware.cors import CORSMiddleware  # FastAPI CORS

app = FastAPI(
    title="Rachel Agent API",
    version="0.1.0",
    summary="Backend of Rachel Agent API",
    description="Bringing my old Rachel back alive! Rachel is an Agent to communicate with my home hardware things!",
    openapi_tags=[
        {"name": "Application", "description": "Application things"},
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
)


@app.get("/", tags=["Application"])
async def ping():
    return {"message": "Rachel Agent API is running"}
