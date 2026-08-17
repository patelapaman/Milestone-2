from flask import Blueprint, jsonify

notification_bp = Blueprint("notification", __name__)

@notification_bp.route("/", methods=["GET"])
def get_notifications():
    return jsonify([
        {
            "id": 1,
            "title": "Critical Threat",
            "message": "Malware detected",
            "time": "2 mins ago"
        },
        {
            "id": 2,
            "title": "Firewall Updated",
            "message": "Rules synchronized",
            "time": "10 mins ago"
        }
    ])