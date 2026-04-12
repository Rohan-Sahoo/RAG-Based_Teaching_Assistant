# 🚀 RAG AI Teaching Assistant 

A full-stack **Retrieval-Augmented Generation (RAG) AI Assistant** built using **React + FastAPI + Ollama**, designed to answer questions based on course content using semantic search and local LLMs.

---

## 📌 Features

| Feature | Description |
|---|---|
| 💬 Chat-based UI | ChatGPT-style interface with typing animation |
| 🧠 RAG Pipeline | Intelligent answers grounded in course data |
| 🔍 Semantic Search | Cosine similarity over dense embeddings |
| 🗂️ Chat History | Sidebar with searchable past sessions |
| 🌙 Dark Mode | Toggle between light and dark themes |
| ⚡ REST API | FastAPI backend with a clean `/ask` endpoint |

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Axios
- CSS (Custom UI)

### Backend
- FastAPI
- Python
- Scikit-learn (cosine similarity)
- Joblib (embedding storage)

### AI / ML
- Ollama
  - `bge-m3` — Embeddings
  - `llama3.2` — LLM

---

## 🧠 How It Works (RAG Pipeline)

| Step | Stage | Detail |
|------|-------|--------|
| 1 | **User query** | Received from React frontend via `POST /ask` |
| 2 | **Generate query embedding** | `create_embedding()` calls Ollama with `bge-m3` |
| 3 | **Load stored embeddings** | `joblib.load("embeddings.joblib")` reads pre-built corpus |
| 4 | **Cosine similarity search** | Rank all chunks against the query embedding |
| 5 | **Retrieve top-K chunks** | `top_result = 3` most relevant content chunks selected |
| 6 | **Prompt engineering** | Chunks injected into a structured prompt template |
| 7 | **LLM inference → response** | `llama3.2` generates the final answer via Ollama |

---

## ⚙️ Backend Explanation

### `app.py`
- Defines the FastAPI server
- Exposes endpoint: `POST /ask`
- Accepts a user query and returns the generated response

### `incoming_process.py`

Core RAG logic:

**1. Generate Embeddings**
```python
create_embedding(text_list)
# Uses Ollama API with bge-m3
```

**2. Load Stored Embeddings**
```python
df = joblib.load("embeddings.joblib")
```

**3. Similarity Search**
```python
cosine_similarity(...)
```

**4. Retrieve Top-K Results**
```python
top_result = 3
```

**5. Prompt Engineering**
Injects retrieved chunks into the prompt template.

**6. LLM Inference**
```python
model = "llama3.2"
```

---

## 🎨 Frontend Components

Built using React with component-based architecture. Main state is handled in `App.jsx`.

| Component | Description |
|-----------|-------------|
| `Sidebar` | Chat history list with keyword search |
| `InputBar` | User text input and submission handling |
| `MessagePair` | Renders a question and its AI response |
| `TypingText` | Animated character-by-character reveal effect |
| `EmptyState` | Suggestion prompts shown on a new session |
| `TopBar` | Header with dark/light theme toggle |

---

## 🔌 API Usage

**Endpoint:** `POST /ask`

**Request:**
```json
{
  "question": "What is HTML?"
}
```

**Response:**
```json
{
  "answer": "HTML is..."
}
```

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Rohan-Sahoo/RAG-Based_Teaching_Assistant
cd project
```

### 2️⃣ Setup Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### 3️⃣ Setup Ollama

Install [Ollama](https://ollama.com) and run:
```bash
ollama pull bge-m3
ollama pull llama3.2
ollama serve
```

### 4️⃣ Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Usage

1. Open the frontend in your browser
2. Ask questions related to the course
3. Get context-aware answers powered by RAG

---

## ⚡ Possible Improvements

- 🔥 Use FAISS / Pinecone for scalable vector storage
- ⚡ Streaming token responses for real-time output
- 📱 Mobile-responsive layout
- 🔐 User authentication system
- 📊 Analytics dashboard

---

## ⚠️ Limitations

- Uses in-memory embeddings via Joblib — not suitable for large corpora
- Higher latency compared to cloud LLMs due to local inference
- Answer quality depends on embedding coverage of the course data

---

## 💡 Key Learnings

- Full-stack integration (React + FastAPI)
- RAG architecture design
- Prompt engineering
- Embedding-based retrieval
- UX design for AI applications

---

## 👨‍💻 Author

**Rohan Sahoo**

⭐ If you find this project useful, give it a star!
