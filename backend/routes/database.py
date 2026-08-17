from flask import Blueprint, jsonify, request

from database.mongodb import get_db, is_mongodb_connected, seed_csv_collections


database_bp = Blueprint("database", __name__)


@database_bp.route("/status", methods=["GET"])
def database_status():
    db = get_db()
    collections = {}
    for name in db.list_collection_names():
        collections[name] = db[name].count_documents({})
    return jsonify({
        "status": "success",
        "connected": is_mongodb_connected(),
        "database": db.name,
        "collections": collections,
    })


@database_bp.route("/seed", methods=["POST"])
def database_seed():
    force = request.args.get("force", "false").lower() == "true"
    counts = seed_csv_collections(force=force)
    return jsonify({
        "status": "success",
        "message": "Bundled datasets are stored in MongoDB.",
        "force": force,
        "collections": counts,
    })
