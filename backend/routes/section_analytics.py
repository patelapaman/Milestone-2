from flask import Blueprint, jsonify

from services.section_analytics_service import get_section_analytics

section_analytics_bp = Blueprint("section_analytics", __name__)


@section_analytics_bp.route("/", methods=["GET"])
def section_analytics():
    return jsonify({
        "status": "success",
        "data": get_section_analytics(),
    })
