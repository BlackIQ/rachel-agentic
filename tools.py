from pathlib import Path

WORKSPACE = Path("workspace")
WORKSPACE.mkdir(exist_ok=True)


def create_text_file(filename: str, content: str) -> dict:
    path = WORKSPACE / filename

    path.write_text(content, encoding="utf-8")

    return {
        "success": True,
        "path": str(path),
    }
