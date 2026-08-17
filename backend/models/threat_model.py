class Threat:
    def __init__(
        self,
        threat_id,
        threat_name,
        threat_family,
        threat_score,
        ioc,
        source
    ):
        self.threat_id = threat_id
        self.threat_name = threat_name
        self.threat_family = threat_family
        self.threat_score = threat_score
        self.ioc = ioc
        self.source = source

    def to_dict(self):
        return {
            "threat_id": self.threat_id,
            "threat_name": self.threat_name,
            "threat_family": self.threat_family,
            "threat_score": self.threat_score,
            "ioc": self.ioc,
            "source": self.source
        }