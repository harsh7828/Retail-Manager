import { useState } from "react";
import { currency } from "../utils/formatters";

const ProfitSimulator = ({ productId, horizonDays, onSimulate, simulation, loading }) => {
  const [discountPct, setDiscountPct] = useState(15);
  const [timeDelayDays, setTimeDelayDays] = useState(2);

  const submit = (event) => {
    event.preventDefault();
    onSimulate({ product_id: productId, discount_pct: discountPct, time_delay_days: timeDelayDays, horizon_days: horizonDays });
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h3 className="text-base font-semibold text-slate-900">Profit Simulator</h3>
      <p className="mb-3 text-xs text-slate-500">Test discount and timing before applying strategy</p>

      <form onSubmit={submit} className="grid gap-3 md:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block text-slate-600">Discount %</span>
          <input
            type="number"
            min={0}
            max={80}
            value={discountPct}
            onChange={(e) => setDiscountPct(Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-slate-600">Time Delay (days)</span>
          <input
            type="number"
            min={0}
            max={30}
            value={timeDelayDays}
            onChange={(e) => setTimeDelayDays(Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-3 py-2 text-white font-semibold hover:bg-blue-700"
          >
            {loading ? "Simulating..." : "Run Simulation"}
          </button>
        </div>
      </form>

      {simulation ? (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs uppercase text-slate-500">Baseline Profit</p>
            <p className="mt-1 text-lg font-semibold">{currency(simulation.baseline.expected_profit)}</p>
          </div>
          <div className="rounded-lg bg-brand-50 p-3">
            <p className="text-xs uppercase text-slate-500">Simulated Profit</p>
            <p className="mt-1 text-lg font-semibold">{currency(simulation.simulated.expected_profit)}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3">
            <p className="text-xs uppercase text-slate-500">Profit Difference</p>
            <p className="mt-1 text-lg font-semibold">{currency(simulation.profit_difference)}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProfitSimulator;
