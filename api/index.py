import sys
import os

# Add backend root to Python path for Vercel Serverless Functions
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Ensure writable SQLite storage on Vercel ephemeral filesystem
if os.environ.get("VERCEL"):
    os.environ["DATABASE_PATH"] = "/tmp/dossiers.db"

from app.main import app
