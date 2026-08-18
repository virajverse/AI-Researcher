import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from typing import List, Union

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings(BaseSettings):
    NVIDIA_API_KEY: str = os.getenv("NVIDIA_API_KEY", "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")
    NVIDIA_BASE_URL: str = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    DEFAULT_LLM_MODEL: str = os.getenv("DEFAULT_LLM_MODEL", "meta/llama-3.3-70b-instruct")
    REASONING_LLM_MODEL: str = os.getenv("REASONING_LLM_MODEL", "meta/llama-3.3-70b-instruct")
    FAST_LLM_MODEL: str = os.getenv("FAST_LLM_MODEL", "meta/llama-3.1-8b-instruct")

    FIRECRAWL_API_KEY: str = os.getenv("FIRECRAWL_API_KEY", "")
    FIRECRAWL_API_URL: str = os.getenv("FIRECRAWL_API_URL", "https://api.firecrawl.dev/v1")

    HEADLESS: bool = True
    PLAYWRIGHT_TIMEOUT: int = 20000

    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS_RAW: str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")
    DATABASE_PATH: str = str(BASE_DIR / "app" / "storage" / "researcher.db")

    @property
    def CORS_ORIGINS(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS_RAW.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
