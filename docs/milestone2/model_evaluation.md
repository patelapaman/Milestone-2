# Model Evaluation

The primary detector is Isolation Forest as recommended by Milestone 2.

Because the supplied requirements explicitly distinguish reliable labels from unlabeled anomaly detection, the application only reports accuracy, precision, recall, F1 and confusion matrix when reliable labels are present.

If labels are not available, the API states that supervised metrics are unavailable instead of inventing them.

For cybersecurity, recall is especially important because missed malicious activity can be costly; precision matters for controlling false alarms.

A future comparison with LOF, One-Class SVM or a supervised classifier can be added after the primary Isolation Forest pipeline is stable.
