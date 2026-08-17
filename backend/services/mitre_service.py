from preprocessing.mitre_mapping import map_mitre


def run_mitre_mapping(enriched_data, cleaned_datasets):
    """
    Execute MITRE ATT&CK Mapping.
    """

    print("\n========== MITRE Mapping ==========")

    mapped_data = map_mitre(
        enriched_data,
        cleaned_datasets["mitre_mapping"]
    )

    print("MITRE Mapping Completed Successfully")

    return mapped_data