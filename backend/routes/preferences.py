from flask import Blueprint, jsonify, request

preferences_bp = Blueprint("preferences", __name__)

preferences = {
    "theme": "dark",
    "emailAlerts": True
}

@preferences_bp.route("/", methods=["GET"])
def get_preferences():
    return jsonify(preferences)

@preferences_bp.route("/", methods=["PUT"])
def update_preferences():
    global preferences
    data = request.get_json()
    preferences.update(data)
    return jsonify(preferences)