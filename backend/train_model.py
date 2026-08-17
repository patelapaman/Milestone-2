"""Explicit training entry point for the integrated Milestone 2 Isolation Forest model."""

from milestone2_engine.ml.data_loader import load_shared_events
from milestone2_engine.ml.anomaly_detection import train_model


if __name__ == "__main__":
    events = load_shared_events()
    train_model(events)
    print(f"Isolation Forest trained successfully on {len(events)} shared security events.")
