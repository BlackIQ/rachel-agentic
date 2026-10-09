# Libs
import requests  # Requests
from requests.exceptions import RequestException  # Requests Exception

# Application
from core.settings import settings  # Core: Settings


def get_home_temperature():
    """Get the current home temperature information.

    Returns:
        A dictionary containing current home temperature information.
        The response includes:
        - temperature: home temperature
        - humidity: home humidity
    """

    try:
        response = requests.get(
            f"{settings.PICO_IP}/api/temperature",
            timeout=5,
        )

        response.raise_for_status()

        data = response.json()

        return {
            "success": True,
            "data": data,
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
