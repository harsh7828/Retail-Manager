import { useEffect, useMemo, useState } from "react";
import MetricCard from "./components/MetricCard";
import ProfitSimulator from "./components/ProfitSimulator";
import RecommendationPanel from "./components/RecommendationPanel";
import SalesForecastChart from "./components/SalesForecastChart";
import AIChat from "./components/AIChat";
import DecisionHistory from "./components/DecisionHistory";
import Alerts from "./components/Alerts";

import {
  fetchForecast,
  fetchProducts,
  fetchRecommendation,
  fetchSales,
  runSimulation,
} from "./services/api";

import { currency, number, pct } from "./utils/formatters";

const DEFAULT_PRODUCT = "";

function App() {
  const [productId, setProductId] = useState(DEFAULT_PRODUCT);
  const [products, setProducts] = useState([]);
  const [horizonDays, setHorizonDays] = useState(14);
  const [sales, setSales] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState({
    page: false,
    recommendation: false,
    simulation: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const list = await fetchProducts();
        setProducts(list);
        if (!productId && list.length) {
          setProductId(list[0]);
        }
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
          err.message ||
          "Failed to load product list."
        );
      }
    };
    loadProducts();
  }, []);

  const refreshAll = async () => {
    if (!productId) return;

    setError("");
    setLoading((prev) => ({ ...prev, page: true, recommendation: true }));

    try {
      const [salesRes, forecastRes, recRes] = await Promise.all([
        fetchSales(productId),
        fetchForecast(productId, horizonDays),
        fetchRecommendation(productId, horizonDays),
      ]);

      setSales(salesRes);
      setForecast(forecastRes);
      setRecommendation(recRes);
      setSimulation(null);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err.message ||
        "Failed to load dashboard data."
      );
    } finally {
      setLoading((prev) => ({
        ...prev,
        page: false,
        recommendation: false,
      }));
    }
  };

  useEffect(() => {
    refreshAll();
  }, [productId, horizonDays]);

  const chartData = useMemo(() => {
    const history = sales.map((row) => ({
      date: row.date,
      sales: row.sales,
      predicted_sales: null,
    }));

    const future = (forecast?.forecast || []).map((row) => ({
      date: row.date,
      sales: null,
      predicted_sales: row.predicted_sales,
    }));

    return [...history, ...future];
  }, [sales, forecast]);

  const latest = sales.length ? sales[sales.length - 1] : null;

  const avgRecentSales =
    sales.length > 0
      ? sales
        .slice(-14)
        .reduce((acc, row) => acc + Number(row.sales), 0) /
      Math.min(14, sales.length)
      : 0;

  const avgForecast =
    forecast?.forecast?.length > 0
      ? forecast.forecast.reduce(
        (acc, row) => acc + Number(row.predicted_sales),
        0
      ) / forecast.forecast.length
      : 0;

  const coverDays = latest
    ? Number(latest.inventory || 0) / Math.max(avgForecast, 1)
    : 0;

  const simulate = async (payload) => {
    setLoading((prev) => ({ ...prev, simulation: true }));
    try {
      const res = await runSimulation(payload);
      setSimulation(res);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err.message ||
        "Simulation failed."
      );
    } finally {
      setLoading((prev) => ({ ...prev, simulation: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <main className="w-full px-6 py-6">
        {/* HEADER */}
        <header className="mb-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">🚀 ProfitPilot AI</h1>
              <p className="text-sm text-slate-300">
                AI-powered retail decision engine for inventory & pricing
              </p>
            </div>

            <div className="flex gap-3">
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="rounded-lg bg-white text-black px-3 py-2"
              >
                {products.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>

              <input
                type="number"
                value={horizonDays}
                onChange={(e) =>
                  setHorizonDays(Number(e.target.value))
                }
                className="w-20 rounded-lg bg-white text-black px-3 py-2"
              />
            </div>
          </div>

          {/* EVENT TAGS */}
          <div className="mt-4 flex gap-2 text-xs">
            <span className="bg-green-500/20 px-2 py-1 rounded">
              📈 Demand ↑12%
            </span>
            <span className="bg-blue-500/20 px-2 py-1 rounded">
              🌦 Weather Impact
            </span>
            <span className="bg-purple-500/20 px-2 py-1 rounded">
              🎉 Festival Spike
            </span>
          </div>
        </header>

        {/* ALERTS */}
        <section className="mb-4">
          <Alerts />
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* KPI */}
        <section className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Current Inventory"
            value={number(latest?.inventory)}
            subtitle={`for ${productId}`}
            tone="info"
          />
          <MetricCard
            label="Avg Sales (14d)"
            value={number(avgRecentSales)}
            subtitle="daily units"
          />
          <MetricCard
            label="Avg Forecast"
            value={number(avgForecast)}
            subtitle={`next ${horizonDays} days`}
          />
          <MetricCard
            label="Inventory Cover"
            value={`${number(coverDays)} days`}
            subtitle="inventory / forecast demand"
            tone={
              coverDays < 7
                ? "critical"
                : coverDays > 30
                  ? "warning"
                  : "good"
            }
          />
        </section>

        {/* MAIN GRID */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesForecastChart data={chartData} />
          </div>

          <div className="space-y-4">
            <RecommendationPanel
              recommendation={recommendation}
              loading={loading.recommendation || loading.page}
            />

            <DecisionHistory />

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">
                Forecast Confidence
              </h3>
              <p className="mt-2 text-sm text-slate-700">
                Model confidence:{" "}
                <span className="font-semibold">
                  {forecast
                    ? pct(forecast.confidence_score)
                    : loading.page
                      ? "Loading..."
                      : "N/A"}
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Feature set:{" "}
                {forecast?.model_features?.join(", ") ||
                  "Not available yet"}
              </p>
            </div>
          </div>
        </section>

        {/* SIMULATOR */}
        <section className="mt-4">
          <ProfitSimulator
            productId={productId}
            horizonDays={horizonDays}
            simulation={simulation}
            loading={loading.simulation}
            onSimulate={simulate}
          />
        </section>

        {/* AI CHAT + INSIGHTS */}
        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <AIChat />

          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-2">📊 Insights Summary</h3>
            <p className="text-sm">
              AI is detecting a rising demand trend. Recommended action improves
              profitability while reducing stockout risk.
            </p>
          </div>
        </section>

        {/* SIMULATION BREAKDOWN */}
        {simulation && (
          <section className="mt-4 rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Simulation Breakdown
            </h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <p>
                  Baseline revenue:{" "}
                  {currency(simulation.baseline.expected_revenue)}
                </p>
                <p>
                  Baseline waste:{" "}
                  {currency(simulation.baseline.expected_waste)}
                </p>
                <p className="font-medium">
                  Baseline profit:{" "}
                  {currency(simulation.baseline.expected_profit)}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-sm">
                <p>
                  Simulated revenue:{" "}
                  {currency(simulation.simulated.expected_revenue)}
                </p>
                <p>
                  Simulated waste:{" "}
                  {currency(simulation.simulated.expected_waste)}
                </p>
                <p className="font-medium">
                  Simulated profit:{" "}
                  {currency(simulation.simulated.expected_profit)}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;