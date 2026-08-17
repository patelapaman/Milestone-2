# Task 2 — ML Preprocessing

Implemented in `backend/app/ml/preprocessing.py`.

1. Numeric missing values are filled with the median.
2. Categorical missing values are filled with the most frequent value.
3. Categorical features use One-Hot Encoding with `handle_unknown="ignore"`.
4. Numeric features use StandardScaler.
5. The same fitted preprocessing pipeline is applied during prediction.
6. Feature selection is explicit in `feature_config.py`.

Isolation Forest itself does not require scaling, but the shared preprocessing pipeline keeps numeric and categorical treatment consistent and makes the feature matrix safe for the model.
