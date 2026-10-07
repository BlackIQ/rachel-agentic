# Libs
from pydantic_settings import BaseSettings, SettingsConfigDict  # Pydantic Settings


# Settings
class Settings(BaseSettings):
    # Model
    MODEL: str = "rachel-1.1:4b"

    model_config = SettingsConfigDict(env_file=".env")


# Run the settings
settings = Settings()
