import os
from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from database.mongodb import connect_db

# Existing Blueprints
from routes.assets import assets_bp
from routes.vulnerabilities import vulnerabilities_bp
from routes.threats import threats_bp
from routes.incidents import incidents_bp
from routes.analytics import analytics_bp
from routes.dashboard import dashboard_bp
from routes.events import events_bp
from routes.database import database_bp

# New Blueprints
from routes.profile import profile_bp
from routes.notifications import notification_bp
from routes.preferences import preferences_bp
from routes.auth import auth_bp
from routes.milestone2 import milestone2_bp
from routes.section_analytics import section_analytics_bp
from milestone2_engine.runtime import runtime as milestone2_runtime

# Create outputs folder
OUTPUT_FOLDER = "outputs"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS
    CORS(app)

    # Connect MongoDB
    connect_db(app)

    # Register Existing APIs
    app.register_blueprint(assets_bp, url_prefix="/api/assets")
    app.register_blueprint(vulnerabilities_bp, url_prefix="/api/vulnerabilities")
    app.register_blueprint(threats_bp, url_prefix="/api/threats")
    app.register_blueprint(incidents_bp, url_prefix="/api/incidents")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(database_bp, url_prefix="/api/database")

    # Register New APIs
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(notification_bp, url_prefix="/api/notifications")
    app.register_blueprint(preferences_bp, url_prefix="/api/preferences")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(milestone2_bp, url_prefix="/api/milestone2")
    app.register_blueprint(section_analytics_bp, url_prefix="/api/section-analytics")

    # Initialize the Milestone 2 ML engine. If the local model cannot be loaded,
    # the API remains available and the /api/milestone2/health endpoint reports the error.
    try:
        milestone2_runtime.initialize()
        print("Milestone 2 ML engine initialized successfully")
    except Exception as exc:
        print(f"Milestone 2 ML engine initialization deferred: {exc}")

    @app.route("/")
    def home():
        return jsonify({
            "project": "AI-Assisted Threat Detection Dashboard",
            "version": "1.0.0",
            "status": "Running"
        })

    @app.route("/health")
    def health():
        from database.mongodb import get_db, is_mongodb_connected
        db = get_db()
        database_status = "MongoDB Connected" if is_mongodb_connected() else "Local demo storage"
        return jsonify({
            "status": "Healthy",
            "database": database_status,
            "database_name": db.name if db is not None else None,
            "milestone2": "Ready" if milestone2_runtime.ready else "Unavailable"
        }), 200

    @app.route("/api/pipeline/run")
    def run_pipeline():
        return jsonify({
            "message": "Pipeline executed successfully."
        })

    # Print all registered routes
    print("\n========== REGISTERED ROUTES ==========")
    print(app.url_map)
    print("=======================================\n")

    return app


app = create_app()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )