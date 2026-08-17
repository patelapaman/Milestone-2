from pathlib import Path
from collections import Counter, defaultdict
import math
import pandas as pd
from milestone2_engine.schemas import SecurityEvent
from milestone2_engine.sample_data import sample_events

BASE_DIR = Path(__file__).resolve().parents[2]
SHARED_DATA_PATH = BASE_DIR / "data" / "security_events.csv"
LEGACY_DATA_PATH = BASE_DIR / "data" / "processed_security_events.csv"

SEVERITY_SCORE = {"Critical": 10.0, "High": 8.0, "Medium": 5.0, "Low": 2.0}


def _safe_text(value, default="Unknown"):
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return default
    text = str(value).strip()
    return text if text else default


def load_shared_events():
    """
    Load the exact security_events.csv used by the Overview dashboard and
    adapt its fields into the 18-feature AI schema.

    The AI layer does not create a second synthetic event dataset. Derived
    behavioural features are calculated from the same 1,800 raw telemetry
    rows so filtering and AI analysis refer to the same event population.
    """
    if not SHARED_DATA_PATH.exists():
        return load_processed_events()

    df = pd.read_csv(SHARED_DATA_PATH)
    df = df.astype(object).where(pd.notna(df), None)

    # Shared behavioural features calculated from the raw telemetry.
    users = df["username"].fillna("Unknown").astype(str)
    source_ips = df["source_ip"].fillna("N/A").astype(str)
    destinations = df["destination_ip"].fillna("N/A").astype(str)
    assets = df["asset_name"].fillna("Unknown").astype(str)

    user_event_count = users.value_counts().to_dict()
    source_event_count = source_ips.value_counts().to_dict()
    user_unique_ips = df.assign(_user=users, _src=source_ips).groupby("_user")["_src"].nunique().to_dict()
    source_unique_dest = df.assign(_src=source_ips, _dst=destinations).groupby("_src")["_dst"].nunique().to_dict()
    asset_vuln_count = (
        df.assign(_asset=assets, _vuln=df["vulnerability_id"].fillna("").astype(str))
        .groupby("_asset")["_vuln"]
        .apply(lambda s: sum(1 for x in s if x and x.lower() != "nan"))
        .to_dict()
    )

    events = []
    for row in df.to_dict("records"):
        timestamp = pd.to_datetime(row.get("timestamp"), errors="coerce", utc=True)
        if pd.isna(timestamp):
            timestamp = pd.Timestamp.now(tz="UTC")

        username = _safe_text(row.get("username"), "Unknown")
        source_ip = _safe_text(row.get("source_ip"), "N/A")
        destination_ip = _safe_text(row.get("destination_ip"), "N/A")
        source_country = _safe_text(row.get("source_country"))
        destination_country = _safe_text(row.get("destination_country"))
        event_type = _safe_text(row.get("event_type"), "Unknown")
        protocol = _safe_text(row.get("protocol"), "TCP")
        asset = _safe_text(row.get("asset_name"), "Unknown")

        failed = float(row.get("failed_login_attempts") or 0)
        cvss = float(row.get("cvss_score") or 0)
        severity = _safe_text(row.get("severity"), "Low")
        malware = 1.0 if _safe_text(row.get("malware_detected"), "No").lower() in {"yes", "true", "1"} else 0.0
        hour = float(timestamp.hour)
        after_hours = 1.0 if hour < 6 or hour >= 22 else 0.0

        event = SecurityEvent(
            event_id=_safe_text(row.get("event_id"), f"EVT-{len(events)+1:05d}"),
            event_type=event_type,
            failed_login_attempts=failed,
            login_frequency=float(user_event_count.get(username, 1)),
            login_hour=hour,
            connection_frequency=float(source_event_count.get(source_ip, 1)),
            unique_destination_count=float(source_unique_dest.get(source_ip, 1)),
            protocol=protocol,
            events_per_user=float(user_event_count.get(username, 1)),
            unique_ip_count=float(user_unique_ips.get(username, 1)),
            after_hours_activity=after_hours,
            cvss_score=max(0.0, min(10.0, cvss)),
            vulnerability_count=float(asset_vuln_count.get(asset, 0)),
            severity_score=SEVERITY_SCORE.get(severity, 1.0),
            malware_detected=malware,
            event_frequency=float(source_event_count.get(source_ip, 1)),
            source_country=source_country,
            destination_country=destination_country,
            impossible_travel_flag=1.0 if source_country != destination_country else 0.0,
            source_ip=source_ip,
            destination_ip=destination_ip,
            user=username,
            asset=asset,
            timestamp=timestamp.to_pydatetime(),
        )
        events.append(event)

    return events


def load_processed_events():
    """Legacy loader retained for compatibility with older Milestone 2 scripts."""
    if not LEGACY_DATA_PATH.exists():
        return sample_events()
    df = pd.read_csv(LEGACY_DATA_PATH)
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
