import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { predictEvent } from "../services/api";

const numericFields = new Set([
  "failed_login_attempts", "login_frequency", "login_hour", "connection_frequency",
  "unique_destination_count", "events_per_user", "unique_ip_count", "after_hours_activity",
  "cvss_score", "vulnerability_count", "severity_score", "malware_detected",
  "event_frequency", "impossible_travel_flag",
]);

const initialForm = {
  event_id: `EVT-LIVE-${Date.now().toString().slice(-5)}`,
  event_type: "Brute Force", failed_login_attempts: 18, login_frequency: 36, login_hour: 2,
  connection_frequency: 18, unique_destination_count: 4, protocol: "TCP", events_per_user: 26,
  unique_ip_count: 5, after_hours_activity: 1, cvss_score: 8.9, vulnerability_count: 2,
  severity_score: 8.5, malware_detected: 0, event_frequency: 31, source_country: "India",
  destination_country: "USA", impossible_travel_flag: 1, source_ip: "10.0.0.23",
  destination_ip: "198.51.100.10", user: "demo-user", asset: "Auth-Server-01",
};

export default function LivePrediction() {
  const nav = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [
        key, numericFields.has(key) ? Number(value) : value,
      ]));
      const response = await predictEvent(payload);
      setResult(response.data);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Prediction failed.");
    } finally { setBusy(false); }
  };

  return (
    <div className="app-shell">
      <header className="topbar"><button className="ghost-btn" onClick={() => nav("/")}><ArrowLeft size={16} /> Dashboard</button><div className="brand compact">Live Prediction</div></header>
      <main className="main narrow">
        <section className="hero"><div><div className="eyebrow">REAL-TIME DETECTION</div><h1>Run a <span>Live Prediction</span></h1><p>Submit a processed security event to the Isolation Forest + rules engine.</p></div></section>
        {error && <div className="error">{error}</div>}
        <form className="panel live-form" onSubmit={submit}>
          <div className="form-grid">
            {Object.entries(form).map(([key, value]) => (
              <label key={key}><span>{key.replaceAll("_", " ")}</span><input type={numericFields.has(key) ? "number" : "text"} step="any" min={numericFields.has(key) ? "0" : undefined} value={value} disabled={key === "event_id"} onChange={(e) => setForm((old) => ({ ...old, [key]: e.target.value }))} required /></label>
            ))}
          </div>
          <button className="primary" type="submit" disabled={busy}>{busy ? <><Loader2 size={16} className="spin" /> Analyzing…</> : "Analyze Event"}</button>
          {result && <div className="result-box"><b>{result.prediction}</b><span>{result.severity} · {result.confidence_score}% confidence · {result.threat_type}</span><div>{result.reasons.map((reason) => <p key={reason}>• {reason}</p>)}</div></div>}
        </form>
      </main>
    </div>
  );
}
