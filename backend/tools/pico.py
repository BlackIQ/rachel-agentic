# Libs
import requests  # Requests
from requests.exceptions import RequestException  # Requests Exception

# Application
from core.settings import settings  # Core: Settings
from tools.schema import ToolResult  # Tools: Schema


def get_pico_resources() -> dict:
    """Get Raspberry Pi Pico memory information.

    Returns:
        ToolResult as dict. On success, data includes:
            - free: free memory
            - allocated: allocated memory

        On failure, error may be:
            - auth_failed
            - pico_unreachable
            - pico_error
            - invalid_response
    """

    try:
        headers = {
            "Authorization": f"Bearer {settings.PICO_SECRET}",
        }

        response = requests.get(
            f"{settings.PICO_IP}/api/system/memory",
            headers=headers,
            timeout=5,
        )

        try:
            data = response.json()
        except ValueError:
            return ToolResult(
                success=False,
                error="invalid_response",
                message="Pico returned invalid JSON",
            ).to_agent()

        if response.status_code == 401:
            return ToolResult(
                success=False,
                error="auth_failed",
                message="Authentication failed. Check PICO_SECRET and Pico TOKEN.",
            ).to_agent()

        if not response.ok:
            return ToolResult(
                success=False,
                error="pico_error",
                message=data.get("message", "Pico error"),
            ).to_agent()

        return ToolResult(
            success=True,
            message="Pico memory reading",
            data={
                "free": data.get("free"),
                "allocated": data.get("allocated"),
            },
        ).to_agent()

    except RequestException as e:
        return ToolResult(
            success=False,
            error="pico_unreachable",
            message=f"Could not reach the Pico device: {str(e)}",
        ).to_agent()
