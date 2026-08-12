import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, RefreshCw, Zap, Gauge } from "lucide-react";
import { getHealth, getPerformance, getPredictions, getSummary } from "../services/api";
import StatCard from "../components/StatCard";
import ThreatTable from "../components/ThreatTable";
import { AnomalyChart, ThreatTypeChart, TrendChart } from "../charts/Charts";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [pred, setPred] = useState([]);
  const [summary, setSummary] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [health, setHealth] = useState(null);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const [p, s, perf, h] = await Promise.all([
        getPredictions(), getSummary(), getPerformance(), getHealth(),
      ]);
      setPred(p.data);
      setSummary(s.data);
      setPerformance(perf.data);
      setHealth(h.data);
      setError("");
    } catch (e) {
      setError(e?.response?.data?.detail || e.message || "Unable to reach the API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => pred.filter((x) =>
      (!severity || x.severity === severity) &&
      (!search || JSON.stringify(x).toLowerCase().includes(search.toLowerCase()))
    ),
    [pred, search, severity]
  );

  const distribution = [
    { name: "Normal", value: summary?.prediction_distribution?.Normal || 0 },
    { name: "Suspicious", value: summary?.prediction_distribution?.Suspicious || 0 },
    { name: "Critical", value: summary?.kpis?.critical_threats || 0 },
  ];
  const types = Object.entries(summary?.threat_types || {})
    .filter(([name]) => name !== "Normal")
    .map(([name, value]) => ({ name, value }));
  const trend = pred.slice().reverse().map((x, i) => ({
    label: `#${i + 1}`,
    anomalies: x.prediction === "Normal" ? 0 : 1,
  }));

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><BrainCircuit /></div>
          <div><b>Sentinel<span>AI</span></b><small>Milestone 2 · Threat Detection</small></div>
        </div>
        <button className="ghost-btn" onClick={load}><RefreshCw size={16} /> Refresh</button>
      </header>

      <main className="main">
        <section className="hero">
          <div>
            <div className="eyebrow"><Zap size={15} /> AI SECURITY OPERATIONS</div>
            <h1>Threat Detection <span>Dashboard</span></h1>
            <p>Isolation Forest anomaly detection with explainable security rules.</p>
          </div>
          <div className="status"><i /> {health?.status === "ok" ? "Engine online" : "Checking engine"}</div>
        </section>

        {error && <div className="error">{error} — Make sure FastAPI is running on port 8000.</div>}

        {loading ? <div className="loading">Loading threat intelligence…</div> : (
          <>
            <section className="stats">
              <StatCard title="Total Events" value={summary?.kpis.total_events || 0} icon="Activity" />
              <StatCard title="Anomalies Detected" value={summary?.kpis.anomalies_detected || 0} icon="AlertTriangle" tone="warn" />
              <StatCard title="Normal Events" value={summary?.kpis.normal_events || 0} icon="ShieldCheck" tone="good" />
              <StatCard title="High-Risk Events" value={summary?.kpis.high_risk_events || 0} icon="Siren" tone="danger" />
              <StatCard title="Critical Threats" value={summary?.kpis.critical_threats || 0} icon="ShieldAlert" tone="critical" />
            </section>

            <section className="charts-grid">
              <AnomalyChart data={distribution} />
              <ThreatTypeChart data={types} />
              <TrendChart data={trend} />
            </section>

            <section className="model-strip panel">
              <div><Gauge size={18} /><div><b>Isolation Forest · {health?.model_version || "IF_v1"}</b><span>300 estimators · hybrid rule engine · detection confidence, not attack probability</span></div></div>
              <div className="model-metrics">
                {performance?.available ? (
                  <><span>Precision <b>{Math.round(performance.precision * 100)}%</b></span><span>Recall <b>{Math.round(performance.recall * 100)}%</b></span><span>F1 <b>{Math.round(performance.f1 * 100)}%</b></span></>
                ) : <span>Evaluation: <b>Unsupervised / no reliable labels</b></span>}
              </div>
            </section>

            <ThreatTable
              data={filtered}
              onSelect={(id) => nav(`/events/${id}`)}
              search={search}
              setSearch={setSearch}
              severity={severity}
              setSeverity={setSeverity}
            />
          </>
        )}
      </main>
    </div>
  );
}
