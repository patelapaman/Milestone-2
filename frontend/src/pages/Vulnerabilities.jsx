import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getSectionAnalytics } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import "./SecuritySections.css";

const COLORS = ["#f0475d", "#f5a623", "#7c6cf5", "#35d399", "#22d3ee"];

export default function Vulnerabilities() {
  const [data, setData] = useState(null);
  useEffect(() => { getSectionAnalytics().then(setData); }, []);
  if (!data?.vulnerabilities) return <DashboardLayout pageTitle="Vulnerabilities"><div className="loading-state">Loading vulnerability analytics...</div></DashboardLayout>;
  const v = data.vulnerabilities;

  return <DashboardLayout pageTitle="Vulnerabilities"><div className="section-page">
    <div className="section-kpis">
      <Kpi label="Tracked Vulnerabilities" value={v.total} />
      <Kpi label="Open" value={v.open} />
      <Kpi label="Critical" value={v.critical} />
      <Kpi label="Average CVSS" value={v.average_cvss} />
    </div>
    <div className="section-note">The page combines the tracked vulnerability register with observed CVE references found in security events. Observed CVEs are shown separately so they are not mistaken for confirmed vulnerability records.</div>
    <div className="section-grid">
      <Card title="Severity Distribution" helper="Severity of confirmed vulnerability records."><div className="section-chart"><ResponsiveContainer><PieChart><Pie data={v.severity_distribution} dataKey="value" nameKey="name" outerRadius={95} label>{v.severity_distribution.map((x, i) => <Cell key={x.name} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></Card>
      <Card title="Status Distribution" helper="Current remediation state of tracked vulnerabilities."><div className="section-chart"><ResponsiveContainer><BarChart data={v.status_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="var(--signal-high)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="Affected Assets" helper="Assets with the highest number of tracked vulnerability records."><div className="section-chart"><ResponsiveContainer><BarChart data={v.affected_assets} layout="vertical" margin={{ left: 40, right: 12 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" allowDecimals={false} /><YAxis type="category" dataKey="name" width={110} /><Tooltip /><Bar dataKey="value" fill="var(--accent)" radius={[0, 5, 5, 0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="Observed CVEs in Security Events" helper="CVE references observed in event telemetry; these are not automatically promoted to confirmed vulnerabilities."><div className="section-chart"><ResponsiveContainer><BarChart data={v.observed_cves}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" angle={-25} textAnchor="end" height={70} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="var(--signal-medium)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="CVSS by Affected Asset" helper="Highest CVSS score represented by each tracked vulnerability record."><div className="section-chart"><ResponsiveContainer><BarChart data={v.cvss_by_asset} layout="vertical" margin={{ left: 45, right: 12 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" domain={[0,10]} /><YAxis type="category" dataKey="name" width={110} /><Tooltip /><Bar dataKey="value" fill="var(--signal-critical)" radius={[0,5,5,0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="Patch Availability" helper="Whether a remediation patch is recorded for tracked vulnerabilities."><div className="section-chart"><ResponsiveContainer><BarChart data={v.patch_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="var(--signal-safe)" radius={[5,5,0,0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card title="Vulnerability Register" helper="Tracked vulnerability records and remediation fields." wide><div className="section-table-wrap"><table className="section-table"><thead><tr><th>ID</th><th>CVE</th><th>Name</th><th>Severity</th><th>CVSS</th><th>Asset</th><th>Patch</th><th>Status</th></tr></thead><tbody>{v.records.map((x) => <tr key={x.vulnerability_id}><td>{x.vulnerability_id}</td><td>{x.cve_id}</td><td>{x.vulnerability_name}</td><td><span className="section-badge">{x.severity}</span></td><td>{x.cvss_score}</td><td>{x.affected_asset}</td><td>{x.patch_available}</td><td>{x.status}</td></tr>)}</tbody></table></div></Card>
    </div>
  </div></DashboardLayout>;
}
function Kpi({ label, value }) { return <div className="section-kpi"><div className="section-kpi-label">{label}</div><div className="section-kpi-value">{value}</div></div>; }
function Card({ title, helper, children, wide }) { return <section className={`section-card ${wide ? "wide" : ""}`}><h3>{title}</h3><p className="helper">{helper}</p>{children}</section>; }
