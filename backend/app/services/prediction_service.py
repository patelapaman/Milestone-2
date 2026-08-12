from app.ml.anomaly_detection import ensure_model, predict_raw
from app.services.scoring_service import make_prediction

def predict_event(event, model, persist=None):
    raw_pred, raw_score = predict_raw(model, [event])
    result = make_prediction(event, raw_pred[0] == -1, raw_score[0])
    if persist:
        persist(result)
    return result

def predict_events(events, model):
    raw_pred, raw_score = predict_raw(model, events)
    return [make_prediction(e, p == -1, s) for e, p, s in zip(events, raw_pred, raw_score)]
