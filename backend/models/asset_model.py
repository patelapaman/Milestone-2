class Asset:
    def __init__(
        self,
        asset_id,
        hostname,
        ip_address,
        operating_system,
        owner,
        location,
        criticality
    ):
        self.asset_id = asset_id
        self.hostname = hostname
        self.ip_address = ip_address
        self.operating_system = operating_system
        self.owner = owner
        self.location = location
        self.criticality = criticality

    def to_dict(self):
        return {
            "asset_id": self.asset_id,
            "hostname": self.hostname,
            "ip_address": self.ip_address,
            "operating_system": self.operating_system,
            "owner": self.owner,
            "location": self.location,
            "criticality": self.criticality
        }

