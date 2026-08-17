from flask import Blueprint, jsonify
from database.queries import get_threats

threats_bp = Blueprint("threats", __name__)

@threats_bp.route("/", methods=["GET"])
def threats():
    data = get_threats()

    return jsonify({
        "status": "success",
        "count": len(data),
        "data": data
    })