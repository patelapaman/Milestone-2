import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  getHealth,
  getPerformance,
  getPredictions,
  getPrediction,
  getSummary,
  predictEvent,
} from "../milestone2/services.js";

const Milestone2Context = createContext(null);

function getErrorMessage(error, fallback = "Unable to reach the AI detection API.") {
  const detail = error?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((x) => x?.msg || x?.message || String(x)).join(", ");
  return detail || error?.response?.data?.error || error?.message || fallback;
}

export function Milestone2Provider({ children }) {
  const [predictions, setPredictions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (params = {}) => {
    setLoading(true); setError("");
    try {
      const [p, s, perf, h] = await Promise.all([
        getPredictions(params), getSummary(), getPerformance(), getHealth(),
      ]);
      const next = Array.isArray(p?.data) ? p.data : [];
      setPredictions(next); setSummary(s?.data || null); setPerformance(perf?.data || null); setHealth(h?.data || null);
      return { predictions: next, summary: s?.data || null, performance: perf?.data || null, health: h?.data || null };
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally { setLoading(false); }
  }, []);

  const refresh = useCallback(() => loadDashboard(), [loadDashboard]);

  const fetchPrediction = useCallback(async (id) => {
    try { return (await getPrediction(id))?.data || null; }
    catch (err) { throw new Error(getErrorMessage(err, "Unable to load the prediction.")); }
  }, []);

  const runPrediction = useCallback(async (event) => {
    try { return (await predictEvent(event))?.data || null; }
    catch (err) { throw new Error(getErrorMessage(err, "Prediction failed.")); }
  }, []);

  const value = useMemo(() => ({
    predictions, summary, performance, health, loading, error,
    loadDashboard, refresh, fetchPrediction, runPrediction,
  }), [predictions, summary, performance, health, loading, error, loadDashboard, refresh, fetchPrediction, runPrediction]);

  return <Milestone2Context.Provider value={value}>{children}</Milestone2Context.Provider>;
}

export function useMilestone2() {
  const context = useContext(Milestone2Context);
  if (!context) throw new Error("useMilestone2 must be used inside Milestone2Provider");
  return context;
}
