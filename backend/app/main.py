from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.schemas import (
    ForecastResponse,
    RecommendationResponse,
    SalesPoint,
    SimulationRequest,
    SimulationResponse,
)
from app.services.data_service import get_sales_frame, seed_database_if_empty
from app.services.forecast_service import forecast_service
from app.services.recommendation_service import build_recommendation
from app.services.simulation_service import run_profit_simulation

app = FastAPI(title="ProfitPilot AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        seed_database_if_empty(db)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/products", response_model=list[str])
def get_products(db: Session = Depends(get_db)):
    frame = get_sales_frame(db)
    if frame.empty:
        return []
    return sorted(frame["product_id"].astype(str).unique().tolist())


@app.get("/sales", response_model=list[SalesPoint])
def get_sales(
    product_id: str | None = Query(default=None),
    limit: int = Query(default=300, ge=10, le=2000),
    db: Session = Depends(get_db),
):
    frame = get_sales_frame(db, product_id=product_id)
    if frame.empty:
        return []

    tail = frame.sort_values("date").tail(limit)
    return [
        SalesPoint(
            product_id=str(row.product_id),
            date=row.date.date(),
            sales=round(float(row.sales), 2),
            inventory=round(float(row.inventory), 2),
            price=round(float(row.price), 2),
        )
        for row in tail.itertuples(index=False)
    ]


@app.get("/forecast")
def get_forecast(product_id: str, horizon_days: int, db: Session = Depends(get_db)):
    output = forecast_service.forecast_product(db, product_id, horizon_days)
    return output


@app.get("/recommendation")
def get_recommendation(product_id: str, horizon_days: int, db: Session = Depends(get_db)):
    forecast = forecast_service.forecast_product(db, product_id, horizon_days)
    rec = build_recommendation(db, product_id, forecast)
    return rec


@app.post("/simulate", response_model=SimulationResponse)
def simulate_strategy(payload: SimulationRequest, db: Session = Depends(get_db)):
    sales_df = get_sales_frame(db, product_id=payload.product_id).sort_values("date")
    if sales_df.empty:
        raise HTTPException(status_code=404, detail=f"No data found for product '{payload.product_id}'.")

    latest_inventory = float(sales_df["inventory"].iloc[-1])
    latest_price = float(sales_df["price"].iloc[-1])
    forecast = forecast_service.forecast_product(
        db,
        product_id=payload.product_id,
        horizon_days=payload.horizon_days,
    )
    simulation = run_profit_simulation(
        forecast_output=forecast,
        inventory=latest_inventory,
        price=latest_price,
        discount_pct=payload.discount_pct,
        delay_days=payload.time_delay_days,
    )

    return SimulationResponse(
        product_id=payload.product_id,
        horizon_days=payload.horizon_days,
        baseline=simulation["baseline"],
        simulated=simulation["simulated"],
        profit_difference=simulation["profit_difference"],
    )
