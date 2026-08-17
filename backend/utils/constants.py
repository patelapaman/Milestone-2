"""
Application Constants
"""

# Risk Levels
RISK_LEVELS = [
    "Low",
    "Medium",
    "High",
    "Critical"
]

# Severity Levels
SEVERITY_LEVELS = [
    "Low",
    "Medium",
    "High",
    "Critical"
]

# Supported File Types
ALLOWED_EXTENSIONS = {
    "csv"
}

# MongoDB Collections
COLLECTIONS = {
    "assets": "assets",
    "vulnerabilities": "vulnerabilities",
    "security_events": "security_events",
    "incident_history": "incident_history",
    "threat_intelligence": "threat_intelligence",
    "mitre_mapping": "mitre_mapping",
    "enriched_events": "enriched_events",
    "mapped_events": "mapped_events",
    "engineered_features": "engineered_features"
}

# Default Threat Score
DEFAULT_THREAT_SCORE = 50

# Default Risk Category
DEFAULT_RISK = "Low"