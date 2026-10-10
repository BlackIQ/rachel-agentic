# Libs
import requests  # Requests
from requests.exceptions import RequestException  # Requests Exception

# Application
from core.settings import settings  # Core: Settings
from tools.schema import ToolResult  # Tools: Schema

VALID_RELAYS = {
    "library",
    "room",
}


def turn_relay_on(name: str) -> dict:
    """Turn on a specific relay on the Rachel Pico device.

    Args:
        name: Relay name. One of: "library", "room".

    Returns:
        ToolResult as dict.

        On failure, error may be:
            - unknown_relay
            - auth_failed
            - pico_unreachable
            - pico_error
            - invalid_response
    """

    if name not in VALID_RELAYS:
        return ToolResult(
            success=False,
            error="unknown_relay",
            message=f"Unknown relay: {name}",
        ).to_agent()

    try:
        headers = {
            "Authorization": f"Bearer {settings.PICO_SECRET}",
        }

        response = requests.post(
            f"{settings.PICO_IP}/api/relays/{name}/on",
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
            message=data.get("message", f"Relay {name} is now on"),
        ).to_agent()

    except RequestException:
        return ToolResult(
            success=False,
            error="pico_unreachable",
            message="Could not reach the Pico device. Check power and network.",
        ).to_agent()


def turn_relay_off(name: str) -> dict:
    """Turn off a specific relay on the Rachel Pico device.

    Args:
        name: Relay name. One of: "library", "room".

    Returns:
        ToolResult as dict.

        On failure, error may be:
            - unknown_relay
            - auth_failed
            - pico_unreachable
            - pico_error
            - invalid_response
    """

    if name not in VALID_RELAYS:
        return ToolResult(
            success=False,
            error="unknown_relay",
            message=f"Unknown relay: {name}",
        ).to_agent()

    try:
        headers = {
            "Authorization": f"Bearer {settings.PICO_SECRET}",
        }

        response = requests.post(
            f"{settings.PICO_IP}/api/relays/{name}/off",
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
            message=data.get("message", f"Relay {name} is now off"),
        ).to_agent()

    except RequestException:
        return ToolResult(
            success=False,
            error="pico_unreachable",
            message="Could not reach the Pico device. Check power and network.",
        ).to_agent()
