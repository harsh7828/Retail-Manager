# ProfitPilot AI Backend

FastAPI backend for the `ProfitPilot AI` retail decision engine.

## Features

- Sales data endpoint from SQLite
- XGBoost demand forecast (`7-30` days)
- Recommendation engine (`Restock`, `Discount`, `Hold inventory`)
- Profit simulation with discount and delay parameters
- Synthetic dataset generator for MVP use

## Project Structure

```text
backend/
  app/
    data/
    models/
      sales.py
    services/
      data_service.py
      forecast_service.py
      recommendation_service.py
      simulation_service.py
    database.py
    main.py
    schemas.py
  scripts/
    generate_data.py
  requirements.txt
```

## Run Locally

1. Create and activate virtual environment:
   - Windows PowerShell:
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. (Optional) Generate sample data explicitly:
   ```powershell
   python -m scripts.generate_data
   ```
4. Start API server:
   ```powershell
   uvicorn app.main:app --reload
   ```

The app auto-creates and seeds `profitpilot.db` on startup if empty.

## API Endpoints

- `GET /products`
- `GET /sales?product_id=P-001&limit=200`
- `GET /forecast?product_id=P-001&horizon_days=14`
- `GET /recommendation?product_id=P-001&horizon_days=14`
- `POST /simulate`

Example simulation body:

```json
{
  "product_id": "P-001",
  "discount_pct": 15,
  "time_delay_days": 3,
  "horizon_days": 14
}
```
