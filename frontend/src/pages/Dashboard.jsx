import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ShieldAlert, TriangleAlert, Bug, Siren,
  Search, X, SlidersHorizontal, RotateCcw
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PieChartComponent from "../components/layout/PieChart";
import LineChartComponent from "../components/layout/LineChart";
import BarChartComponent from "../components/layout/BarChart";
import SecurityEventsTable from "../components/SecurityEventsTable";
import { getEvents } from "../services/api";
import "./Dashboard.css";

const MONTHS = [
  ["01", "January"], ["02", "February"], ["03", "March"], ["04", "April"],
  ["05", "May"], ["06", "June"], ["07", "July"], ["08", "August"],
  ["09", "September"], ["10", "October"], ["11", "November"], ["12", "December"],
];

const SEVERITIES = ["Critical", "High", "Medium", "Low"];

function clean(value) {
  return String(value ?? "").trim();
}

function eventDateParts(timestamp) {
  const raw = clean(timestamp);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? { year: match[1], month: match[2], date: `${match[1]}-${match[2]}-${match[3]}` } : null;
}

export default function Dashboard({ searchQuery = "" }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: "",
    eventType: "",
    calendarMode: "all",
    date: "",
    month: "",
    year: "",
    ip: "",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getEvents();
        if (mounted) setEvents(Array.isArray(data) ? data : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const eventTypes = useMemo(
    () => [...new Set(events.map((e) => clean(e.event_type)).filter(Boolean))].sort(),
    [events]
  );

  const years = useMemo(
    () => [...new Set(events.map((e) => eventDateParts(e.timestamp)?.year).filter(Boolean))].sort().reverse(),
    [events]
  );

  const severityCounts = useMemo(() => Object.fromEntries(
    SEVERITIES.map((severity) => [severity, events.filter((e) => e.severity === severity).length])
  ), [events]);

  const filteredEvents = useMemo(() => {
    const query = clean(searchQuery).toLowerCase();
    const ipQuery = clean(filters.ip).toLowerCase();

    return events.filter((event) => {
      const parts = eventDateParts(event.timestamp);
      const severityMatch = !filters.severity || event.severity === filters.severity;
      const eventTypeMatch = !filters.eventType || event.event_type === filters.eventType;

      let calendarMatch = true;
      if (filters.calendarMode === "date") {
        calendarMatch = !!parts && parts.date === filters.date;
      } else if (filters.calendarMode === "month") {
        calendarMatch = !!parts && parts.month === filters.month && (!filters.year || parts.year === filters.year);
      } else if (filters.calendarMode === "year") {
        calendarMatch = !!parts && parts.year === filters.year;
      }

      const sourceIp = clean(event.source_ip).toLowerCase();
      const destinationIp = clean(event.destination_ip).toLowerCase();
      const ipMatch = !ipQuery || sourceIp.includes(ipQuery) || destinationIp.includes(ipQuery);

      const globalSearchMatch =
        !query || Object.values(event).join(" ").toLowerCase().includes(query);

      return severityMatch && eventTypeMatch && calendarMatch && ipMatch && globalSearchMatch;
    });
  }, [events, filters, searchQuery]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const clearFilters = () => setFilters({
    severity: "", eventType: "", calendarMode: "all",
    date: "", month: "", year: "", ip: "",
  });

  const calendarLabel = filters.calendarMode === "date"
    ? filters.date || "Choose a date"
    : filters.calendarMode === "month"
      ? `${MONTHS.find(([id]) => id === filters.month)?.[1] || "Choose month"} ${filters.year || ""}`.trim()
      : filters.calendarMode === "year"
        ? filters.year || "Choose year"
        : "All dates";

  const totalEvents = filteredEvents.length;
  const criticalThreats = filteredEvents.filter((e) => e.severity === "Critical").length;
  const highSeverityAlerts = filteredEvents.filter((e) => e.severity === "High").length;
  const vulnerabilities = filteredEvents.filter((e) => clean(e.vulnerability_id)).length;
  const activeIncidents = filteredEvents.filter((e) => ["Open", "Investigating", "Active"].includes(clean(e.event_status))).length;

  return (
    <DashboardLayout pageTitle="Overview">
      <div className="overview-page">
        <section className="overview-hero">
          <div>
            <span className="overview-eyebrow">SECURITY OPERATIONS CENTER</span>
            <h2>Live threat overview</h2>
            <p>Filter the shared security-event dataset by severity, event type, time period or IP address.</p>
          </div>
          <div className="overview-data-status">
            <span className="status-dot" />
            {loading ? "Loading telemetry…" : `${events.length.toLocaleString()} events loaded`}
          </div>
        </section>

        <section className="overview-filter-panel">
          <div className="filter-panel-heading">
            <div>
              <strong><SlidersHorizontal size={16} /> Investigation filters</strong>
              <span>{filteredEvents.length.toLocaleString()} matching events · {calendarLabel}</span>
            </div>
            <button className="clear-filters-btn" onClick={clearFilters} disabled={filters.severity === "" && filters.eventType === "" && filters.calendarMode === "all" && !filters.date && !filters.month && !filters.year && !filters.ip && !searchQuery}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div className="severity-filter-row">
            <span className="filter-label">Severity</span>
            <button className={`severity-chip all ${!filters.severity ? "selected" : ""}`} onClick={() => updateFilter("severity", "")}>
              All <b>{events.length}</b>
            </button>
            {SEVERITIES.map((severity) => (
              <button
                key={severity}
                className={`severity-chip ${severity.toLowerCase()} ${filters.severity === severity ? "selected" : ""}`}
                onClick={() => updateFilter("severity", filters.severity === severity ? "" : severity)}
              >
                {severity} <b>{severityCounts[severity]}</b>
              </button>
            ))}
          </div>

          <div className="filter-controls-grid">
            <label>
              <span>Event Type</span>
              <select value={filters.eventType} onChange={(e) => updateFilter("eventType", e.target.value)}>
                <option value="">All Event Types</option>
                {eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>

            <label>
              <span>Calendar View</span>
              <select
                value={filters.calendarMode}
                onChange={(e) => updateFilter("calendarMode", e.target.value)}
              >
                <option value="all">All dates</option>
                <option value="date">Specific date</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </label>

            {filters.calendarMode === "date" && (
              <label>
                <span>Date</span>
                <input type="date" value={filters.date} onChange={(e) => updateFilter("date", e.target.value)} />
              </label>
            )}

            {filters.calendarMode === "month" && (
              <>
                <label>
                  <span>Month</span>
                  <select value={filters.month} onChange={(e) => updateFilter("month", e.target.value)}>
                    <option value="">Select month</option>
                    {MONTHS.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                  </select>
                </label>
                <label>
                  <span>Year</span>
                  <select value={filters.year} onChange={(e) => updateFilter("year", e.target.value)}>
                    <option value="">Select year</option>
                    {years.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                </label>
              </>
            )}

            {filters.calendarMode === "year" && (
              <label>
                <span>Year</span>
                <select value={filters.year} onChange={(e) => updateFilter("year", e.target.value)}>
                  <option value="">Select year</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </label>
            )}

            <label className="ip-filter-field">
              <span>Search IP Address</span>
              <div className="ip-input">
                <Search size={15} />
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Source or destination IP"
                  value={filters.ip}
                  onChange={(e) => updateFilter("ip", e.target.value)}
                />
                {filters.ip && <button onClick={() => updateFilter("ip", "")} aria-label="Clear IP search"><X size={14} /></button>}
              </div>
            </label>
          </div>
        </section>

        <section className="kpi-grid">
          <KpiCard icon={Activity} label="Total Events" value={totalEvents} tone="cyan" />
          <KpiCard icon={ShieldAlert} label="Critical Threats" value={criticalThreats} tone="critical" />
          <KpiCard icon={TriangleAlert} label="High Severity Alerts" value={highSeverityAlerts} tone="high" />
          <KpiCard icon={Bug} label="Vulnerabilities in Events" value={vulnerabilities} tone="medium" />
          <KpiCard icon={Siren} label="Active Incidents" value={activeIncidents} tone="critical" />
        </section>

        {filters.ip && (
          <section className="ip-result-banner">
            <div><Search size={17} /><strong>IP investigation</strong><span>Results for <b>{filters.ip}</b> across source and destination addresses.</span></div>
            {filteredEvents.length === 0 && <span className="no-match">No matching IP telemetry</span>}
          </section>
        )}

        <section className="charts-grid">
          <PieChartComponent events={filteredEvents} />
          <LineChartComponent events={filteredEvents} />
          <BarChartComponent events={filteredEvents} />
        </section>

        <SecurityEventsTable events={filteredEvents} searchQuery={searchQuery} />
      </div>
    </DashboardLayout>
  );
}

function KpiCard({ icon: Icon, label, value, tone }) {
  return (
    <div className={`kpi-card tone-${tone}`}>
      <div className="kpi-icon"><Icon size={20} /></div>
      <div className="kpi-body"><div className="kpi-value">{value.toLocaleString()}</div><div className="kpi-label">{label}</div></div>
    </div>
  );
}
