class SecurityEvent:
    def __init__(
        self,
        event_id,
        asset_id,
        threat_id,
        attack_name,
        severity,
        timestamp,
        status
    ):
        self.event_id = event_id
        self.asset_id = asset_id
        self.threat_id = threat_id
        self.attack_name = attack_name
        self.severity = severity
        self.timestamp = timestamp
        self.status = status

    def to_dict(self):
        return {
            "event_id": self.event_id,
            "asset_id": self.asset_id,
            "threat_id": self.threat_id,
            "attack_name": self.attack_name,
            "severity": self.severity,
            "timestamp": self.timestamp,
            "status": self.status
        }