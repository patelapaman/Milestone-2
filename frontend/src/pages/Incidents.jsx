import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getSectionAnalytics } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import "./SecuritySections.css";

const COLORS = ["#35d399", "#f0475d", "#f5a623", "#22d3ee", "#7c6cf5"];

export default function Incidents() {
  const [data, setData] = useState(null);
  useEffect(() => { getSectionAnalytics().then(setData); }, []);
  if (!data?.incidents) return <DashboardLayout pageTitle="Incidents"><div className="loading-state">Loading incident analytics...</div></DashboardLayout>;
  const i = data.incidents;

  return <DashboardLayout pageTitle="Incidents"><div className="section-page">
    <div className="section-kpis">
      <Kpi label="Total Incidents" value={i.total} />
      <Kpi label="Open" value={i.open} />
      <Kpi label="Closed" value={i.closed} />
      <Kpi label="Avg Response (min)" value={i.average_response_minutes} />
    </div>
    <div className="section-note">Incident metrics are based on the incident history register. Response-time averages use records with a numeric minute value; no synthetic incident records are added.</div>
    <div className="section-grid">
      <Card title="Incident Status" helper="Current status of recorded incidents."><div className="section-chart"><ResponsiveContainer><PieChart><Pie data={i.status_distribution} dataKey="value" nameKey="name" outerRadius={95} label>{i.status_distribution.map((x, n) => <Cell key={x.name} fill={COLORS[n % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></Card>
      <Card title="Incident Types" helper="Recorded incident categories."><div className="section-chart"><ResponsiveContainer><BarChart data={i.type_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="var(--signal-critical)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="Response Ownership" helper="How recorded incidents are assigned to teams or analysts."><div className="section-chart"><ResponsiveContainer><BarChart data={i.assigned_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="var(--accent)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="Resolution Outcomes" helper="Resolution values captured in the incident register."><div className="section-chart"><ResponsiveContainer><BarChart data={i.resolution_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="var(--signal-safe)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="Response Time" helper="Recorded response time in minutes for each incident."><div className="section-chart"><ResponsiveContainer><BarChart data={i.response_records}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="var(--accent)" radius={[5,5,0,0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="Incident Register" helper="Recorded incident history, ownership, response and resolution details." wide><div className="section-table-wrap"><table className="section-table"><thead><tr><th>ID</th><th>Event</th><th>Type</th><th>Assigned To</th><th>Status</th><th>Response</th><th>Resolution</th></tr></thead><tbody>{i.records.map((x) => <tr key={x.incident_id}><td>{x.incident_id}</td><td>{x.event_id}</td><td>{x.incident_type}</td><td>{x.assigned_to}</td><td><span className="section-badge">{x.status}</span></td><td>{x.response_time}</td><td>{x.resolution}</td></tr>)}</tbody></table></div></Card>
    </div>
  </div></DashboardLayout>;
}
function Kpi({ label, value }) { return <div className="section-kpi"><div className="section-kpi-label">{label}</div><div className="section-kpi-value">{value}</div></div>; }
function Card({ title, helper, children, wide }) { return <section className={`section-card ${wide ? "wide" : ""}`}><h3>{title}</h3><p className="helper">{helper}</p>{children}</section>; }
