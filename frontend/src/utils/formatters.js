export const currency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number(value || 0),
  );

export const number = (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(Number(value || 0));

export const pct = (value) => `${Number(value || 0).toFixed(1)}%`;

export const dayLabel = (isoDate) =>
  new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
