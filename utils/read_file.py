# Libs
from pathlib import Path  # Path

# Application
from base.schema import BaseSchema  # Base: Schema

WORKSPACE = Path("workspace")
WORKSPACE.mkdir(exist_ok=True)


class ReadFileSchema(BaseSchema):
    success: bool
    path: str | None = None
    content: str | None = None
    error: str | None = None


def read_file(filename: str) -> ReadFileSchema:
    path = WORKSPACE / filename

    if not path.exists():
        return ReadFileSchema(
            success=False,
            error="File not found",
        )

    content = path.read_text(encoding="utf-8")

    return ReadFileSchema(
        success=True,
        path=str(path),
        content=content,
    )
