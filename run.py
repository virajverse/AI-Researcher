import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"
VENV_PYTHON = BACKEND_DIR / "venv" / ("Scripts" if os.name == "nt" else "bin") / "python"

def main():
    print("=================================================================")
    print("  🚀 VIRAJVERSE — FORENSIC AI COMPANY RESEARCHER (PART 6)       ")
    print("=================================================================")
    print("  • Intelligence Engine: NVIDIA NIM (meta/llama-3.1-70b-instruct)")
    print("  • Scrapers: Firecrawl MCP + Playwright Headless Browser        ")
    print("  • Architecture: 7-Agent Specialized Forensic Swarm             ")
    print("=================================================================\n")

    # Start FastAPI Backend
    print("[1/2] Starting FastAPI Backend on http://localhost:8000...")
    backend_proc = subprocess.Popen(
        [str(VENV_PYTHON), "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
        cwd=str(BACKEND_DIR)
    )

    time.sleep(2)

    # Start Vite Frontend
    print("[2/2] Starting Vite Frontend on http://localhost:5173...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev", "--", "--host"],
        cwd=str(FRONTEND_DIR)
    )

    print("\n✅ System Online! Open your browser at:")
    print("👉 http://localhost:5173\n")
    print("Press Ctrl+C to stop all servers.\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Done.")

if __name__ == "__main__":
    main()
