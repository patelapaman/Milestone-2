from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.model_selection import train_test_split

from milestone2_engine.ml.anomaly_detection import train_model, predict_raw


def _label_to_binary(label):
    value = str(label).strip().lower()
    if value in {"1", "suspicious", "anomaly", "anomalous", "malicious"}:
        return 1
    if value in {"0", "normal", "benign"}:
        return 0
    return None


def evaluate_if_labels_exist(events):
    labeled = [e for e in events if _label_to_binary(getattr(e, "label", None)) is not None]
    if len(labeled) < 6:
        return {
            "available": False,
            "message": "No reliable labelled dataset with at least 6 usable rows was supplied; Isolation Forest is evaluated as an unsupervised detector.",
        }

    y = [_label_to_binary(e.label) for e in labeled]
    stratify = y if len(set(y)) == 2 else None
    train_events, test_events = train_test_split(
        labeled,
        test_size=0.30,
        random_state=42,
        stratify=stratify,
    )
    # The labels are never passed into training; they are only used for evaluation.
    eval_model = train_model(train_events, save=False)
    pred, _ = predict_raw(eval_model, test_events)
    y_true = [_label_to_binary(e.label) for e in test_events]
    y_pred = [1 if p == -1 else 0 for p in pred]

    return {
        "available": True,
        "evaluation_rows": len(test_events),
        "accuracy": round(accuracy_score(y_true, y_pred), 4),
        "precision": round(precision_score(y_true, y_pred, zero_division=0), 4),
        "recall": round(recall_score(y_true, y_pred, zero_division=0), 4),
        "f1": round(f1_score(y_true, y_pred, zero_division=0), 4),
        "confusion_matrix": confusion_matrix(y_true, y_pred, labels=[0, 1]).tolist(),
        "note": "Metrics are calculated on a held-out test split; labels are not used to train Isolation Forest.",
    }
