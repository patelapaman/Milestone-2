class MitreAttack:
    def __init__(
        self,
        attack_name,
        technique_id,
        technique,
        tactic
    ):
        self.attack_name = attack_name
        self.technique_id = technique_id
        self.technique = technique
        self.tactic = tactic

    def to_dict(self):
        return {
            "attack_name": self.attack_name,
            "technique_id": self.technique_id,
            "technique": self.technique,
            "tactic": self.tactic
        }