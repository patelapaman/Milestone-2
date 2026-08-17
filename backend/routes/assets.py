from flask import Blueprint, jsonify
from database.queries import get_assets

assets_bp = Blueprint("assets", __name__)


@assets_bp.route("/", methods=["GET"])
def assets():

    return jsonify({
        "status": "success",
        "count": len(get_assets()),
        "data": get_assets()
    })