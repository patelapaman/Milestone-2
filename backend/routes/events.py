from flask import Blueprint, jsonify
from database.queries import get_security_events

events_bp = Blueprint("events", __name__)

@events_bp.route("/", methods=["GET"])
def get_events():
    return jsonify(get_security_events())