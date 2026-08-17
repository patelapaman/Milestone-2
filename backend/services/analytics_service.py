from database.queries import (
    get_dashboard_summary,
    get_high_risk_assets,
    get_features
)


def get_dashboard_analytics():
    """
    Return analytics required for the dashboard.
    """

    summary = get_dashboard_summary()

    high_risk_assets = get_high_risk_assets()

    engineered_features = get_features()

    analytics = {
        "summary": summary,
        "high_risk_assets": high_risk_assets,
        "feature_count": len(engineered_features)
    }

    return analytics