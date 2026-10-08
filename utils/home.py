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
    """

    response = requests.get(
        f"{settings.PICO_IP}/home/temperature",
    )

    data = response.json()

    return data


def get_home_humidity():
    """Get the current home humidity information.

    Returns:
        A dictionary containing current home humidity information.
        The response includes:
        - humidity: home humidity
    """

    response = requests.get(
        f"{settings.PICO_IP}/home/humidity",
    )

    data = response.json()

    return data
