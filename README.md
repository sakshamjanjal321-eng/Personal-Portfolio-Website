# VectorFlow 🌊

A production-ready, self-hosted pipeline engine for building Retrieval-Augmented Generation (RAG) applications. Clean, modular, and **completely LangChain-free**.

## Features

- 🔌 **Pluggable Architecture**: Easily swap loaders, chunkers, embedders, and vector stores.
- 📦 **Self-Hosted First**: Run locally using Docker Compose in a single command.
- ⚡ **Lightweight & Modular**: High performance, easy to debug, minimal boilerplate.
- 🗄️ **Multi-Database Support**: Integrated adapters for **Chroma** and **Qdrant**.
- 🧠 **Dual Embedding Support**: Support for local offline embeddings (using Hugging Face sentence-transformers) or OpenAI embeddings.

---

## Directory Layout

```text
vectorflow/
├── vectorflow/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── ingest.py    # POST /ingest (upload PDF/TXT documents)
│   │   │   ├── query.py     # POST /query (semantic search + response generation)
│   │   │   └── health.py    # GET /health
│   │   └── main.py          # FastAPI application initialization
│   ├── ingestion/
│   │   ├── loaders/         # PDF and plaintext document loading
│   │   └── chunkers/        # Recursive character text splitting
│   ├── embedders/           # Base interfaces + OpenAI & sentence-transformers implementations
│   ├── stores/              # Base interfaces + Chroma & Qdrant adapters
│   ├── retriever.py         # Search + rank document chunks
│   └── generator.py         # OpenAI LLM answer generation
├── docker-compose.yml       # Qdrant database + VectorFlow API stack
├── Dockerfile               # Production container build
├── pyproject.toml           # Package configuration and dependencies
└── README.md                # System documentation
```

---

## Configuration

VectorFlow is configured using environment variables:

| Environment Variable | Description | Default | Options |
|---|---|---|---|
| `EMBEDDING_PROVIDER` | Embeddings source | `local` | `local`, `openai` |
| `EMBEDDING_MODEL` | Embedding model name | `all-MiniLM-L6-v2` | E.g. `text-embedding-3-small` |
| `VECTOR_STORE` | Target vector database | `chroma` | `chroma`, `qdrant` |
| `CHROMA_PATH` | Persist directory path for Chroma | `./chroma_db` | Use `:memory:` for in-memory |
| `QDRANT_URL` | URL to connect to Qdrant cluster | `http://localhost:6333` | E.g., `http://qdrant:6333` |
| `OPENAI_API_KEY` | Key for OpenAI embedder & LLM | *Optional* | Required if using OpenAI |
| `LLM_MODEL` | Chat completion LLM model | `gpt-4o-mini` | E.g., `gpt-4o` |

---

## Getting Started

### 🐳 Run via Docker Compose (Recommended)

Start the Qdrant database and VectorFlow API in one command:

```bash
docker-compose up --build
```

Make sure to supply your `OPENAI_API_KEY` environment variable if you plan to use OpenAI models for generation:

```bash
OPENAI_API_KEY="your_api_key_here" docker-compose up --build
```

### 🐍 Run Locally

1. **Install Dependencies**:
   ```bash
   pip install .
   ```

2. **Run the API**:
   ```bash
   uvicorn vectorflow.api.main:app --reload --port 8000
   ```

---

## API Documentation

### 1. GET /health
Returns status check and active vector database.

* **Response**:
  ```json
  {
    "status": "ok",
    "store": "chroma"
  }
  ```

---

### 2. POST /ingest
Accepts form-data file uploads and embeds them into the vector store.

* **Request Headers**: `Content-Type: multipart/form-data`
* **Request Fields**:
  - `file`: PDF or Plaintext (TXT/MD) file
  - `collection`: Target collection/index name (default: `my-docs`)
  - `chunk_size`: Maximum character chunk size (default: `1000`)
  - `chunk_overlap`: Character overlap between chunks (default: `200`)

* **Response**:
  ```json
  {
    "chunks": 42,
    "status": "indexed"
  }
  ```

* **Example Call (cURL)**:
  ```bash
  curl -X POST -F "file=@document.pdf" -F "collection=my-docs" http://localhost:8000/ingest
  ```

---

### 3. POST /query
Queries the collection and returns a contextual answer alongside retrieved sources.

* **Request Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "question": "What is RAG?",
    "collection": "my-docs",
    "top_k": 5
  }
  ```

* **Response**:
  ```json
  {
    "answer": "Retrieval-Augmented Generation (RAG) is a technique that combines...",
    "sources": [
      {
        "content": "RAG bridges the gap between static LLM memory and real-time knowledge...",
        "score": 0.892,
        "metadata": {
          "source": "document.pdf",
          "page": 1,
          "chunk_index": 0
        }
      }
    ]
  }
  ```

* **Example Call (cURL)**:
  ```bash
  curl -X POST -H "Content-Type: application/json" \
    -d '{"question": "What is RAG?", "collection": "my-docs"}' \
    http://localhost:8000/query
  ```

---

## License
MIT License
