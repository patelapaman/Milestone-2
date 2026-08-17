from __future__ import annotations

from .ml.data_loader import load_shared_events
from .ml.anomaly_detection import ensure_model
from .ml.evaluation import evaluate_if_labels_exist
from .services.prediction_service import predict_event, predict_events
from .database.repository import repository


class Milestone2Runtime:
    def __init__(self):
        self.events = []
        self.model = None
        self.error = None

    def initialize(self):
        try:
            self.events = load_shared_events()
            self.model = ensure_model(self.events)
            for prediction in predict_events(self.events, self.model):
                if repository.by_id(prediction["event_id"]) is None:
                    repository.insert(prediction)
            self.error = None
        except Exception as exc:
            self.error = str(exc)
            raise

    @property
    def ready(self):
        return self.model is not None and not self.error


runtime = Milestone2Runtime()
