import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
MONGO_DB = os.getenv("MONGO_DB", os.getenv("DATABASE_NAME", "ThreatDetectionDB"))
MODEL_VERSION = os.getenv("MODEL_VERSION", "IF_SHARED_V2")
CORS_ORIGINS = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if x.strip()]
