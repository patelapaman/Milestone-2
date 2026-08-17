from flask import Blueprint, jsonify

from services.analytics_service import get_dashboard_analytics

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/", methods=["GET"])
def analytics():

    analytics_data = get_dashboard_analytics()

    return jsonify({
        "status": "success",
        "data": analytics_data
    })