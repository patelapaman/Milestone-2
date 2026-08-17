import pandas as pd


def map_mitre(enriched_df, mitre_df):
    """
    Map security events to the MITRE ATT&CK framework.

    Parameters
    ----------
    enriched_df : pd.DataFrame
        Enriched security events.

    mitre_df : pd.DataFrame
        MITRE ATT&CK mapping dataset.

    Returns
    -------
    pd.DataFrame
        Security events with MITRE ATT&CK information.
    """

    print("\nStarting MITRE ATT&CK Mapping...\n")

    events = enriched_df.copy()
    mitre = mitre_df.copy()

    # ---------------------------------------------------
    # Standardize Column Names
    # ---------------------------------------------------
    events.columns = (
        events.columns.str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    mitre.columns = (
        mitre.columns.str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    # ---------------------------------------------------
    # Check Required Columns
    # ---------------------------------------------------
    if "attack_name" not in events.columns:
        print("attack_name column not found.")
        return events

    if "attack_name" not in mitre.columns:
        print("attack_name column not found in MITRE dataset.")
        return events

    # ---------------------------------------------------
    # Merge with MITRE Dataset
    # ---------------------------------------------------
    mapped = events.merge(
        mitre,
        on="attack_name",
        how="left",
        suffixes=("", "_mitre")
    )

    print("✓ MITRE Mapping Completed")

    # ---------------------------------------------------
    # Fill Missing Values
    # ---------------------------------------------------
    if "technique_id" in mapped.columns:
        mapped["technique_id"] = mapped["technique_id"].fillna("Unknown")

    if "technique" in mapped.columns:
        mapped["technique"] = mapped["technique"].fillna("Unknown")

    if "tactic" in mapped.columns:
        mapped["tactic"] = mapped["tactic"].fillna("Unknown")

    # ---------------------------------------------------
    # Mapping Status
    # ---------------------------------------------------
    mapped["mitre_mapping"] = mapped["technique_id"].apply(
        lambda x: "Mapped" if x != "Unknown" else "Not Mapped"
    )

    # ---------------------------------------------------
    # MITRE Score
    # ---------------------------------------------------
    mapped["mitre_score"] = mapped["mitre_mapping"].apply(
        lambda x: 100 if x == "Mapped" else 0
    )

    print(f"Total Records : {len(mapped)}")

    print(
        f"Mapped Records : "
        f"{len(mapped[mapped['mitre_mapping']=='Mapped'])}"
    )

    print(
        f"Unmapped Records : "
        f"{len(mapped[mapped['mitre_mapping']=='Not Mapped'])}"
    )

    print("\nMITRE ATT&CK Mapping Completed Successfully\n")

    return mapped


if __name__ == "__main__":

    from data_collection import load_data
    from data_cleaning import clean_data
    from threat_enrichment import enrich_threat_data

    # Load datasets
    datasets = load_data()

    # Clean datasets
    cleaned = clean_data(datasets)

    # Enrich threats
    enriched = enrich_threat_data(cleaned)

    # MITRE dataset
    mitre_dataset = cleaned["mitre_mapping"]

    # Map MITRE
    mapped = map_mitre(enriched, mitre_dataset)

    print(mapped.head())

    print("\nColumns After Mapping:\n")

    print(mapped.columns.tolist())