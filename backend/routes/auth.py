from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database.mongodb import get_db
from config import Config
import jwt
import datetime

auth_bp = Blueprint("auth", __name__)

SECRET_KEY = Config.SECRET_KEY


# =====================================================
# REGISTER
# =====================================================

@auth_bp.route("/register", methods=["POST"])
def register():

    db = get_db()

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    existing = db.users.find_one({
        "email": email
    })

    if existing:
        return jsonify({
            "success": False,
            "message": "Email already exists"
        }), 400

    hashed_password = generate_password_hash(password)

    user = {

        "name": name,
        "email": email,
        "password": hashed_password,

        "role": "Security Analyst",
        "phone": "",
        "department": "SOC",
        "designation": "Cyber Security Analyst",
        "profileImage": ""

    }

    result = db.users.insert_one(user)

    return jsonify({

        "success": True,

        "message": "Registration Successful",

        "user_id": str(result.inserted_id)

    })


# =====================================================
# LOGIN
# =====================================================

@auth_bp.route("/login", methods=["POST"])
def login():

    db = get_db()

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:

        return jsonify({

            "success": False,
            "message": "Email and Password are required"

        }), 400

    user = db.users.find_one({

        "email": email

    })

    if not user:

        return jsonify({

            "success": False,
            "message": "Invalid Email"

        }), 401

    if not check_password_hash(user["password"], password):

        return jsonify({

            "success": False,
            "message": "Invalid Password"

        }), 401

    token = jwt.encode(

        {

            "user_id": str(user["_id"]),
            "email": user["email"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)

        },

        SECRET_KEY,

        algorithm="HS256"

    )

    return jsonify({

        "success": True,

        "message": "Login Successful",

        "token": token,

        "user": {

            "id": str(user["_id"]),

            "name": user["name"],

            "email": user["email"],

            "role": user.get("role", ""),

            "phone": user.get("phone", ""),

            "department": user.get("department", ""),

            "designation": user.get("designation", ""),

            "profileImage": user.get("profileImage", "")

        }

    })


# =====================================================
# LOGOUT
# =====================================================

@auth_bp.route("/logout", methods=["POST"])
def logout():

    return jsonify({

        "success": True,

        "message": "Logged Out Successfully"

    })


# =====================================================
# VERIFY TOKEN
# =====================================================

@auth_bp.route("/verify", methods=["GET"])
def verify():

    token = request.headers.get("Authorization")

    if not token:

        return jsonify({

            "success": False,
            "message": "Token Missing"

        }), 401

    try:

        token = token.replace("Bearer ", "")

        decoded = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=["HS256"]

        )

        return jsonify({

            "success": True,

            "user": decoded

        })

    except Exception:

        return jsonify({

            "success": False,
            "message": "Invalid Token"

        }), 401