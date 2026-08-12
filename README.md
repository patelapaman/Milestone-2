# Milestone 2 — AI-Based Threat Detection & Anomaly Analysis Engine

A complete Milestone 2 implementation based on the supplied Infosys requirements.

## What is implemented

- Milestone 1-compatible processed security-event input
- Feature selection and documented rationale
- ML preprocessing: missing values, categorical encoding, numeric handling
- Primary Isolation Forest anomaly detector
- Hybrid security rules: brute force, malware, critical CVSS, impossible travel, after-hours and combined indicators
- Threat classification: Normal / Low Threat / Medium Threat / High Threat / Critical Threat
- Explainable reasons for every prediction
- Confidence score (a model-derived detection confidence, **not an attack probability**)
- Model evaluation when labelled data is available
- Versioned saved model
- MongoDB prediction persistence when MongoDB is available
- In-memory demo fallback so the project can be run and evaluated without MongoDB
- FastAPI endpoints:
  - `POST /predict`
  - `GET /predictions`
  - `GET /predictions/{event_id}`
  - `GET /anomalies`
  - `GET /model-performance`
  - `GET /threat-summary`
  - `GET /health`
- React + Vite dashboard
- KPI cards, threat table, search/filtering, anomaly distribution, threat-type chart, anomaly trend
- Event investigation page
- Confidence visualization and explainable AI panel
- Responsive modern dark SOC-style UI with transitions
- API error/loading/empty states
- Automated backend tests

## Architecture

Security Events → Feature Selection → Preprocessing → Isolation Forest → Anomaly Score → Hybrid Rules → Threat Classification → Confidence → MongoDB → FastAPI → React Dashboard

## Important scope decisions

This milestone deliberately does **not** add deep learning, LLMs, or Milestone 3 risk prioritization. Isolation Forest is the primary detector as required.

The confidence score is a normalized detection-confidence indicator based on anomaly strength and security-rule evidence. It is not presented as a calibrated probability of attack.

## Prerequisites

- Python 3.10+
- Node.js 20.19+ (or Node.js 22.12+)
- npm
- MongoDB Community Server (optional for demo; required for persistent MongoDB storage)

## Backend setup

Windows PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.seed
python -m uvicorn app.main:app --reload
```

If PowerShell blocks activation, use:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m app.seed
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Backend:
- API: http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs

## MongoDB

Default:
- `MONGO_URI=mongodb://127.0.0.1:27017`
- `MONGO_DB=milestone2_threat_detection`

Create `backend/.env` if needed:

```env
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=milestone2_threat_detection
MODEL_VERSION=IF_v1
CORS_ORIGINS=http://localhost:5173
```

If MongoDB is not running, the application automatically uses an in-memory repository for demo/testing. Predictions will not survive a process restart in fallback mode.

## Frontend setup

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally:
http://localhost:5173

## Demo flow

1. Start the backend.
2. Start the frontend.
3. Open the dashboard.
4. Review KPI cards and charts.
5. Search/filter the threat table.
6. Click an event to open Event Investigation.
7. Review prediction, confidence, severity, anomaly score and explanations.
8. Use the "Run Live Prediction" panel to submit a new security event.
9. Refresh the dashboard to see the stored prediction.

## API examples

```http
POST /predict
Content-Type: application/json

{
  "event_id": "EVT-LIVE-001",
  "event_type": "Brute Force",
  "failed_login_attempts": 18,
  "login_frequency": 36,
  "login_hour": 2,
  "connection_frequency": 18,
  "unique_destination_count": 4,
  "protocol": "TCP",
  "events_per_user": 26,
  "unique_ip_count": 5,
  "after_hours_activity": 1,
  "cvss_score": 8.9,
  "vulnerability_count": 2,
  "severity_score": 8.5,
  "malware_detected": 0,
  "event_frequency": 31,
  "source_country": "India",
  "destination_country": "USA",
  "impossible_travel_flag": 1,
  "source_ip": "10.0.0.23",
  "destination_ip": "198.51.100.10",
  "user": "demo-user",
  "asset": "Auth-Server-01"
}
```

## Model lifecycle

The saved Isolation Forest is accompanied by `backend/models/model_metadata.json`. The backend fingerprints the processed feature data and automatically retrains the model when that dataset changes, preventing stale model artifacts from silently being reused.

## Testing

Backend:

```powershell
cd backend
python -m pytest -q
```

Frontend production build:

```powershell
cd frontend
npm install
npm run build
```

If `npm install` times out, check your internet/proxy/firewall and retry; the frontend dependencies are fetched from the npm registry and are not bundled inside this ZIP.

## Project structure

```text
Milestone2_AI_Threat_Detection/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   ├── routes/
│   │   ├── ml/
│   │   ├── services/
│   │   ├── database/
│   │   └── seed.py
│   ├── data/
│   ├── models/
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── feature_selection.md
│   ├── ml_preprocessing.md
│   ├── model_evaluation.md
│   ├── api_testing.md
│   └── demo_script.md
└── README.md
```
