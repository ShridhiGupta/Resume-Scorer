import os
from typing import Optional

class LLMConfig:
    """Configuration for local LLM server"""
    
    def __init__(self):
        self.server_type = os.getenv("LLM_SERVER_TYPE", "ollama")
        self.base_url = os.getenv("LLM_BASE_URL", self._get_default_url())
        self.model = os.getenv("LLM_MODEL", self._get_default_model())
        self.timeout = int(os.getenv("LLM_TIMEOUT", "30"))
        self.temperature = float(os.getenv("LLM_TEMPERATURE", "0.3"))
        self.max_tokens = int(os.getenv("LLM_MAX_TOKENS", "1000"))
        
    def _get_default_url(self) -> str:
        """Get default URL based on server type"""
        defaults = {
            "ollama": "http://localhost:11434",
            "llamacpp": "http://localhost:8080", 
            "huggingface": "http://localhost:5000"
        }
        return defaults.get(self.server_type.lower(), "http://localhost:11434")
    
    def _get_default_model(self) -> str:
        """Get default model based on server type"""
        defaults = {
            "ollama": "llama3.2",
            "llamacpp": "default",
            "huggingface": "microsoft/DialoGPT-medium"
        }
        return defaults.get(self.server_type.lower(), "llama3.2")
    
    def is_enabled(self) -> bool:
        """Check if LLM enhancement is enabled"""
        return os.getenv("ENABLE_LLM", "true").lower() == "true"
    
    def get_config_dict(self) -> dict:
        """Get configuration as dictionary"""
        return {
            "server_type": self.server_type,
            "base_url": self.base_url,
            "model": self.model,
            "timeout": self.timeout,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "enabled": self.is_enabled()
        }


# Global configuration instance
llm_config = LLMConfig()
