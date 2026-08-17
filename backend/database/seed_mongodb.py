"""Manually seed the bundled CSV datasets into MongoDB.

Run from backend after activating the virtual environment:
    python database/seed_mongodb.py

Use --force to replace the six source collections with the bundled CSV data.
"""
import argparse

from database.mongodb import connect_db, seed_csv_collections


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Replace source collections with CSV data")
    args = parser.parse_args()
    connect_db()
    print(seed_csv_collections(force=args.force))
