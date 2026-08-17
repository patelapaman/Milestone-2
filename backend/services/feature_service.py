from preprocessing.feature_engineering import engineer_features


def run_feature_engineering(mapped_data):
    """
    Execute Feature Engineering.
    """

    print("\n========== Feature Engineering ==========")

    feature_data = engineer_features(mapped_data)

    print("Feature Engineering Completed Successfully")

    return feature_data