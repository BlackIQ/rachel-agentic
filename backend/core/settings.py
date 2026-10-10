# Libs
from pydantic_settings import BaseSettings, SettingsConfigDict  # Pydantic Settings


# Settings
class Settings(BaseSettings):
    # Model
    # MODEL: str = "rachel-1.2:3b"
    MODEL: str = "rachel-1.4:4b"

    # Database
    POSTGRESQL_URL: str = ""

    # Hardware (Raspberry Pi Pico 2 W)
    PICO_IP: str = ""
    PICO_SECRET: str = ""

    # Weather API
    WEATHER_APIKEY: str = ""

    model_config = SettingsConfigDict(env_file=".env")


# Run the settings
settings = Settings()
