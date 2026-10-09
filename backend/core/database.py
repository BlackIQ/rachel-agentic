# Libs
from sqlalchemy import create_engine  # SQLAlchemy
from sqlalchemy.orm import sessionmaker  # SQLAlchemy ORM

# Application
from core.settings import settings  # Core: Settings

# DB Engine
engine = create_engine(settings.POSTGRESQL_URL)

# Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
