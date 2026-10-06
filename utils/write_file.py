# Libs
from pathlib import Path  # Path

# Application
from base.schema import BaseSchema  # Base: Schema

WORKSPACE = Path("workspace")
WORKSPACE.mkdir(exist_ok=True)


class WriteFileSchema(BaseSchema):
    success: bool
    path: str | None = None


def write_file(filename: str, content: str) -> WriteFileSchema:
    path = WORKSPACE / filename

    path.write_text(content, encoding="utf-8")

    return WriteFileSchema(
        success=True,
        path=str(path),
    )
