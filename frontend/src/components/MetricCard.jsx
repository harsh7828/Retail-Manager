const MetricCard = ({ label, value, tone = "neutral", subtitle }) => {
  const toneClassMap = {
    neutral: "bg-white",
    good: "bg-gradient-to-r from-emerald-100 to-emerald-50",
    warning: "bg-gradient-to-r from-amber-100 to-amber-50",
    critical: "bg-gradient-to-r from-red-100 to-red-50",
    info: "bg-gradient-to-r from-blue-100 to-blue-50",
  };

  return (
    <div className={`rounded-2xl p-5 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ${toneClassMap[tone]}`}>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-600">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;