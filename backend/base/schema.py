# Libs
from pydantic import BaseModel, ConfigDict  # Pydantic


# Base: BaseSchema
class BaseSchema(BaseModel):

    model_config = ConfigDict(from_attributes=True)
