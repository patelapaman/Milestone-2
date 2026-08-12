NUMERIC_FEATURES = [
    "failed_login_attempts", "login_frequency", "login_hour",
    "connection_frequency", "unique_destination_count",
    "events_per_user", "unique_ip_count", "after_hours_activity",
    "cvss_score", "vulnerability_count", "severity_score",
    "malware_detected", "event_frequency", "impossible_travel_flag"
]
CATEGORICAL_FEATURES = ["protocol", "event_type", "source_country", "destination_country"]
ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES
