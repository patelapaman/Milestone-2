from flask import Blueprint, jsonify, request
from database.mongodb import get_db
from bson.objectid import ObjectId

profile_bp = Blueprint("profile", __name__)


# ==================================================
# GET PROFILE
# ==================================================

@profile_bp.route("/<user_id>", methods=["GET"])
def get_profile(user_id):

    db = get_db()

    try:

        user = db.users.find_one({
            "_id": ObjectId(user_id)
        })

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        return jsonify({

            "success": True,

            "user": {

                "id": str(user["_id"]),
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "phone": user.get("phone", ""),
                "role": user.get("role", ""),
                "department": user.get("department", ""),
                "designation": user.get("designation", ""),
                "profileImage": user.get("profileImage", "")

            }

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "message": str(e)

        }), 500


# ==================================================
# UPDATE PROFILE
# ==================================================

@profile_bp.route("/<user_id>", methods=["PUT"])
def update_profile(user_id):

    db = get_db()

    data = request.get_json()

    try:

        db.users.update_one(

            {
                "_id": ObjectId(user_id)
            },

            {
                "$set": {

                    "name": data.get("name", ""),
                    "email": data.get("email", ""),
                    "phone": data.get("phone", ""),
                    "department": data.get("department", ""),
                    "designation": data.get("designation", ""),
                    "role": data.get("role", "")

                }

            }

        )

        user = db.users.find_one({
            "_id": ObjectId(user_id)
        })

        return jsonify({

            "success": True,

            "message": "Profile Updated Successfully",

            "user": {

                "id": str(user["_id"]),
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "phone": user.get("phone", ""),
                "department": user.get("department", ""),
                "designation": user.get("designation", ""),
                "role": user.get("role", "")

            }

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "message": str(e)

        }), 500