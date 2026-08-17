from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from milestone2_engine.runtime import runtime
from milestone2_engine.schemas import SecurityEvent
from milestone2_engine.services.prediction_service import predict_event
from milestone2_engine.ml.evaluation import evaluate_if_labels_exist
from milestone2_engine.config import MODEL_VERSION
from milestone2_engine.database.repository import repository
from milestone2_engine.ml.anomaly_detection import METADATA_PATH

milestone2_bp = Blueprint("milestone2", __name__)


def _require_runtime():
    if not runtime.ready:
        try:
            runtime.initialize()
        except Exception as exc:
            return jsonify({"error": "Milestone 2 engine is unavailable", "detail": str(exc)}), 503
    return None


def _json_prediction(item):
    return item


@milestone2_bp.route("/health", methods=["GET"])
def health():
    error = _require_runtime()
    if error:
        return error
    return jsonify({
        "status": "ok",
        "model_version": MODEL_VERSION,
        "storage": repository.mode,
        "processed_events": len(runtime.events),
    })


@milestone2_bp.route("/predict", methods=["POST"])
def predict():
    error = _require_runtime()
    if error:
        return error
    try:
        event = SecurityEvent.model_validate(request.get_json(silent=True) or {})
    except ValidationError as exc:
        return jsonify({"error": "Invalid security event", "detail": exc.errors()}), 422
    return jsonify(_json_prediction(predict_event(event, runtime.model, repository.insert)))


@milestone2_bp.route("/predictions", methods=["GET"])
def predictions():
    error = _require_runtime()
    if error:
        return error
    try:
        limit = min(max(int(request.args.get("limit", 200)), 1), 1000)
    except ValueError:
        limit = 200
    search = request.args.get("search", "").strip().lower()
    severity = request.args.get("severity", "").strip()
    data = repository.all(limit)
    if search:
        data = [x for x in data if search in str(x).lower()]
    if severity:
        data = [x for x in data if x.get("severity") == severity]
    return jsonify(data)


@milestone2_bp.route("/predictions/<event_id>", methods=["GET"])
def prediction(event_id):
    error = _require_runtime()
    if error:
        return error
    item = repository.by_id(event_id)
    if not item:
        return jsonify({"detail": "Prediction not found"}), 404
    return jsonify(item)


@milestone2_bp.route("/anomalies", methods=["GET"])
def anomalies():
    error = _require_runtime()
    if error:
        return error
    data = repository.all(1000)
    return jsonify([x for x in data if x.get("prediction") != "Normal"])


@milestone2_bp.route("/threat-summary", methods=["GET"])
def threat_summary():
    error = _require_runtime()
    if error:
        return error
    data = repository.all(1000)
    counts = {"total_events": len(data), "anomalies_detected": 0, "normal_events": 0, "high_risk_events": 0, "critical_threats": 0}
    severity, types = {}, {}
    prediction = {"Normal": 0, "Suspicious": 0}
    for item in data:
        pred = item.get("prediction", "Normal")
        prediction[pred] = prediction.get(pred, 0) + 1
        if pred != "Normal": counts["anomalies_detected"] += 1
        else: counts["normal_events"] += 1
        if item.get("severity") in ("High Threat", "Critical Threat"): counts["high_risk_events"] += 1
        if item.get("severity") == "Critical Threat": counts["critical_threats"] += 1
        severity[item.get("severity", "Unknown")] = severity.get(item.get("severity", "Unknown"), 0) + 1
        types[item.get("threat_type", "Unknown")] = types.get(item.get("threat_type", "Unknown"), 0) + 1
    return jsonify({"kpis": counts, "prediction_distribution": prediction, "severity_distribution": severity, "threat_types": types})


@milestone2_bp.route("/model-performance", methods=["GET"])
def model_performance():
    error = _require_runtime()
    if error:
        return error
    result = evaluate_if_labels_exist(runtime.events)
    result.update({
        "model_version": MODEL_VERSION,
        "algorithm": "Isolation Forest",
        "model_metadata_available": METADATA_PATH.exists(),
        "evaluation_note": "When reliable labels are absent, accuracy/precision/recall/F1 are not fabricated.",
    })
    return jsonify(result)
