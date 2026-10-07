def get_conditions(city: str) -> str:
    """Get the current weather conditions for a city

    Args:
      city: The name of the city

    Returns:
      The current weather conditions for the city
    """

    conditions = {
        "New York": "Partly cloudy",
        "London": "Rainy",
        "Tokyo": "Sunny",
    }

    return conditions.get(city, "Unknown")
