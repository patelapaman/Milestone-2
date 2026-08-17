import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getSectionAnalytics } from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";
import "./SecuritySections.css";

const COLORS = ["#22d3ee", "#f0475d", "#f5a623", "#7c6cf5", "#35d399", "#60a5fa", "#a78bfa", "#fb7185"];

export default function Threats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSectionAnalytics().then(setData);
  }, []);

  if (!data?.threats) return <DashboardLayout pageTitle="Threat Distribution"><div className="loading-state">Loading threat analytics...</div></DashboardLayout>;
  const t = data.threats;

  return (
    <DashboardLayout pageTitle="Threat Distribution">
      <div className="section-page">
        <div className="section-kpis">
          <Kpi label="Security Events" value={t.total_events} />
          <Kpi label="Critical Events" value={t.critical_events} />
          <Kpi label="High Events" value={t.high_events} />
          <Kpi label="Failed Events" value={t.failed_events} />
        </div>

        <div className="section-note">Threat distribution is calculated from the project's security event dataset. Use severity, attack type, protocol and source-country views together to prioritize analyst attention.</div>

        <div className="section-grid">
          <Card title="Threat Distribution by Severity" helper="Share of observed events by severity.">
            <div className="section-chart"><ResponsiveContainer><PieChart><Pie data={t.severity_distribution} dataKey="value" nameKey="name" outerRadius={95} label>{t.severity_distribution.map((x, i) => <Cell key={x.name} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
          </Card>
          <Card title="Attack Types" helper="Most frequently observed event categories.">
            <div className="section-chart"><ResponsiveContainer><BarChart data={t.event_type_distribution} layout="vertical" margin={{ left: 35, right: 12 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="name" width={100} /><Tooltip /><Bar dataKey="value" fill="var(--accent)" radius={[0, 5, 5, 0]} /></BarChart></ResponsiveContainer></div>
          </Card>
          <Card title="Monthly Threat Trend" helper="Event volume over the available time period.">
            <div className="section-chart"><ResponsiveContainer><LineChart data={t.monthly_trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div>
          </Card>
          <Card title="Protocol Mix" helper="Observed network protocols across the filtered event population.">
            <div className="section-chart"><ResponsiveContainer><BarChart data={t.protocol_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="var(--signal-medium)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </Card>
          <Card title="Event Status" helper="Operational outcome of observed security events.">
            <div className="section-chart"><ResponsiveContainer><BarChart data={t.status_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="var(--signal-safe)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </Card>
          <Card title="Analyst Focus" helper="A concise readout generated from the current event telemetry.">
            <div className="insight-stack"><div><span>Most common event</span><strong>{t.top_event_type || "—"}</strong></div><div><span>Critical share</span><strong>{t.total_events ? Math.round((t.critical_events / t.total_events) * 100) : 0}%</strong></div><div><span>Failed-event share</span><strong>{t.total_events ? Math.round((t.failed_events / t.total_events) * 100) : 0}%</strong></div></div>
          </Card>
          <Card title="Top Source Countries" helper="Countries contributing the most observed source events." wide>
            <div className="section-table-wrap"><table className="section-table"><thead><tr><th>Rank</th><th>Source country</th><th>Events</th></tr></thead><tbody>{t.source_country_distribution.map((x, i) => <tr key={x.name}><td>{i + 1}</td><td>{x.name}</td><td>{x.value}</td></tr>)}</tbody></table></div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Kpi({ label, value }) { return <div className="section-kpi"><div className="section-kpi-label">{label}</div><div className="section-kpi-value">{value}</div></div>; }
function Card({ title, helper, children, wide }) { return <section className={`section-card ${wide ? "wide" : ""}`}><h3>{title}</h3><p className="helper">{helper}</p>{children}</section>; }
