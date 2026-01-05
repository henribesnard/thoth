"""LLM client wrapper for DeepSeek API."""
from typing import List, Dict, Optional
import httpx

from app.core.config import settings


class DeepSeekClient:
    """Async client for DeepSeek chat completions."""

    def __init__(self) -> None:
        self.api_key = settings.DEEPSEEK_API_KEY
        self.base_url = settings.DEEPSEEK_API_BASE.rstrip("/")
        self.model = settings.DEEPSEEK_MODEL

    async def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
        model: Optional[str] = None,
    ) -> str:
        """Call DeepSeek chat completions and return the assistant content."""
        payload = {
            "model": model or self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        timeout = httpx.Timeout(settings.DEEPSEEK_TIMEOUT, read=settings.DEEPSEEK_TIMEOUT)
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
            )
            if response.status_code != 200:
                raise RuntimeError(f"DeepSeek API error: {response.text}")

            result = response.json()
            return result["choices"][0]["message"]["content"]
