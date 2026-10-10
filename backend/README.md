# Rachel Backend

FastAPI service for **Rachel** includes chat storage, Ollama agent loop, and hardware tools.

## Techs

- **Python**: 💛
- **FastAPI**: Backend framework
- **SQLAlchemy**: ORM
- **Alembic**: Migrations
- **PostgreSQL**: Database
- **UV**: Dependency management
- **Ollama**: Local LLM

## Setup

First go inside directory:

```bash
cd backend
```

After that sync dependencies:

```bash
uv sync
```

### Configure `.env`

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit it:

```env
POSTGRESQL_URL=postgresql+psycopg2://user:pass@localhost:5432/rachel
PICO_IP=http://192.168.1.50
WEATHER_APIKEY=your_weatherapi_key
```

> You can override model via `Settings.MODEL` in `core/settings.py` (default: `rachel-1.3:4b`).

### Database

Update your database:

```bash
uv run alembic upgrade head
```

### Run

Simple:

```bash
uv run fastapi dev
```

- API: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`
- Redoc docs: `http://127.0.0.1:8000/redoc`

## You must have:

- Having **UV** installed
- Python version **3.13**
- Running **Ollama** with the Rachel model
- Be sure **PostgreSQL** is installed or you have one anywhere
- Pico reachable at `PICO_IP`
