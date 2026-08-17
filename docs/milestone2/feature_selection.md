# Task 1 — Feature Selection

| Feature | Why selected | Data type | Importance |
|---|---|---|---|
| failed_login_attempts | Brute-force indicator | Numeric | High |
| login_frequency | Detects unusual authentication volume | Numeric | High |
| login_hour | Detects unusual/after-hours authentication | Numeric | Medium |
| connection_frequency | Identifies abnormal network activity | Numeric | High |
| unique_destination_count | Broad destination behavior can indicate scanning/exfiltration | Numeric | Medium |
| protocol | Network behavior context | Categorical | Medium |
| events_per_user | User activity baseline | Numeric | High |
| unique_ip_count | Detects unusual source-IP diversity | Numeric | High |
| after_hours_activity | Direct suspicious-behavior indicator | Binary numeric | High |
| cvss_score | Vulnerability severity context | Numeric | High |
| vulnerability_count | Exposure context | Numeric | Medium |
| severity_score | Existing security severity signal | Numeric | High |
| malware_detected | Strong malicious indicator | Binary numeric | Critical |
| event_frequency | Detects event bursts | Numeric | High |
| source_country / destination_country | Geographic context | Categorical | Medium |
| impossible_travel_flag | Detects physically implausible login movement | Binary numeric | Critical |
| event_type | Helps distinguish attack patterns | Categorical | Medium |

The selection follows the supplied Milestone 2 specification and reuses Milestone 1 processed security-event data rather than redesigning the database.
