from app.ml.data_loader import load_processed_events
from app.ml.anomaly_detection import train_model
from app.services.prediction_service import predict_events
from app.database.repository import repository

events = load_processed_events()
model = train_model(events)
predictions = predict_events(events, model)
for p in predictions:
    repository.insert(p)
print(f"Seeded {len(predictions)} predictions using {repository.mode} storage.")
