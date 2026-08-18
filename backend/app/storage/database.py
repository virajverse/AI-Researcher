import aiosqlite
import json
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

class Database:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or settings.DATABASE_PATH
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)

    async def init_db(self):
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                CREATE TABLE IF NOT EXISTS dossiers (
                    id TEXT PRIMARY KEY,
                    company_name TEXT NOT NULL,
                    target_url TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    llm_model TEXT,
                    duration_seconds REAL,
                    confidence_score INTEGER,
                    report_json TEXT NOT NULL
                )
            """)
            await db.execute("""
                CREATE INDEX IF NOT EXISTS idx_company_name ON dossiers(company_name);
            """)
            await db.commit()
            logger.info("Forensic Database initialized successfully.")

    async def save_dossier(self, dossier_id: str, report_data: Dict[str, Any]):
        await self.init_db()
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT OR REPLACE INTO dossiers (
                    id, company_name, target_url, created_at, llm_model, duration_seconds, confidence_score, report_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                dossier_id,
                report_data.get("company_name", "Unknown"),
                report_data.get("target_url"),
                report_data.get("created_at"),
                report_data.get("llm_model_used"),
                report_data.get("research_duration_seconds", 0.0),
                report_data.get("confidence_score", 95),
                json.dumps(report_data)
            ))
            await db.commit()

    async def get_dossier(self, dossier_id: str) -> Optional[Dict[str, Any]]:
        await self.init_db()
        async with aiosqlite.connect(self.db_path) as db:
            async with db.execute("SELECT report_json FROM dossiers WHERE id = ?", (dossier_id,)) as cursor:
                row = await cursor.fetchone()
                if row:
                    return json.loads(row[0])
        return None

    async def list_recent_dossiers(self, limit: int = 20) -> List[Dict[str, Any]]:
        await self.init_db()
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("""
                SELECT id, company_name, target_url, created_at, llm_model, confidence_score, duration_seconds 
                FROM dossiers 
                ORDER BY created_at DESC 
                LIMIT ?
            """, (limit,)) as cursor:
                rows = await cursor.fetchall()
                return [dict(r) for r in rows]

    async def delete_dossier(self, dossier_id: str) -> bool:
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("DELETE FROM dossiers WHERE id = ?", (dossier_id,))
            await db.commit()
            return True

db = Database()
