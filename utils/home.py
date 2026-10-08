# Libs
import requests  # Requests

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

    response = requests.get(
        f"{settings.PICO_IP}/temperature",
    )

    data = response.json()

    return data
