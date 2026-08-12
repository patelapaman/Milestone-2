from pathlib import Path
import pandas as pd
from app.schemas import SecurityEvent
from app.sample_data import sample_events

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "processed_security_events.csv"

def load_processed_events():
    """Load Milestone 1-style processed events from CSV; use bundled demo data if absent."""
    if not DATA_PATH.exists():
        return sample_events()
    df = pd.read_csv(DATA_PATH)
    df = df.astype(object).where(pd.notna(df), None)
    events = []
    for row in df.to_dict("records"):
        if row.get("timestamp"):
            row["timestamp"] = pd.to_datetime(row["timestamp"], utc=True).to_pydatetime()
        for field in ("source_ip", "destination_ip", "user", "asset"):
            if row.get(field) is None:
                row.pop(field, None)
        if row.get("label") is None:
            row.pop("label", None)
        events.append(SecurityEvent(**row))
    return events
