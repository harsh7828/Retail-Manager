import numpy as np
from sqlalchemy.orm import Session
from app.services.data_service import get_sales_frame
from app.services.forecast_service import ForecastOutput


def build_recommendation(db: Session, product_id: str, forecast_output: ForecastOutput):
    df = get_sales_frame(db, product_id)

    latest_inventory = float(df["inventory"].iloc[-1])
    forecast_vals = [x["predicted_sales"] for x in forecast_output.forecast]

    avg_forecast = np.mean(forecast_vals)
    cover = latest_inventory / max(avg_forecast, 1)

    if cover < 7:
        action = "Restock"
        reasons = [
            "Low inventory coverage",
            "High demand predicted",
            "Stockout risk detected"
        ]
        impact = {"sales": "+15%", "waste": "-25%"}

    elif cover > 30:
        action = "Discount"
        reasons = [
            "Excess inventory",
            "Low demand trend",
            "Risk of unsold stock"
        ]
        impact = {"sales": "+10%", "waste": "-30%"}

    else:
        action = "Hold"
        reasons = ["Balanced inventory"]
        impact = {"sales": "Stable", "waste": "Low"}

    return {
        "product_id": product_id,
        "action": action,
        "confidence_score": forecast_output.confidence,
        "reason": reasons,
        "impact": impact
    }