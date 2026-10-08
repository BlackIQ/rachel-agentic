# Libs
import requests  # Requests

# Application
from core.settings import settings  # Core: Settings


def get_weather(city: str):
    """Get the current weather information for a city.

    Args:
        city: The name of the city.

    Returns:
        A dictionary containing current weather information.
        The response includes:
        - location.name: city name
        - current.temp_c: current temperature in Celsius
        - current.condition.text: current weather condition
        - current.humidity: humidity percentage
        - current.wind_kph: wind speed in km/h
    """

    response = requests.get(
        "https://api.weatherapi.com/v1/current.json",
        params={
            "q": city,
            "key": settings.WEATHER_APIKEY,
        },
    )

    data = response.json()

    return data
