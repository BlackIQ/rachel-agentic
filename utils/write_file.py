# Libs
from pathlib import Path  # Path

WORKSPACE = Path("workspace")
WORKSPACE.mkdir(exist_ok=True)


def write_file(filename: str, content: str) -> str:
    """Create or overwrite a file with the given content.

    Args:
        filename: The filename, for example file.txt
        content: The content that should be written into the file.

    Returns:
        A success message with the path, or an error message.
    """

    path = WORKSPACE / filename
    path.write_text(content, encoding="utf-8")

    return f"Successfully wrote to {path}"
