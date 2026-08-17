"""Seed the integrated Milestone 2 prediction repository from bundled events."""

from milestone2_engine.ml.data_loader import load_shared_events
from milestone2_engine.ml.anomaly_detection import ensure_model
from milestone2_engine.services.prediction_service import predict_events
from milestone2_engine.database.repository import repository


if __name__ == "__main__":
    events = load_shared_events()
    model = ensure_model(events)
    predictions = predict_events(events, model)
    for prediction in predictions:
        repository.insert(prediction)
    print(f"Seeded {len(predictions)} predictions using {repository.mode} storage.")
