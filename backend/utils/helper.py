import pandas as pd


def dataframe_info(df):
    """
    Display DataFrame information.
    """

    print("\nShape :", df.shape)

    print("\nColumns :")

    print(df.columns.tolist())

    print("\nMissing Values :")

    print(df.isnull().sum())


def save_dataframe(df, filename):
    """
    Save DataFrame as CSV.
    """

    df.to_csv(filename, index=False)

    print(f"Saved : {filename}")


def calculate_percentage(part, total):
    """
    Calculate percentage.
    """

    if total == 0:
        return 0

    return round((part / total) * 100, 2)


def normalize_column_names(df):
    """
    Convert columns into lowercase format.
    """

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    return df