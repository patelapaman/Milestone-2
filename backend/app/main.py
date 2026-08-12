from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS, MODEL_VERSION
from app.database.repository import repository
from app.ml.data_loader import load_processed_events
from app.ml.anomaly_detection import ensure_model, METADATA_PATH
from app.ml.evaluation import evaluate_if_labels_exist
from app.services.prediction_service import predict_event, predict_events
from app.schemas import SecurityEvent, PredictionResponse


@asynccontextmanager
async def lifespan(app):
    events = load_processed_events()
    app.state.processed_events = events
    app.state.model = ensure_model(events)

    # Keep MongoDB/demo storage synchronized with the bundled Milestone-1-style
    # processed dataset without deleting analyst history or duplicating events.
    for prediction in predict_events(events, app.state.model):
        if repository.by_id(prediction["event_id"]) is None:
            repository.insert(prediction)
    yield


app = FastAPI(
    title="Milestone 2 AI Threat Detection API",
    version=MODEL_VERSION,
    description="Isolation Forest anomaly detection with explainable security rules.",
    lifespan=lifespan,
)

allow_credentials = "*" not in CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS or ["*"],
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_version": MODEL_VERSION,
        "storage": repository.mode,
        "processed_events": len(app.state.processed_events),
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(event: SecurityEvent):
    return predict_event(event, app.state.model, repository.insert)


@app.get("/predictions")
def predictions(
    limit: int = Query(200, ge=1, le=1000),
    search: str = Query("", max_length=100),
    severity: str = Query("", max_length=40),
):
    data = repository.all(limit)
    if search:
        q = search.lower().strip()
        data = [x for x in data if q in str(x).lower()]
    if severity:
        data = [x for x in data if x.get("severity") == severity]
    return data


@app.get("/predictions/{event_id}")
def prediction(event_id: str):
    item = repository.by_id(event_id)
    if not item:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return item


@app.get("/anomalies")
def anomalies(limit: int = Query(1000, ge=1, le=1000)):
    return [x for x in repository.all(limit) if x.get("prediction") != "Normal"]


@app.get("/threat-summary")
def threat_summary():
    data = repository.all(1000)
    counts = {
        "total_events": len(data),
        "anomalies_detected": 0,
        "normal_events": 0,
        "high_risk_events": 0,
        "critical_threats": 0,
    }
    severity = {}
    types = {}
    prediction = {"Normal": 0, "Suspicious": 0}
    for item in data:
        pred = item.get("prediction", "Normal")
        prediction[pred] = prediction.get(pred, 0) + 1
        if pred != "Normal":
            counts["anomalies_detected"] += 1
        else:
            counts["normal_events"] += 1
        if item.get("severity") in ("High Threat", "Critical Threat"):
            counts["high_risk_events"] += 1
        if item.get("severity") == "Critical Threat":
            counts["critical_threats"] += 1
        severity[item.get("severity", "Unknown")] = severity.get(item.get("severity", "Unknown"), 0) + 1
        types[item.get("threat_type", "Unknown")] = types.get(item.get("threat_type", "Unknown"), 0) + 1

    return {
        "kpis": counts,
        "prediction_distribution": prediction,
        "severity_distribution": severity,
        "threat_types": types,
    }


@app.get("/model-performance")
def model_performance():
    result = evaluate_if_labels_exist(app.state.processed_events)
    return result | {
        "model_version": MODEL_VERSION,
        "algorithm": "Isolation Forest",
        "model_metadata_available": METADATA_PATH.exists(),
        "evaluation_note": "When reliable labels are absent, accuracy/precision/recall/F1 are not fabricated. Precision, recall and F1 are preferred when labels are available.",
    }
