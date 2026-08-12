"""Explicit training entry point for the Milestone 2 Isolation Forest model."""

from app.ml.data_loader import load_processed_events
from app.ml.anomaly_detection import train_model

if __name__ == "__main__":
    events = load_processed_events()
    train_model(events)
    print(f"Isolation Forest trained successfully on {len(events)} processed events.")
