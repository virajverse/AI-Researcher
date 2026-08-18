import sys
import os

# Add all search paths for Vercel Serverless Function runtime
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.join(root_dir, "backend")

for p in [backend_dir, root_dir, current_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Writable SQLite path for ephemeral serverless filesystem
if os.environ.get("VERCEL"):
    os.environ["DATABASE_PATH"] = "/tmp/dossiers.db"

try:
    from app.main import app
except ImportError:
    from backend.app.main import app
