# Libs
from pydantic_settings import BaseSettings, SettingsConfigDict  # Pydantic Settings


# Settings
class Settings(BaseSettings):
    # Model
    MODEL: str = "qwen3:4b"

    model_config = SettingsConfigDict(env_file=".env")


# Run the settings
settings = Settings()
