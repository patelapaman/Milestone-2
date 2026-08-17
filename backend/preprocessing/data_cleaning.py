import os
import pandas as pd


def clean_dataframe(df):
    """
    Clean a single DataFrame.

    Parameters:
        df (pd.DataFrame)

    Returns:
        pd.DataFrame
    """

    # Make a copy
    df = df.copy()

    # Standardize column names
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    # Remove duplicate rows
    df.drop_duplicates(inplace=True)

    # Remove rows with all null values
    df.dropna(how="all", inplace=True)

    # Remove duplicate columns
    df = df.loc[:, ~df.columns.duplicated()]

    # Clean string columns
    string_columns = df.select_dtypes(include="object").columns

    for column in string_columns:

        # Remove leading/trailing spaces
        df[column] = df[column].astype(str).str.strip()

        # Replace empty strings with NaN
        df[column] = df[column].replace("", pd.NA)

        # Fill missing values
        df[column] = df[column].fillna("Unknown")

    # Fill numeric missing values
    numeric_columns = df.select_dtypes(include=["number"]).columns

    for column in numeric_columns:
        df[column] = df[column].fillna(df[column].median())

    # Convert datetime columns
    for column in df.columns:

        if "date" in column or "time" in column:

            try:
                df[column] = pd.to_datetime(df[column])
            except Exception:
                pass

    # Normalize severity values
    if "severity" in df.columns:

        severity_mapping = {
            "critical": "Critical",
            "high": "High",
            "medium": "Medium",
            "low": "Low"
        }

        df["severity"] = (
            df["severity"]
            .astype(str)
            .str.lower()
            .map(severity_mapping)
            .fillna("Unknown")
        )

    return df


def clean_data(datasets):
    """
    Clean all datasets.

    Parameters:
        datasets (dict)

    Returns:
        dict
    """

    cleaned_data = {}

    print("\nCleaning datasets...\n")

    for name, dataframe in datasets.items():

        print(f"Cleaning {name}...")

        cleaned_data[name] = clean_dataframe(dataframe)

        print(
            f"{name}: {cleaned_data[name].shape[0]} rows × "
            f"{cleaned_data[name].shape[1]} columns"
        )

    print("\nData Cleaning Completed Successfully.")

    # ----------------------------------------
    # Save cleaned data to outputs folder
    # ----------------------------------------
    os.makedirs("outputs", exist_ok=True)

    cleaned_dataframe = pd.concat(
        cleaned_data.values(),
        ignore_index=True,
        sort=False
    )

    cleaned_dataframe.to_csv(
        "outputs/cleaned_data.csv",
        index=False
    )

    print("Saved outputs/cleaned_data.csv")

    return cleaned_data


if __name__ == "__main__":

    from data_collection import load_data

    # Load datasets
    datasets = load_data()

    # Clean datasets
    cleaned_datasets = clean_data(datasets)

    print("\nAvailable Cleaned Datasets:")

    for dataset in cleaned_datasets:
        print(f"- {dataset}")