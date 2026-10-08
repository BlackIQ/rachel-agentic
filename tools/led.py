# Libs
import requests  # Requests
from requests.exceptions import RequestException  # Requests Exception

# Application
from core.settings import settings  # Core: Settings

VALID_LEDS = {
    "white",
    "green",
    "red",
    "blue",
}


def turn_led_on(name: str):
    """Turn on a specific LED on the Rachel Pico device.

    Args:
        name: The name of the LED to turn on.
              Must be one of: "green", "red", "blue", "white".

    Returns:
        A dictionary with the result of the operation.
        On success:
            - success: True
            - message: Confirmation message from the device
        On failure:
            - success: False
            - error: Error code ("unknown_led" or "pico_error")
            - message: Human-readable error message
    """

    if name not in VALID_LEDS:
        return {
            "success": False,
            "error": "unknown_led",
            "message": f"Unknown LED: {name}",
        }

    try:
        response = requests.post(
            f"{settings.PICO_IP}/api/leds/{name}/on",
            timeout=5,
        )

        data = response.json()

        if response.ok:
            return {
                "success": True,
                "message": data.get("message", f"{name} is now on"),
            }

        return {
            "success": False,
            "error": "pico_error",
            "message": data.get("message", "Unknown error from Pico"),
        }
    except RequestException as e:
        return {
            "success": False,
            "error": "pico_unreachable",
            "message": f"Could not reach the Pico device: {str(e)}",
        }
    except ValueError:
        return {
            "success": False,
            "error": "invalid_response",
            "message": "Pico returned invalid JSON",
        }


def turn_led_off(name: str):
    """Turn off a specific LED on the Rachel Pico device.

    Args:
        name: The name of the LED to turn off.
              Must be one of: "green", "red", "blue", "white".

    Returns:
        A dictionary with the result of the operation.
        On success:
            - success: True
            - message: Confirmation message from the device
        On failure:
            - success: False
            - error: Error code ("unknown_led" or "pico_error")
            - message: Human-readable error message
    """

    if name not in VALID_LEDS:
        return {
            "success": False,
            "error": "unknown_led",
            "message": f"Unknown LED: {name}",
        }

    try:
        response = requests.post(
            f"{settings.PICO_IP}/api/leds/{name}/off",
            timeout=5,
        )

        data = response.json()

        if response.ok:
            return {
                "success": True,
                "message": data.get("message", f"{name} is now off"),
            }

        return {
            "success": False,
            "error": "pico_error",
            "message": data.get("message", "Unknown error from Pico"),
        }
    except RequestException as e:
        return {
            "success": False,
            "error": "pico_unreachable",
            "message": f"Could not reach the Pico device: {str(e)}",
        }
    except ValueError:
        return {
            "success": False,
            "error": "invalid_response",
            "message": "Pico returned invalid JSON",
        }
