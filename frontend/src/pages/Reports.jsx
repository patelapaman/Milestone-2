import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getSectionAnalytics } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import "./SecuritySections.css";

export default function Reports() {
  const [data, setData] = useState(null);
  useEffect(() => { getSectionAnalytics().then(setData); }, []);

  const downloadReport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data.report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "security-executive-report.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => window.print();

  if (!data?.report) return <DashboardLayout pageTitle="Reports"><div className="loading-state">Generating security report...</div></DashboardLayout>;
  const r = data.report;
  const v = data.vulnerabilities;
  const i = data.incidents;

  return <DashboardLayout pageTitle="Reports"><div className="section-page">
    <div className="section-kpis">
      <Kpi label="Security Events" value={r.executive_summary.security_events} />
      <Kpi label="Critical Events" value={r.executive_summary.critical_events} />
      <Kpi label="Open Vulnerabilities" value={r.executive_summary.open_vulnerabilities} />
      <Kpi label="Open Incidents" value={r.executive_summary.open_incidents} />
    </div>

    <section className="section-card">
      <h3>Executive Security Report</h3>
      <p className="helper">A concise management view generated from the current local security datasets.</p>
      <div className="report-actions"><button className="report-button" onClick={downloadReport}>Download JSON Report</button><button className="report-button" onClick={printReport}>Print / Save as PDF</button></div>
    </section>

    <div className="section-grid">
      <Card title="Threat Severity Snapshot" helper="Current event severity distribution."><div className="section-chart"><ResponsiveContainer><BarChart data={data.threats.severity_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="var(--signal-critical)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="Vulnerability Posture" helper="Open/closed posture of tracked vulnerabilities."><div className="section-chart"><ResponsiveContainer><BarChart data={v.status_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="var(--signal-high)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="Threat Activity Trend" helper="Monthly security-event volume from the same telemetry used across the dashboard."><div className="section-chart"><ResponsiveContainer><LineChart data={data.threats.monthly_trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div></Card>
      <Card title="Incident Response" helper="Recorded incident response time in minutes."><div className="section-chart"><ResponsiveContainer><BarChart data={i.response_records}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="var(--signal-safe)" radius={[5,5,0,0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="Priority Actions" helper="Recommended operational follow-ups based on the current evidence."><ul className="report-list">{r.priority_actions.map((action) => <li key={action}>{action}</li>)}</ul></Card>
      <Card title="Report Coverage" helper="What the report currently includes."><ul className="report-list"><li>{r.executive_summary.security_events} security events</li><li>{v.total} tracked vulnerabilities</li><li>{i.total} recorded incidents</li><li>Threat severity, attack type, protocol and country analysis</li><li>Vulnerability severity, status, CVSS and asset analysis</li><li>Incident status, ownership, response and resolution analysis</li><li>Monthly threat activity and remediation posture</li></ul></Card>
    </div>
    <div className="section-note"><strong>Executive interpretation:</strong> The current telemetry contains {r.executive_summary.security_events.toLocaleString()} events, with {r.executive_summary.critical_events.toLocaleString()} critical events. The most common event type is <strong>{r.executive_summary.top_event_type}</strong> and the tracked vulnerability register has an average CVSS of <strong>{r.executive_summary.average_cvss}</strong>.<br /><br />Report data is generated from the project's current datasets. It does not claim external threat-intelligence facts and does not invent missing incident or vulnerability records.</div>
  </div></DashboardLayout>;
}
function Kpi({ label, value }) { return <div className="section-kpi"><div className="section-kpi-label">{label}</div><div className="section-kpi-value">{value}</div></div>; }
function Card({ title, helper, children }) { return <section className="section-card"><h3>{title}</h3><p className="helper">{helper}</p>{children}</section>; }
