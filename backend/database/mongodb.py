from __future__ import annotations

from pathlib import Path
from typing import Any
import os

import pandas as pd
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import PyMongoError

from config import Config

client: MongoClient | None = None
db = None
_mongodb_connected = False


def _clean_value(value: Any):
    """Convert pandas/numpy values into BSON-safe Python values."""
    if pd.isna(value) if not isinstance(value, (list, dict, tuple)) else False:
        return None
    if hasattr(value, "item"):
        try:
            return value.item()
        except Exception:
            pass
    return value


def _data_dir() -> Path:
    return Path(__file__).resolve().parents[1] / Config.UPLOAD_FOLDER


CSV_COLLECTIONS = {
    "assets": "assets.csv",
    "security_events": "security_events.csv",
    "vulnerabilities": "vulnerabilities.csv",
    "threat_intelligence": "threat_intelligence.csv",
    "incident_history": "incident_history.csv",
    "mitre_mapping": "mitre_attack_mapping.csv",
}


def _csv_records(filename: str) -> list[dict]:
    path = _data_dir() / filename
    if not path.exists():
        raise FileNotFoundError(f"Dataset not found: {path}")
    frame = pd.read_csv(path)
    frame = frame.astype(object).where(pd.notna(frame), None)
    records = []
    for row in frame.to_dict("records"):
        records.append({str(k): _clean_value(v) for k, v in row.items()})
    return records


def seed_csv_collections(force: bool = False) -> dict[str, int]:
    """Load bundled CSV datasets into MongoDB collections.

    By default, existing collections are preserved. With force=True the six
    bundled source collections are replaced with the CSV contents.
    """
    if not _mongodb_connected or db is None:
        raise RuntimeError("MongoDB is not connected. Start MongoDB or configure MONGO_URI.")

    counts: dict[str, int] = {}
    for collection_name, filename in CSV_COLLECTIONS.items():
        collection = db[collection_name]
        records = _csv_records(filename)
        if force:
            collection.delete_many({})
        if collection.count_documents({}) == 0 and records:
            collection.insert_many(records, ordered=False)
        counts[collection_name] = collection.count_documents({})

    # Helpful indexes for the application's lookup patterns.
    if db["security_events"].count_documents({}) > 0:
        db["security_events"].create_index("event_id", unique=True, sparse=True)
        db["security_events"].create_index("source_ip")
        db["security_events"].create_index("destination_ip")
        db["security_events"].create_index("timestamp")
    if db["vulnerabilities"].count_documents({}) > 0:
        db["vulnerabilities"].create_index("vulnerability_id", unique=True, sparse=True)
    if db["incident_history"].count_documents({}) > 0:
        db["incident_history"].create_index("incident_id", unique=True, sparse=True)
    return counts


def connect_db(app=None):
    """Connect to MongoDB and seed bundled datasets on first run.

    MongoDB is intentionally required in this version so the dashboard never
    silently reports data from an in-memory fallback when the user expects a
    real database.
    """
    global client, db, _mongodb_connected

    uri = Config.MONGO_URI
    timeout_ms = int(os.getenv("MONGO_SERVER_SELECTION_TIMEOUT_MS", "5000"))
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=timeout_ms)
        client.admin.command("ping")
        db = client[Config.DATABASE_NAME]
        _mongodb_connected = True
        print(f"MongoDB connected: {Config.DATABASE_NAME}")

        if Config.AUTO_SEED_MONGODB:
            counts = seed_csv_collections(force=Config.FORCE_SEED_MONGODB)
            print("MongoDB dataset status:", counts)
    except Exception as exc:
        client = None
        db = None
        _mongodb_connected = False
        message = (
            "MongoDB connection failed. Start MongoDB (or set a valid MONGO_URI) "
            f"and restart the backend. Details: {exc}"
        )
        print(message)
        if Config.REQUIRE_MONGODB:
            raise RuntimeError(message) from exc


def get_db():
    if db is None:
        raise RuntimeError("MongoDB is not connected.")
    return db


def is_mongodb_connected() -> bool:
    return _mongodb_connected
