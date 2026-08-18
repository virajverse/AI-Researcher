import json
import asyncio
import urllib.request
import urllib.error
import logging
from typing import Optional, Dict, Any, AsyncGenerator
from app.config import settings

logger = logging.getLogger(__name__)

class NvidiaLLMClient:
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        self.api_key = api_key or settings.NVIDIA_API_KEY
        self.base_url = (base_url or settings.NVIDIA_BASE_URL).rstrip("/")
        self.default_model = settings.DEFAULT_LLM_MODEL or "meta/llama-3.1-8b-instruct"
        self.fast_model = settings.FAST_LLM_MODEL or "meta/llama-3.1-8b-instruct"
        self._semaphore = asyncio.Semaphore(4)

    def _sync_post(self, payload: Dict[str, Any], timeout: float = 75.0) -> str:
        """Robust synchronous POST with urllib with generous 75s timeout."""
        url = f"{self.base_url}/chat/completions"
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "User-Agent": "VirajVerse-ForensicAI/1.0"
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                return result["choices"][0]["message"]["content"]
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            logger.error(f"NVIDIA API HTTPError {e.code}: {err_body}")
            raise RuntimeError(f"NVIDIA API Error {e.code}: {err_body}")
        except Exception as e:
            logger.error(f"NVIDIA API request failed: {e}")
            raise

    async def complete(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 4096
    ) -> str:
        target_model = model or self.default_model
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": target_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        async with self._semaphore:
            try:
                return await asyncio.to_thread(self._sync_post, payload, 35.0)
            except Exception as e:
                if target_model != self.fast_model:
                    logger.info(f"Retrying with fast fallback model {self.fast_model}...")
                    payload["model"] = self.fast_model
                    return await asyncio.to_thread(self._sync_post, payload, 25.0)
                raise

    async def complete_structured(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        enhanced_system = (
            (system_prompt or "You are an elite forensic intelligence research agent.")
            + "\nCRITICAL: Output ONLY a valid JSON object matching the requested schema. No code fences, no extra text, no markdown preamble."
        )

        try:
            raw = await self.complete(
                prompt=prompt,
                system_prompt=enhanced_system,
                model=model,
                temperature=0.1
            )
        except Exception as e:
            logger.error(f"LLM completion failed in complete_structured: {e}")
            return {}

        cleaned = raw.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            import re
            json_match = re.search(r"(\{.*\})", cleaned, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group(1))
                except Exception:
                    pass
            logger.warning(f"Could not parse JSON from output: {raw[:200]}")
            return {"raw_text": raw}

nvidia_client = NvidiaLLMClient()
