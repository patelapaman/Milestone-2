import os
import pandas as pd


def calculate_risk_level(score):
    """
    Convert threat score into risk level.
    """

    if score >= 90:
        return "Critical"
    elif score >= 70:
        return "High"
    elif score >= 40:
        return "Medium"
    else:
        return "Low"


def enrich_threat_data(datasets):
    """
    Threat Enrichment Pipeline

    Parameters
    ----------
    datasets : dict
        Dictionary returned from data_cleaning.py

    Returns
    -------
    pd.DataFrame
        Enriched security events
    """

    print("\nStarting Threat Enrichment...\n")

    security_events = datasets["security_events"].copy()
    vulnerabilities = datasets["vulnerabilities"].copy()
    threat_intelligence = datasets["threat_intelligence"].copy()

    # -----------------------------------------------------
    # Merge Vulnerabilities
    # -----------------------------------------------------
    if (
        "asset_id" in security_events.columns and
        "asset_id" in vulnerabilities.columns
    ):

        security_events = security_events.merge(
            vulnerabilities,
            on="asset_id",
            how="left",
            suffixes=("", "_vuln")
        )

        print("✓ Vulnerabilities merged")

    # -----------------------------------------------------
    # Merge Threat Intelligence
    # -----------------------------------------------------
    if (
        "threat_id" in security_events.columns and
        "threat_id" in threat_intelligence.columns
    ):

        security_events = security_events.merge(
            threat_intelligence,
            on="threat_id",
            how="left",
            suffixes=("", "_intel")
        )

        print("✓ Threat Intelligence merged")

    # -----------------------------------------------------
    # Threat Score
    # -----------------------------------------------------
    if "cvss_score" in security_events.columns:

        security_events["threat_score"] = (
            security_events["cvss_score"] * 10
        ).clip(upper=100)

    else:

        security_events["threat_score"] = 50

    # -----------------------------------------------------
    # Risk Level
    # -----------------------------------------------------
    security_events["risk_level"] = security_events[
        "threat_score"
    ].apply(calculate_risk_level)

    # -----------------------------------------------------
    # IOC Match
    # -----------------------------------------------------
    if "ioc" in security_events.columns:

        security_events["ioc_match"] = security_events["ioc"].notna()

    else:

        security_events["ioc_match"] = False

    # -----------------------------------------------------
    # Known Exploit
    # -----------------------------------------------------
    if "exploit_available" in security_events.columns:

        security_events["known_exploit"] = (
            security_events["exploit_available"]
            .fillna(False)
        )

    else:

        security_events["known_exploit"] = False

    # -----------------------------------------------------
    # Enrichment Status
    # -----------------------------------------------------
    security_events["enrichment_status"] = "Completed"

    print("\nThreat Enrichment Completed Successfully")
    print(f"Total Records : {len(security_events)}")

    # -----------------------------------------------------
    # Save Output
    # -----------------------------------------------------
    os.makedirs("outputs", exist_ok=True)

    security_events.to_csv(
        "outputs/enriched_data.csv",
        index=False
    )

    print("Saved outputs/enriched_data.csv")

    return security_events


if __name__ == "__main__":

    from data_collection import load_data
    from data_cleaning import clean_data

    # Load datasets
    datasets = load_data()

    # Clean datasets
    cleaned = clean_data(datasets)

    # Enrich threats
    enriched = enrich_threat_data(cleaned)

    # Preview
    print("\nEnriched Dataset Preview\n")
    print(enriched.head())