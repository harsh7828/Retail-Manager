def run_profit_simulation(forecast_output, inventory, price, discount_pct, delay_days):
    forecast = [x["predicted_sales"] for x in forecast_output.forecast]

    # 🔹 BASELINE (no discount)
    baseline_revenue = sum(min(inventory, d) * price for d in forecast)
    baseline_waste = max(0, inventory - sum(forecast)) * price * 0.3
    baseline_profit = baseline_revenue - baseline_waste

    # 🔹 DISCOUNT IMPACT
    uplift = 1 + (discount_pct * 0.02)
    uplift = min(1.6, uplift)

    adjusted_forecast = [d * uplift for d in forecast]

    simulated_revenue = sum(min(inventory, d) * price * (1 - discount_pct / 100) for d in adjusted_forecast)
    simulated_waste = max(0, inventory - sum(adjusted_forecast)) * price * 0.3
    simulated_profit = simulated_revenue - simulated_waste

    return {
        "baseline": {
            "strategy": "baseline",
            "expected_revenue": round(baseline_revenue, 2),
            "expected_waste": round(baseline_waste, 2),
            "expected_profit": round(baseline_profit, 2),
        },
        "simulated": {
            "strategy": "simulated",
            "expected_revenue": round(simulated_revenue, 2),
            "expected_waste": round(simulated_waste, 2),
            "expected_profit": round(simulated_profit, 2),
        },
        "profit_difference": round(simulated_profit - baseline_profit, 2),
    }