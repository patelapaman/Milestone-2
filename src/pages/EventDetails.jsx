import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getPrediction } from "../services/api";
import ConfidenceCard from "../components/ConfidenceCard";

export default function EventDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPrediction(id)
      .then((r) => setEvent(r.data))
      .catch((e) => setError(e?.response?.data?.detail || e.message));
  }, [id]);

  if (error) return <div className="center"><div className="error">{error}</div><button className="primary" onClick={() => nav("/")}>Back to Dashboard</button></div>;
  if (!event) return <div className="center">Loading investigation…</div>;

  const e = event.event || {};
  const details = [
    ["Source IP", e.source_ip], ["Destination IP", e.destination_ip], ["User", e.user],
    ["Event Type", e.event_type], ["Asset", e.asset], ["Timestamp", e.timestamp ? new Date(e.timestamp).toLocaleString() : "—"],
    ["CVSS", e.cvss_score], ["Protocol", e.protocol], ["Source Country", e.source_country],
    ["Destination Country", e.destination_country], ["Failed Logins", e.failed_login_attempts],
    ["Event Frequency", e.event_frequency], ["Impossible Travel", e.impossible_travel_flag ? "Detected" : "No"],
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="ghost-btn" onClick={() => nav("/")}><ArrowLeft size={16} /> Back to dashboard</button>
        <div className="brand compact"><div className="brand-mark"><AlertTriangle /></div><b>Event Investigation</b></div>
      </header>
      <main className="main">
        <section className="hero">
          <div><div className="eyebrow">EVENT INVESTIGATION</div><h1>{event.event_id}</h1><p>{e.event_type} · {new Date(event.prediction_timestamp).toLocaleString()}</p></div>
          <span className={`severity large ${event.severity.replaceAll(" ", "-").toLowerCase()}`}>{event.severity}</span>
        </section>
        <section className="details-grid">
          <div className="panel"><h2>Event Details</h2><div className="detail-grid">
            {details.map(([key, value]) => <div className="detail" key={key}><span>{key}</span><b>{String(value ?? "—")}</b></div>)}
          </div></div>
          <div className="panel analysis-panel">
            <h2>AI Analysis</h2>
            <div className="prediction-banner">
              <div className={event.prediction === "Normal" ? "normal-icon" : "danger-icon"}>{event.prediction === "Normal" ? <CheckCircle2 /> : <AlertTriangle />}</div>
              <div><span>Prediction</span><strong>{event.prediction}</strong><small>{event.threat_type}</small></div>
            </div>
            <ConfidenceCard value={event.confidence_score} />
            <div className="reasons"><h3>Why was it detected?</h3>
              {event.reasons.map((reason, i) => <div key={`${event.event_id}-reason-${i}`}><span>{i + 1}</span>{reason}</div>)}
            </div>
            <div className="score-line"><span>Anomaly score</span><b>{event.anomaly_score}</b></div>
          </div>
        </section>
      </main>
    </div>
  );
}
