class Incident:
    def __init__(
        self,
        incident_id,
        asset_id,
        event_id,
        incident_type,
        severity,
        detected_time,
        resolved_time,
        status
    ):
        self.incident_id = incident_id
        self.asset_id = asset_id
        self.event_id = event_id
        self.incident_type = incident_type
        self.severity = severity
        self.detected_time = detected_time
        self.resolved_time = resolved_time
        self.status = status

    def to_dict(self):
        return {
            "incident_id": self.incident_id,
            "asset_id": self.asset_id,
            "event_id": self.event_id,
            "incident_type": self.incident_type,
            "severity": self.severity,
            "detected_time": self.detected_time,
            "resolved_time": self.resolved_time,
            "status": self.status
        }