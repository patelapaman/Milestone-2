import pytest

from app import create_app


@pytest.fixture(scope="module")
def client():
    app = create_app()
    app.config.update(TESTING=True)
    return app.test_client()


def test_root_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    body = response.get_json()
    assert body["status"] == "Healthy"
    assert body["milestone2"] == "Ready"


def test_milestone2_health(client):
    response = client.get("/api/milestone2/health")
    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


def test_milestone2_seeded_predictions(client):
    response = client.get("/api/milestone2/predictions")
    assert response.status_code == 200
    assert len(response.get_json()) >= 8


def test_milestone2_summary(client):
    response = client.get("/api/milestone2/threat-summary")
    assert response.status_code == 200
    assert response.get_json()["kpis"]["total_events"] >= 8


def test_milestone2_live_prediction(client):
    event = {
        "event_id": "TEST-EVT-001",
        "event_type": "Brute Force",
        "failed_login_attempts": 20,
        "login_frequency": 40,
        "login_hour": 2,
        "connection_frequency": 20,
        "unique_destination_count": 5,
        "protocol": "TCP",
        "events_per_user": 30,
        "unique_ip_count": 5,
        "after_hours_activity": 1,
        "cvss_score": 9.1,
        "vulnerability_count": 2,
        "severity_score": 9,
        "malware_detected": 0,
        "event_frequency": 35,
        "source_country": "India",
        "destination_country": "USA",
        "impossible_travel_flag": 1,
        "source_ip": "10.0.0.1",
        "destination_ip": "198.51.100.1",
        "user": "Test",
        "asset": "Test-Server",
    }
    response = client.post("/api/milestone2/predict", json=event)
    assert response.status_code == 200
    body = response.get_json()
    assert body["prediction"] == "Suspicious"
    assert body["confidence_score"] >= 51
    assert body["reasons"]
