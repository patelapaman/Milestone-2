from preprocessing.data_collection import load_data
from preprocessing.data_cleaning import clean_data

from services.enrichment_service import run_enrichment
from services.mitre_service import run_mitre_mapping
from services.feature_service import run_feature_engineering

from database.insert_data import insert_all_data


def run_pipeline():
    """
    Complete AI Threat Detection Pipeline.
    """

    print("\n======================================")
    print(" AI Threat Detection Pipeline Started ")
    print("======================================\n")

    # ------------------------------------
    # Step 1 : Data Collection
    # ------------------------------------
    print("Step 1 : Data Collection")

    datasets = load_data()

    # ------------------------------------
    # Step 2 : Data Cleaning
    # ------------------------------------
    print("\nStep 2 : Data Cleaning")

    cleaned = clean_data(datasets)

    # ------------------------------------
    # Step 3 : Threat Enrichment
    # ------------------------------------
    print("\nStep 3 : Threat Enrichment")

    enriched = run_enrichment(cleaned)

    # ------------------------------------
    # Step 4 : MITRE Mapping
    # ------------------------------------
    print("\nStep 4 : MITRE Mapping")

    mapped = run_mitre_mapping(
        enriched,
        cleaned
    )

    # ------------------------------------
    # Step 5 : Feature Engineering
    # ------------------------------------
    print("\nStep 5 : Feature Engineering")

    features = run_feature_engineering(
        mapped
    )

    # ------------------------------------
    # Step 6 : Store in MongoDB
    # ------------------------------------
    print("\nStep 6 : MongoDB Storage")

    insert_all_data(
        cleaned,
        enriched,
        mapped,
        features
    )

    print("\n======================================")
    print(" Pipeline Completed Successfully ")
    print("======================================\n")

    return {
        "cleaned": cleaned,
        "enriched": enriched,
        "mapped": mapped,
        "features": features
    }


if __name__ == "__main__":

    run_pipeline()