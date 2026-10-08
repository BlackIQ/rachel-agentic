# Libs
import requests  # Requests

# Application
from core.settings import settings  # Core: Settings


def get_pico_temperature():
    """Get the current raspberry pi pico device temperature information.

    Returns:
        A dictionary containing current raspberry pi pico device temperature information.
        The response includes:
        - temperature: home temperature
    """

    response = requests.get(
        f"{settings.PICO_IP}/pico/temperature",
    )

    data = response.json()

    return data
