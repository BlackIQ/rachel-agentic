# Libs
from pydantic_settings import BaseSettings, SettingsConfigDict  # Pydantic Settings


# Settings
class Settings(BaseSettings):
    # Model
    MODEL: str = "rachel-1.1:4b"
    WEATHER_APIKEY: str = ""
    PICO_IP: str = ""

    model_config = SettingsConfigDict(env_file=".env")


# Run the settings
settings = Settings()
