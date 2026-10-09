# Application
from core.database import SessionLocal  # Core: Database


# Get DB Dependency
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
