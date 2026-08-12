from datetime import datetime, timezone
from typing import Optional, Any
from pydantic import BaseModel, Field, ConfigDict


class SecurityEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    event_id: str = Field(min_length=1, max_length=100)
    event_type: str = Field(default="Authentication", min_length=1)
    failed_login_attempts: float = Field(default=0, ge=0)
    login_frequency: float = Field(default=0, ge=0)
    login_hour: float = Field(default=12, ge=0, le=23.99)
    connection_frequency: float = Field(default=0, ge=0)
    unique_destination_count: float = Field(default=0, ge=0)
    protocol: str = Field(default="TCP", min_length=1)
    events_per_user: float = Field(default=0, ge=0)
    unique_ip_count: float = Field(default=0, ge=0)
    after_hours_activity: float = Field(default=0, ge=0, le=1)
    cvss_score: float = Field(default=0, ge=0, le=10)
    vulnerability_count: float = Field(default=0, ge=0)
    severity_score: float = Field(default=0, ge=0, le=10)
    malware_detected: float = Field(default=0, ge=0, le=1)
    event_frequency: float = Field(default=0, ge=0)
    source_country: str = Field(default="Unknown", min_length=1)
    destination_country: str = Field(default="Unknown", min_length=1)
    impossible_travel_flag: float = Field(default=0, ge=0, le=1)
    source_ip: str = "N/A"
    destination_ip: str = "N/A"
    user: str = "Unknown"
    asset: str = "Unknown"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    label: Optional[str] = None


class PredictionResponse(BaseModel):
    event_id: str
    prediction: str
    threat_type: str
    confidence_score: int
    anomaly_score: float
    severity: str
    model_version: str
    reasons: list[str]
    prediction_timestamp: datetime
    event: dict[str, Any]
