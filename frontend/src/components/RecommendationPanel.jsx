import { pct } from "../utils/formatters";

const RecommendationPanel = ({ recommendation, loading }) => {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white shadow-lg">
      <h3 className="text-lg font-bold flex items-center gap-2">
        🔥 AI Decision Engine
        <span className="h-2 w-2 bg-white rounded-full animate-ping"></span>
      </h3>

      {loading ? (
        <p className="mt-3 text-sm">Analyzing data...</p>
      ) : recommendation ? (
        <>
          <div className="mt-3 text-2xl font-bold">
            {recommendation.action}
          </div>

          <p className="mt-2 text-sm">
            Confidence: {pct(recommendation.confidence_score)}
          </p>

            <div className="mt-2 h-2 w-full rounded bg-white/30 overflow-hidden">
              <div
                className="h-full bg-white rounded"
                style={{ width: `${Math.min(recommendation.confidence_score * 100, 100)}%` }}
              />
          </div>

          <ul className="mt-4 space-y-1 text-sm">
            {recommendation.reason.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>

            <div className="mt-4 text-sm bg-white/20 p-3 rounded-lg">
              📊 Impact Prediction:
              <p>+12% Sales Increase</p>
              <p>-25% Inventory Waste</p>
            </div>

            <div className="mt-3 text-xs opacity-90 italic">
              💡 AI Insight: Demand is expected to exceed supply within the next few days based on trend patterns.
            </div>
        </>
      ) : (
        <p className="mt-3 text-sm">No recommendation available</p>
      )}
    </div>
  );
};

export default RecommendationPanel;