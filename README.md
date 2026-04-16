# ProfitPilot AI

Complete full-stack prototype for AI-powered retail decisions:

- Demand forecasting with XGBoost
- Actionable recommendations: restock, discount, hold
- Explainability with rule-based reasons and confidence score
- Profit simulation for discount and timing strategies

## Architecture

`React (Vite + Tailwind + Recharts) -> FastAPI -> ML services -> SQLite`

## Project Structure

```text
profitpilot-ai/
  backend/
    app/
    scripts/
    requirements.txt
  frontend/
    src/
    package.json
```

## Run End-to-End

Open two terminals from `profitpilot-ai` root.

### Terminal 1: backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

### Terminal 2: frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## User Flow

1. Frontend calls `GET /products` and selects a product.
2. App fetches `GET /sales`, `GET /forecast`, `GET /recommendation`.
3. Dashboard renders trend graphs, confidence, and recommendation reasons.
4. User uses simulator form, frontend sends `POST /simulate`.
5. App compares baseline vs simulated revenue/waste/profit.
