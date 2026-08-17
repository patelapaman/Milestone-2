import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from milestone2_engine.ml.feature_config import NUMERIC_FEATURES, CATEGORICAL_FEATURES

def build_preprocessor():
    numeric = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])
    categorical = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])
    return ColumnTransformer([
        ("numeric", numeric, NUMERIC_FEATURES),
        ("categorical", categorical, CATEGORICAL_FEATURES),
    ])

def prepare_frame(events):
    rows = []
    for event in events:
        rows.append(event.model_dump() if hasattr(event, "model_dump") else dict(event))
    return pd.DataFrame(rows)

def transform_for_model(preprocessor, events):
    df = prepare_frame(events)
    return preprocessor.transform(df)
