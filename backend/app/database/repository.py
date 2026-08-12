from datetime import datetime, timezone
from threading import Lock

try:
    from pymongo import MongoClient
except Exception:
    MongoClient = None

from app.config import MONGO_URI, MONGO_DB


class PredictionRepository:
    def __init__(self):
        self._memory = []
        self._lock = Lock()
        self.mongo = None
        self._connect()

    def _connect(self):
        if MongoClient is None:
            return
        try:
            client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=800)
            client.admin.command("ping")
            self.mongo = client[MONGO_DB]
        except Exception:
            self.mongo = None

    @property
    def mode(self):
        return "mongodb" if self.mongo is not None else "memory"

    def insert(self, prediction):
        doc = dict(prediction)
        doc.setdefault("prediction_timestamp", datetime.now(timezone.utc))
        if self.mongo is not None:
            self.mongo.threat_predictions.update_one(
                {"event_id": doc["event_id"]}, {"$set": doc}, upsert=True
            )
        else:
            with self._lock:
                self._memory = [x for x in self._memory if x.get("event_id") != doc["event_id"]]
                self._memory.insert(0, doc)
        return doc

    def all(self, limit=200):
        if self.mongo is not None:
            return list(
                self.mongo.threat_predictions.find({}, {"_id": 0})
                .sort("prediction_timestamp", -1)
                .limit(limit)
            )
        with self._lock:
            return list(self._memory[:limit])

    def by_id(self, event_id):
        if self.mongo is not None:
            return self.mongo.threat_predictions.find_one({"event_id": event_id}, {"_id": 0})
        with self._lock:
            return next((x for x in self._memory if x.get("event_id") == event_id), None)

    def clear(self):
        if self.mongo is not None:
            self.mongo.threat_predictions.delete_many({})
        else:
            with self._lock:
                self._memory.clear()


repository = PredictionRepository()
