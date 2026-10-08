# Libs
import requests  # Requests

# Application
from core.settings import settings  # Core: Settings


def get_pico_resources():
    """Get the current raspberry pi pico device resources information.

    Returns:
        A dictionary containing current raspberry pi pico device resources information.
        The response includes:
        - free: free memory
        - allocated: allocated memory
    """

    response = requests.get(
        f"{settings.PICO_IP}/api/system/memory",
    )

    data = response.json()

    return data
