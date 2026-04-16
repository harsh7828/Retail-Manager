import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dayLabel, number } from "../utils/formatters";

const SalesForecastChart = ({ data }) => {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-lg">
      <h3 className="text-base font-semibold text-slate-900">Sales History vs Demand Forecast</h3>
      <p className="mb-3 text-xs text-slate-500">Actual and predicted daily units sold</p>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tickFormatter={dayLabel} tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => number(v)} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, name) => [number(value), name === "sales" ? "Actual sales" : "Forecast sales"]}
              labelFormatter={(value) => dayLabel(value)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              name="Actual Sales"
              stroke="#0f172a"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="predicted_sales"
              name="Forecast Sales"
              stroke="#1b86f8"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesForecastChart;
