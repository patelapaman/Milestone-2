from database.mongodb import get_db


def insert_collection(collection_name, dataframe):
    """
    Insert a dataframe into MongoDB.

    Parameters
    ----------
    collection_name : str
    dataframe : pandas.DataFrame
    """

    db = get_db()

    collection = db[collection_name]

    collection.delete_many({})

    records = dataframe.to_dict("records")

    if records:
        collection.insert_many(records)

    print(f"{len(records)} records inserted into '{collection_name}'")


def insert_all_data(cleaned,
                    enriched,
                    mapped,
                    features):
    """
    Store all processed datasets.
    """

    insert_collection("assets", cleaned["assets"])

    insert_collection(
        "vulnerabilities",
        cleaned["vulnerabilities"]
    )

    insert_collection(
        "security_events",
        cleaned["security_events"]
    )

    insert_collection(
        "incident_history",
        cleaned["incident_history"]
    )

    insert_collection(
        "threat_intelligence",
        cleaned["threat_intelligence"]
    )

    insert_collection(
        "mitre_mapping",
        cleaned["mitre_mapping"]
    )

    insert_collection(
        "enriched_events",
        enriched
    )

    insert_collection(
        "mapped_events",
        mapped
    )

    insert_collection(
        "engineered_features",
        features
    )

    print("\nAll datasets stored successfully.")