# Security Sections Update

The Threat Intelligence, Vulnerabilities, Incidents and Reports pages now use a shared backend analytics endpoint:

`GET /api/section-analytics`

## Threat Intelligence
- KPI cards: total events, critical events, high events, failed events.
- Severity distribution pie chart.
- Attack/event type ranking.
- Monthly event-volume trend.
- Protocol distribution.
- Top source-country table.

## Vulnerabilities
- KPI cards: tracked vulnerabilities, open, critical, average CVSS.
- Severity distribution.
- Status distribution.
- Affected-asset ranking.
- Observed CVEs from security-event telemetry.
- Full vulnerability register.

Observed CVEs are intentionally shown separately from confirmed vulnerability records. This avoids treating an event reference as a confirmed vulnerability.

## Incidents
- KPI cards: total, open, closed, average response time.
- Status distribution.
- Incident-type distribution.
- Assignment/ownership distribution.
- Resolution outcomes.
- Full incident history table.

No synthetic incident records are generated.

## Reports
- Executive KPI summary.
- Threat severity snapshot.
- Vulnerability status snapshot.
- Priority actions based on current project data.
- Report coverage summary.
- JSON report download.
- Browser print / Save as PDF.

## Files changed
- `backend/app.py`
- `backend/services/section_analytics_service.py` (new)
- `backend/routes/section_analytics.py` (new)
- `frontend/src/services/api.js`
- `frontend/src/pages/Threats.jsx`
- `frontend/src/pages/Vulnerabilities.jsx`
- `frontend/src/pages/Incidents.jsx`
- `frontend/src/pages/Reports.jsx`
- `frontend/src/pages/SecuritySections.css` (new)

The implementation uses the existing Recharts dependency; no new npm package is required.
