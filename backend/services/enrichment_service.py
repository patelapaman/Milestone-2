from preprocessing.threat_enrichment import enrich_threat_data


def run_enrichment(cleaned_datasets):
    """
    Execute Threat Enrichment.
    """

    print("\n========== Threat Enrichment ==========")

    enriched_data = enrich_threat_data(cleaned_datasets)

    print("Threat Enrichment Completed Successfully")

    return enriched_data