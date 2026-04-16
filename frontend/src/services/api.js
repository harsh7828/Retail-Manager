import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 10000,
});

export const fetchSales = async (productId) => {
  const { data } = await api.get("/sales", { params: { product_id: productId, limit: 180 } });
  return data;
};

export const fetchProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const fetchForecast = async (productId, horizonDays = 14) => {
  const { data } = await api.get("/forecast", { params: { product_id: productId, horizon_days: horizonDays } });
  return data;
};

export const fetchRecommendation = async (productId, horizonDays = 14) => {
  const { data } = await api.get("/recommendation", { params: { product_id: productId, horizon_days: horizonDays } });
  return data;
};

export const runSimulation = async (payload) => {
  const { data } = await api.post("/simulate", payload);
  return data;
};
