import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000",
  timeout: 10000,
});

export const getPredictions = (params = {}) => api.get("/predictions", { params });
export const getPrediction = (id) => api.get(`/predictions/${encodeURIComponent(id)}`);
export const getSummary = () => api.get("/threat-summary");
export const getPerformance = () => api.get("/model-performance");
export const getHealth = () => api.get("/health");
export const predictEvent = (event) => api.post("/predict", event);
