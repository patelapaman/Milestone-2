import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useMilestone2 } from "../context/Milestone2Context";
import ConfidenceCard from "./components/ConfidenceCard";

export default function EventDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const { fetchPrediction } = useMilestone2();

  useEffect(() => {
    let active = true;
    setEvent(null); setError("");
    fetchPrediction(id)
      .then((data) => { if (active) setEvent(data); })
      .catch((e) => { if (active) setError(e?.message || "Unable to load the prediction."); });
    return () => { active = false; };
  }, [id, fetchPrediction]);

  if (error) return <div className="m2-center"><div className="m2-error">{error}</div><button className="m2-primary" onClick={() => nav("/dashboard/ai-detection")}>Back to Dashboard</button></div>;
  if (!event) return <div className="m2-center">Loading investigation…</div>;

  const e = event.event || {};
  const details = [
    ["Source IP", e.source_ip], ["Destination IP", e.destination_ip], ["User", e.user],
    ["Event Type", e.event_type], ["Asset", e.asset], ["Timestamp", e.timestamp ? new Date(e.timestamp).toLocaleString() : "—"],
    ["CVSS", e.cvss_score], ["Protocol", e.protocol], ["Source Country", e.source_country],
    ["Destination Country", e.destination_country], ["Failed Logins", e.failed_login_attempts],
    ["Event Frequency", e.event_frequency], ["Impossible Travel", e.impossible_travel_flag ? "Detected" : "No"],
  ];

  return (
    <div className="m2-page"><div className="m2-app-shell">
      <header className="m2-topbar">
        <button className="m2-ghost-btn" onClick={() => nav("/dashboard/ai-detection")}><ArrowLeft size={16} /> Back to dashboard</button>
        <div className="m2-brand m2-compact"><div className="m2-brand-mark"><AlertTriangle /></div><b>Event Investigation</b></div>
      </header>
      <main className="m2-main">
        <section className="m2-hero">
          <div><div className="m2-eyebrow">EVENT INVESTIGATION</div><h1>{event.event_id}</h1><p>{e.event_type} · {new Date(event.prediction_timestamp).toLocaleString()}</p></div>
          <span className={`m2-severity m2-large m2-${event.severity.replaceAll(" ", "-").toLowerCase()}`}>{event.severity}</span>
        </section>
        <section className="m2-details-grid">
          <div className="m2-panel"><h2>Event Details</h2><div className="m2-detail-grid">
            {details.map(([key, value]) => <div className="m2-detail" key={key}><span>{key}</span><b>{String(value ?? "—")}</b></div>)}
          </div></div>
          <div className="m2-panel m2-analysis-panel">
            <h2>AI Analysis</h2>
            <div className="m2-prediction-banner">
              <div className={event.prediction === "Normal" ? "m2-normal-icon" : "m2-danger-icon"}>{event.prediction === "Normal" ? <CheckCircle2 /> : <AlertTriangle />}</div>
              <div><span>Prediction</span><strong>{event.prediction}</strong><small>{event.threat_type}</small></div>
            </div>
            <ConfidenceCard value={event.confidence_score} />
            <div className="m2-reasons"><h3>Why was it detected?</h3>
              {(event.reasons || []).map((reason, i) => <div key={`${event.event_id}-reason-${i}`}><span>{i + 1}</span>{reason}</div>)}
            </div>
            <div className="m2-score-line"><span>Anomaly score</span><b>{event.anomaly_score}</b></div>
          </div>
        </section>
      </main>
    </div></div>
  );
}
