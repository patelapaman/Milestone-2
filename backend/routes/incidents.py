from flask import Blueprint, jsonify
from database.queries import get_incidents

incidents_bp = Blueprint("incidents", __name__)


@incidents_bp.route("/", methods=["GET"])
def incidents():

    data = get_incidents()

    return jsonify({
        "status": "success",
        "count": len(data),
        "data": data
    })