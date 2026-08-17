from flask import Blueprint, jsonify

from database.queries import (
    get_dashboard_summary,
    get_high_risk_assets,
    get_features
)

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/", methods=["GET"])
def dashboard():

    summary = get_dashboard_summary()

    features = get_features()

    high_risk = get_high_risk_assets()

    dashboard_data = {
        "summary": summary,
        "high_risk_assets": high_risk,
        "feature_count": len(features)
    }

    return jsonify({
        "status": "success",
        "data": dashboard_data
    })