# Libs
import requests  # Requests
from requests.exceptions import RequestException  # Requests Exception

# Application
from core.settings import settings  # Core: Settings
from tools.schema import ToolResult  # Tools: Schema

VALID_LEDS = {
    "white",
    "green",
    "red",
    "blue",
}


def turn_led_on(name: str) -> dict:
    """Turn on a specific LED on the Rachel Pico device.

    Args:
        name: LED name. One of: "green", "red", "blue", "white".

    Returns:
        ToolResult as dict.

        On failure, error may be:
            - unknown_led
            - auth_failed
            - pico_unreachable
            - pico_error
            - invalid_response
    """

    if name not in VALID_LEDS:
        return ToolResult(
            success=False,
            error="unknown_led",
            message=f"Unknown LED: {name}",
        ).to_agent()

    try:
        headers = {
            "Authorization": f"Bearer {settings.PICO_SECRET}",
        }

        response = requests.post(
            f"{settings.PICO_IP}/api/leds/{name}/on",
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
            message=data.get("message", f"LED {name} is now on"),
        ).to_agent()

    except RequestException:
        return ToolResult(
            success=False,
            error="pico_unreachable",
            message="Could not reach the Pico device. Check power and network.",
        ).to_agent()


def turn_led_off(name: str) -> dict:
    """Turn off a specific LED on the Rachel Pico device.

    Args:
        name: LED name. One of: "green", "red", "blue", "white".

    Returns:
        ToolResult as dict.

        On failure, error may be:
            - unknown_led
            - auth_failed
            - pico_unreachable
            - pico_error
            - invalid_response
    """

    if name not in VALID_LEDS:
        return ToolResult(
            success=False,
            error="unknown_led",
            message=f"Unknown LED: {name}",
        ).to_agent()

    try:
        headers = {
            "Authorization": f"Bearer {settings.PICO_SECRET}",
        }

        response = requests.post(
            f"{settings.PICO_IP}/api/leds/{name}/off",
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
            message=data.get("message", f"LED {name} is now off"),
        ).to_agent()

    except RequestException:
        return ToolResult(
            success=False,
            error="pico_unreachable",
            message="Could not reach the Pico device. Check power and network.",
        ).to_agent()
