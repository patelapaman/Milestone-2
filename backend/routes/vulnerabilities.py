from flask import Blueprint, jsonify
from database.queries import get_vulnerabilities

vulnerabilities_bp = Blueprint("vulnerabilities", __name__)


@vulnerabilities_bp.route("/", methods=["GET"])
def vulnerabilities():

    data = get_vulnerabilities()

    return jsonify({
        "status": "success",
        "count": len(data),
        "data": data
    })