from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime

from database.queries import (
    get_security_events,
    get_vulnerabilities,
    get_incidents,
)


def _count(values):
    return Counter(str(v) for v in values if v not in (None, "", "nan"))


def _sorted_counts(counter, limit=None):
    rows = [{"name": key, "value": value} for key, value in counter.most_common()]
    return rows[:limit] if limit else rows


def _parse_timestamp(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        try:
            return datetime.strptime(str(value), "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return None


def _month_label(value):
    parsed = _parse_timestamp(value)
    return parsed.strftime("%Y-%m") if parsed else None



def _response_minutes(value):
    try:
        return float(str(value or "").lower().replace("min", "").strip())
    except (TypeError, ValueError):
        return 0.0

def get_section_analytics():
    events = get_security_events()
    vulnerabilities = get_vulnerabilities()
    incidents = get_incidents()

    # Threat distribution -------------------------------------------------
    severity = _count(e.get("severity") for e in events)
    event_types = _count(e.get("event_type") for e in events)
    protocols = _count(e.get("protocol") for e in events)
    source_countries = _count(e.get("source_country") for e in events)
    status = _count(e.get("event_status") for e in events)

    monthly = Counter()
    for event in events:
        label = _month_label(event.get("timestamp"))
        if label:
            monthly[label] += 1

    threat = {
        "total_events": len(events),
        "critical_events": severity.get("Critical", 0),
        "high_events": severity.get("High", 0),
        "failed_events": status.get("Failed", 0),
        "severity_distribution": _sorted_counts(severity),
        "event_type_distribution": _sorted_counts(event_types, 8),
        "protocol_distribution": _sorted_counts(protocols, 8),
        "source_country_distribution": _sorted_counts(source_countries, 8),
        "monthly_trend": [
            {"name": month, "value": count}
            for month, count in sorted(monthly.items())
        ],
        "status_distribution": _sorted_counts(status),
        "top_event_type": event_types.most_common(1)[0][0] if event_types else "—",
    }

    # Vulnerability analytics --------------------------------------------
    vulnerability_rows = []
    for item in vulnerabilities:
        row = dict(item)
        try:
            row["cvss_score"] = float(row.get("cvss_score", 0) or 0)
        except (TypeError, ValueError):
            row["cvss_score"] = 0.0
        vulnerability_rows.append(row)

    # Security events often contain CVE identifiers even when a separate
    # vulnerability record is not present. Treat these as "observed CVEs"
    # rather than inventing new vulnerability records.
    observed_cves = Counter(
        str(e.get("vulnerability_id"))
        for e in events
        if e.get("vulnerability_id") not in (None, "", "nan")
    )
    vuln_severity = _count(v.get("severity") for v in vulnerability_rows)
    vuln_status = _count(v.get("status") for v in vulnerability_rows)
    vuln_assets = _count(v.get("affected_asset") for v in vulnerability_rows)
    patch_status = _count(v.get("patch_available") for v in vulnerability_rows)

    avg_cvss = round(
        sum(v.get("cvss_score", 0) for v in vulnerability_rows) / len(vulnerability_rows),
        2,
    ) if vulnerability_rows else 0

    vulnerability = {
        "total": len(vulnerability_rows),
        "open": sum(1 for v in vulnerability_rows if str(v.get("status", "")).lower() == "open"),
        "critical": vuln_severity.get("Critical", 0),
        "high": vuln_severity.get("High", 0),
        "average_cvss": avg_cvss,
        "patch_available": patch_status.get("Yes", 0),
        "severity_distribution": _sorted_counts(vuln_severity),
        "status_distribution": _sorted_counts(vuln_status),
        "affected_assets": _sorted_counts(vuln_assets, 8),
        "observed_cves": [
            {"name": cve, "value": count}
            for cve, count in observed_cves.most_common(8)
        ],
        "cvss_by_asset": [
            {"name": str(v.get("affected_asset") or "Unknown"), "value": v.get("cvss_score", 0)}
            for v in sorted(vulnerability_rows, key=lambda row: row.get("cvss_score", 0), reverse=True)[:8]
        ],
        "patch_distribution": _sorted_counts(patch_status),
        "records": vulnerability_rows,
    }

    # Incident analytics --------------------------------------------------
    incident_status = _count(i.get("status") for i in incidents)
    incident_types = _count(i.get("incident_type") for i in incidents)
    assigned = _count(i.get("assigned_to") for i in incidents)
    resolutions = _count(i.get("resolution") for i in incidents)

    response_minutes = []
    for incident in incidents:
        raw = str(incident.get("response_time", ""))
        try:
            response_minutes.append(float(raw.lower().replace("min", "").strip()))
        except ValueError:
            pass

    incident = {
        "total": len(incidents),
        "open": sum(1 for i in incidents if str(i.get("status", "")).lower() == "open"),
        "closed": sum(1 for i in incidents if str(i.get("status", "")).lower() == "closed"),
        "average_response_minutes": round(sum(response_minutes) / len(response_minutes), 1) if response_minutes else 0,
        "status_distribution": _sorted_counts(incident_status),
        "type_distribution": _sorted_counts(incident_types),
        "assigned_distribution": _sorted_counts(assigned),
        "resolution_distribution": _sorted_counts(resolutions),
        "response_records": [
            {"name": str(i.get("incident_id") or "Unknown"), "value": _response_minutes(i.get("response_time"))}
            for i in incidents
        ],
        "records": incidents,
    }

    # Executive report combines the four sections without duplicating raw
    # records in the response.
    report = {
        "generated_from": "local security event, vulnerability and incident datasets",
        "executive_summary": {
            "security_events": len(events),
            "critical_events": severity.get("Critical", 0),
            "high_events": severity.get("High", 0),
            "vulnerabilities": len(vulnerability_rows),
            "open_vulnerabilities": vulnerability["open"],
            "incidents": len(incidents),
            "open_incidents": incident["open"],
            "average_cvss": vulnerability["average_cvss"],
            "top_event_type": threat["top_event_type"],
        },
        "priority_actions": [
            "Review critical and high-severity events first.",
            "Prioritize open vulnerabilities with high CVSS scores and available patches.",
            "Review open incidents and confirm ownership and response SLA compliance.",
            "Use the threat distribution and monthly trend to focus analyst attention on recurring attack patterns.",
        ],
    }

    return {
        "threats": threat,
        "vulnerabilities": vulnerability,
        "incidents": incident,
        "report": report,
    }
