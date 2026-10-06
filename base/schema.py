# Libs
from pydantic import BaseModel, ConfigDict  # Pydantic


# Base Schema
class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
