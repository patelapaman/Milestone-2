import axios from "axios";

const baseURL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api").replace(/\/+$/, "");

export const milestone2Api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

milestone2Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = "Cannot reach the Flask backend. Make sure it is running on http://127.0.0.1:5000.";
    }
    return Promise.reject(error);
  }
);

export const getPredictions = (params = {}) => milestone2Api.get("/milestone2/predictions", { params });
export const getPrediction = (id) => milestone2Api.get(`/milestone2/predictions/${encodeURIComponent(String(id))}`);
export const getSummary = () => milestone2Api.get("/milestone2/threat-summary");
export const getPerformance = () => milestone2Api.get("/milestone2/model-performance");
export const getHealth = () => milestone2Api.get("/milestone2/health");
export const predictEvent = (event) => milestone2Api.post("/milestone2/predict", event);
