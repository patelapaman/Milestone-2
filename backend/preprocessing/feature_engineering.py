import os
import pandas as pd
import numpy as np


def calculate_asset_risk(row):
    """
    Calculate overall asset risk score.
    """

    score = 0

    # Threat Score (0-100)
    if "threat_score" in row:
        score += row["threat_score"] * 0.35

    # CVSS Score (0-10)
    if "cvss_score" in row:
        score += row["cvss_score"] * 10 * 0.30

    # MITRE Mapping
    if row.get("mitre_mapping") == "Mapped":
        score += 15

    # Known Exploit
    if row.get("known_exploit") is True:
        score += 10

    # IOC Match
    if row.get("ioc_match") is True:
        score += 10

    return round(min(score, 100), 2)


def engineer_features(mapped_df):
    """
    Perform Feature Engineering.

    Parameters
    ----------
    mapped_df : pd.DataFrame

    Returns
    -------
    pd.DataFrame
    """

    print("\nStarting Feature Engineering...\n")

    df = mapped_df.copy()

    # -----------------------------------------------------
    # Incident Frequency
    # -----------------------------------------------------
    if "asset_id" in df.columns:

        incident_count = (
            df.groupby("asset_id")
            .size()
            .rename("incident_frequency")
        )

        df = df.merge(
            incident_count,
            on="asset_id",
            how="left"
        )

    else:

        df["incident_frequency"] = 1

    # -----------------------------------------------------
    # Critical Asset
    # -----------------------------------------------------
    if "severity" in df.columns:

        df["critical_asset"] = np.where(
            df["severity"] == "Critical",
            1,
            0
        )

    else:

        df["critical_asset"] = 0

    # -----------------------------------------------------
    # Patch Age
    # -----------------------------------------------------
    if "patch_date" in df.columns:

        df["patch_date"] = pd.to_datetime(
            df["patch_date"],
            errors="coerce"
        )

        df["patch_age"] = (
            pd.Timestamp.today() - df["patch_date"]
        ).dt.days

        df["patch_age"] = df["patch_age"].fillna(0)

    else:

        df["patch_age"] = 0

    # -----------------------------------------------------
    # Historical Risk
    # -----------------------------------------------------
    if "incident_frequency" in df.columns:

        df["historical_risk"] = (
            df["incident_frequency"] * 5
        ).clip(upper=100)

    else:

        df["historical_risk"] = 0

    # -----------------------------------------------------
    # Asset Risk Score
    # -----------------------------------------------------
    df["asset_risk_score"] = df.apply(
        calculate_asset_risk,
        axis=1
    )

    # -----------------------------------------------------
    # Overall Risk Score
    # -----------------------------------------------------
    df["overall_risk_score"] = (
        df["asset_risk_score"] * 0.5 +
        df["historical_risk"] * 0.2 +
        df["threat_score"] * 0.3
    ).round(2)

    # -----------------------------------------------------
    # Risk Category
    # -----------------------------------------------------
    def risk_category(score):

        if score >= 85:
            return "Critical"

        elif score >= 65:
            return "High"

        elif score >= 40:
            return "Medium"

        else:
            return "Low"

    df["risk_category"] = df[
        "overall_risk_score"
    ].apply(risk_category)

    # -----------------------------------------------------
    # Feature Selection
    # -----------------------------------------------------
    feature_columns = [
        "asset_id",
        "threat_score",
        "cvss_score",
        "incident_frequency",
        "critical_asset",
        "patch_age",
        "historical_risk",
        "asset_risk_score",
        "overall_risk_score",
        "risk_category",
        "technique_id",
        "tactic"
    ]

    feature_columns = [
        col for col in feature_columns
        if col in df.columns
    ]

    features = df[feature_columns]

    print("✓ Feature Engineering Completed")

    print(f"Generated Features : {len(feature_columns)}")

    print(f"Total Records : {len(features)}")

    return features


if __name__ == "__main__":

    from data_collection import load_data
    from data_cleaning import clean_data
    from threat_enrichment import enrich_threat_data
    from mitre_mapping import map_mitre

    # Load datasets
    datasets = load_data()

    # Clean datasets
    cleaned = clean_data(datasets)

    # Threat Enrichment
    enriched = enrich_threat_data(cleaned)

    # MITRE Mapping
    mapped = map_mitre(
        enriched,
        cleaned["mitre_mapping"]
    )

    # Feature Engineering
    features = engineer_features(mapped)

    print("\nFeature Dataset Preview\n")

    print(features.head())

    print("\nGenerated Features\n")

    print(features.columns.tolist())

if __name__ == "__main__":

    from data_collection import load_data
    from data_cleaning import clean_data
    from threat_enrichment import enrich_threat_data
    from mitre_mapping import map_mitre

    # Load datasets
    datasets = load_data()

    # Clean datasets
    cleaned = clean_data(datasets)

    # Threat Enrichment
    enriched = enrich_threat_data(cleaned)

    # MITRE Mapping
    mapped = map_mitre(
        enriched,
        cleaned["mitre_mapping"]
    )

    # Feature Engineering
    features = engineer_features(mapped)

    print("\nFeature Dataset Preview\n")
    print(features.head())

    print("\nGenerated Features\n")
    print(features.columns.tolist())

    os.makedirs("outputs", exist_ok=True)

    features.to_csv(
        "outputs/engineered_features.csv",
        index=False
    )

    print("Saved outputs/engineered_features.csv")