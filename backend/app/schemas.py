from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


class SalesPoint(BaseModel):
    product_id: str
    date: date
    sales: float
    inventory: float
    price: float


class ForecastPoint(BaseModel):
    date: date
    predicted_sales: float


class ForecastResponse(BaseModel):
    product_id: str
    horizon_days: int
    confidence_score: float
    forecast: list[ForecastPoint]
    model_features: list[str]


class RecommendationResponse(BaseModel):
    product_id: str
    action: str
    confidence_score: float = Field(ge=0, le=100)
    reason: list[str]
    suggested_restock_units: float | None = None
    suggested_discount_pct: float | None = None


class SimulationRequest(BaseModel):
    product_id: str
    discount_pct: float = Field(ge=0, le=80)
    time_delay_days: int = Field(ge=0, le=30)
    horizon_days: int = Field(default=14, ge=7, le=30)


class SimulationResult(BaseModel):
    strategy: Literal["baseline", "simulated"]
    expected_revenue: float
    expected_waste: float
    expected_profit: float


class SimulationResponse(BaseModel):
    product_id: str
    horizon_days: int
    baseline: SimulationResult
    simulated: SimulationResult
    profit_difference: float
