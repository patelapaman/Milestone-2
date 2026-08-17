from milestone2_engine.config import MODEL_VERSION


def _number(value):
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def rule_evidence(event):
    reasons = []
    failed = _number(event.failed_login_attempts)
    cvss = _number(event.cvss_score)
    malware = _number(event.malware_detected)
    travel = _number(event.impossible_travel_flag)
    after = _number(event.after_hours_activity)
    freq = _number(event.event_frequency)

    if failed > 10:
        reasons.append(f"Brute-force indicator: {int(failed)} failed login attempts (> 10)")
    if malware >= 1:
        reasons.append("Malware indicator detected")
    if cvss >= 9:
        reasons.append(f"Critical CVSS indicator: {cvss:.1f} (>= 9.0)")
    if travel >= 1:
        reasons.append("Impossible travel detected")
    if after >= 1:
        reasons.append("After-hours activity detected")
    if freq >= 25:
        reasons.append(f"High event frequency: {int(freq)} (>= 25)")
    if not reasons:
        reasons.append("No configured high-confidence security rule was triggered")
    return reasons


def classify(event, is_anomaly, anomaly_score):
    reasons = rule_evidence(event)
    rule_reasons = 0 if len(reasons) == 1 and reasons[0].startswith("No configured") else len(reasons)

    failed = _number(event.failed_login_attempts)
    cvss = _number(event.cvss_score)
    malware = _number(event.malware_detected)
    travel = _number(event.impossible_travel_flag)
    after = _number(event.after_hours_activity)

    # decision_function is higher for normal observations and lower for anomalies.
    anomaly_strength = max(0.0, min(1.0, 0.5 - float(anomaly_score) / 0.5))
    evidence_strength = min(1.0, rule_reasons / 4.0)
    confidence = int(round(100 * min(1.0, 0.45 * anomaly_strength + 0.55 * evidence_strength)))

    if not is_anomaly and rule_reasons == 0:
        return "Normal", "Normal", confidence, reasons

    high_indicators = sum([
        failed > 10,
        malware >= 1,
        cvss >= 9,
        travel >= 1,
        after >= 1,
    ])

    if high_indicators >= 3 or (malware >= 1 and cvss >= 9):
        severity, threat_type = "Critical Threat", "Multi-Indicator Attack"
    elif malware >= 1:
        severity, threat_type = "High Threat", "Malware"
    elif failed > 10:
        severity, threat_type = "High Threat", "Brute Force"
    elif travel >= 1:
        severity, threat_type = "High Threat", "Impossible Travel"
    elif cvss >= 9:
        severity, threat_type = "High Threat", "Critical Vulnerability"
    elif is_anomaly and after >= 1:
        severity, threat_type = "Medium Threat", "Anomalous User Behavior"
    elif is_anomaly:
        severity, threat_type = "Medium Threat", "Anomalous Activity"
    else:
        severity, threat_type = "Low Threat", "Rule-Based Suspicion"

    return severity, threat_type, max(confidence, 51 if rule_reasons else confidence), reasons


def make_prediction(event, is_anomaly, anomaly_score):
    severity, threat_type, confidence, reasons = classify(event, is_anomaly, anomaly_score)
    return {
        "event_id": event.event_id,
        "prediction": "Normal" if severity == "Normal" else "Suspicious",
        "threat_type": threat_type,
        "confidence_score": confidence,
        "anomaly_score": round(float(anomaly_score), 5),
        "severity": severity,
        "model_version": MODEL_VERSION,
        "reasons": reasons,
        "prediction_timestamp": event.timestamp,
        "event": event.model_dump(mode="json"),
    }
