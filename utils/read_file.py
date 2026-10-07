# Libs
from pathlib import Path  # Path

WORKSPACE = Path("workspace")
WORKSPACE.mkdir(exist_ok=True)


def read_file(filename: str) -> str:
    """Read the content of an existing file in the workspace.

    Args:
        filename: The filename to read, for example file.txt

    Returns:
        The file content, or an error message if the file does not exist.
    """

    path = WORKSPACE / filename

    if not path.exists():
        return f"Error: File '{filename}' not found."

    return path.read_text(encoding="utf-8")
