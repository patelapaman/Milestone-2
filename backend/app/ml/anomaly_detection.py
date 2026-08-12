from __future__ import annotations

from pathlib import Path
import hashlib
import json

import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.pipeline import Pipeline

from app.ml.feature_config import ALL_FEATURES
from app.ml.preprocessing import build_preprocessor

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / "models" / "isolation_forest_pipeline.pkl"
METADATA_PATH = BASE_DIR / "models" / "model_metadata.json"


def _to_frame(events) -> pd.DataFrame:
    return pd.DataFrame([
        e.model_dump() if hasattr(e, "model_dump") else dict(e)
        for e in events
    ])


def _dataset_fingerprint(events) -> str:
    df = _to_frame(events)
    payload = df.reindex(columns=ALL_FEATURES).to_json(orient="records", date_format="iso")
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def train_model(events, contamination: float = 0.12, save: bool = True):
    if len(events) < 5:
        raise ValueError("At least 5 processed security events are required to train Isolation Forest.")

    df = _to_frame(events)
    X = df[ALL_FEATURES]
    pipeline = Pipeline([
        ("preprocessor", build_preprocessor()),
        ("model", IsolationForest(
            n_estimators=300,
            contamination=contamination,
            random_state=42,
            n_jobs=-1,
        )),
    ])
    pipeline.fit(X)

    metadata = {
        "model_version": "IF_v1",
        "algorithm": "Isolation Forest",
        "n_estimators": 300,
        "contamination": contamination,
        "training_rows": len(df),
        "feature_count": len(ALL_FEATURES),
        "dataset_fingerprint": _dataset_fingerprint(events),
    }
    if save:
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(pipeline, MODEL_PATH)
        METADATA_PATH.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return pipeline


def load_model():
    return joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None


def ensure_model(events):
    model = load_model()
    fingerprint = _dataset_fingerprint(events)
    if model is None:
        return train_model(events)

    try:
        metadata = json.loads(METADATA_PATH.read_text(encoding="utf-8"))
        if metadata.get("dataset_fingerprint") != fingerprint:
            return train_model(events)
    except (OSError, json.JSONDecodeError):
        return train_model(events)
    return model


def predict_raw(model, events):
    if not events:
        return [], []
    df = _to_frame(events)
    X = df[ALL_FEATURES]
    return model.predict(X), model.decision_function(X)
