FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml README.md /app/
COPY vectorflow/ /app/vectorflow/

RUN pip install --no-cache-dir .

EXPOSE 8000

CMD ["uvicorn", "vectorflow.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
