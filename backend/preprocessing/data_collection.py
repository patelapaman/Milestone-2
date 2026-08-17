import os
import pandas as pd


# Folder containing all CSV files
DATA_FOLDER = "data"


def load_csv(filename):
    """
    Load a CSV file into a Pandas DataFrame.

    Args:
        filename (str): Name of the CSV file.

    Returns:
        pd.DataFrame
    """
    file_path = os.path.join(DATA_FOLDER, filename)

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{filename} not found in {DATA_FOLDER}")

    print(f"Loading {filename}...")

    return pd.read_csv(file_path)


def load_data():
    """
    Load all datasets required for the Threat Detection Dashboard.

    Returns:
        dict: Dictionary containing all DataFrames.
    """

    datasets = {
        "assets": load_csv("assets.csv"),
        "vulnerabilities": load_csv("vulnerabilities.csv"),
        "security_events": load_csv("security_events.csv"),
        "incident_history": load_csv("incident_history.csv"),
        "threat_intelligence": load_csv("threat_intelligence.csv"),
        "mitre_mapping": load_csv("mitre_attack_mapping.csv")
    }

    print("\nDatasets Loaded Successfully\n")

    for name, df in datasets.items():
        print(f"{name}: {df.shape[0]} rows × {df.shape[1]} columns")

    return datasets


if __name__ == "__main__":

    data = load_data()

    print("\nAvailable datasets:")

    for dataset in data:
        print("-", dataset)