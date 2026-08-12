from fastapi.testclient import TestClient
from app.main import app
import pytest

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_health(client):
    r=client.get("/health")
    assert r.status_code==200
    assert r.json()["status"]=="ok"

def test_seeded_predictions(client):
    r=client.get("/predictions")
    assert r.status_code==200
    assert len(r.json()) >= 8

def test_summary(client):
    r=client.get("/threat-summary")
    body=r.json()
    assert r.status_code==200
    assert body["kpis"]["total_events"] >= 8

def test_live_prediction(client):
    event={
      "event_id":"TEST-EVT-001","event_type":"Brute Force",
      "failed_login_attempts":20,"login_frequency":40,"login_hour":2,
      "connection_frequency":20,"unique_destination_count":5,"protocol":"TCP",
      "events_per_user":30,"unique_ip_count":5,"after_hours_activity":1,
      "cvss_score":9.1,"vulnerability_count":2,"severity_score":9,
      "malware_detected":0,"event_frequency":35,
      "source_country":"India","destination_country":"USA",
      "impossible_travel_flag":1,"source_ip":"10.0.0.1",
      "destination_ip":"198.51.100.1","user":"Test","asset":"Test-Server"
    }
    r=client.post("/predict",json=event)
    assert r.status_code==200
    body=r.json()
    assert body["prediction"]=="Suspicious"
    assert body["confidence_score"] >= 51
    assert len(body["reasons"]) >= 1
