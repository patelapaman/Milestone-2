from database.mongodb import get_db


def get_collection(collection_name):
    """Return all documents from a MongoDB collection."""
    db = get_db()
    return list(db[collection_name].find({}, {"_id": 0}))


def get_assets():
    return get_collection("assets")


def get_vulnerabilities():
    return get_collection("vulnerabilities")


def get_security_events():
    """Return security telemetry directly from MongoDB."""
    return get_collection("security_events")


def get_incidents():
    return get_collection("incident_history")


def get_threats():
    return get_collection("threat_intelligence")


def get_mitre():
    return get_collection("mitre_mapping")


def get_enriched_events():
    return get_collection("enriched_events")


def get_mapped_events():
    return get_collection("mapped_events")


def get_features():
    return get_collection("engineered_features")


def get_high_risk_assets():
    db = get_db()
    return list(db["engineered_features"].find(
        {"risk_category": {"$in": ["High", "Critical"]}},
        {"_id": 0}
    ))


def get_dashboard_summary():
    db = get_db()
    return {
        "assets": db["assets"].count_documents({}),
        "vulnerabilities": db["vulnerabilities"].count_documents({}),
        "security_events": db["security_events"].count_documents({}),
        "incidents": db["incident_history"].count_documents({}),
        "threats": db["threat_intelligence"].count_documents({}),
        "mapped_events": db["mapped_events"].count_documents({}),
        "high_risk_assets": db["engineered_features"].count_documents(
            {"risk_category": {"$in": ["High", "Critical"]}}
        )
    }
