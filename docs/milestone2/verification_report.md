# Milestone 2 Verification Report

## Scope verified

The implementation was checked against the supplied Milestone 2 cybersecurity requirements: feature selection, preprocessing, Isolation Forest anomaly detection, threat classification, confidence scoring, hybrid security rules, MongoDB persistence, FastAPI APIs, React dashboard, investigation view, charts, filters and API integration.

Camera/attendance functionality is not part of this milestone and is not included.

## Backend verification

- `python -m pytest -q` → **4 passed** after the final backend changes.
- `GET /health` → HTTP 200.
- `GET /predictions` → HTTP 200 with seeded predictions.
- `GET /anomalies` → HTTP 200.
- `GET /model-performance` → HTTP 200 and correctly reports that supervised metrics are unavailable when reliable labels are absent.
- `GET /threat-summary` → HTTP 200 with KPI, prediction, severity and threat-type distributions.
- `GET /predictions/{event_id}` → covered by application behavior and test suite.
- `POST /predict` → HTTP 200 for a Brute Force test event and persisted result.
- Model artifact and metadata were regenerated successfully.
- Model metadata contains a processed-data fingerprint so stale models are automatically retrained when the input data changes.

## Frontend verification

The source was reviewed for React/Vite integration, routing, Axios API calls, loading/error handling, chart data mapping, event investigation, live prediction, responsive layout and React key warnings.

A production `npm run build` could not be executed in this isolated environment because `npm install` could not complete before the network timeout. This is an environment/package-download limitation, not a reported application build error. Run `npm install` followed by `npm run build` locally before final submission.

## Important model interpretation

`confidence_score` is a normalized detection-confidence indicator combining Isolation Forest anomaly strength and security-rule evidence. It is **not** presented as a calibrated probability of attack, consistent with the supplied milestone requirement.
