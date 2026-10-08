# Libs
import requests  # Requests
from requests.exceptions import RequestException  # Requests Exception

# Application
from core.settings import settings  # Core: Settings


def get_weather(city: str):
    """Get the current weather information for a city.

    Args:
        city: The name of the city.

    Returns:
        A dictionary containing current weather information,
        or an error structure if the request fails.
    """

    if not settings.WEATHER_APIKEY:
        return {
            "success": False,
            "error": "missing_api_key",
            "message": "Weather API key is not set in .env",
        }

    try:
        response = requests.get(
            "https://api.weatherapi.com/v1/current.json",
            params={
                "q": city,
                "key": settings.WEATHER_APIKEY,
            },
            timeout=8,
        )

        data = response.json()

        if response.ok:
            return {
                "success": True,
                "data": data,
            }

        error_msg = data.get("error", {}).get("message", "Unknown weather API error")

        return {
            "success": False,
            "error": "weather_api_error",
            "message": error_msg,
        }
    except RequestException as e:
        return {
            "success": False,
            "error": "network_error",
            "message": f"Could not reach WeatherAPI: {str(e)}",
        }
    except ValueError:
        return {
            "success": False,
            "error": "invalid_response",
            "message": "WeatherAPI returned invalid JSON",
        }
