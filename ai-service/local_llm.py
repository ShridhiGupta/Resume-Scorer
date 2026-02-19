import json
import os
import requests
from typing import Dict, Optional, Union
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LocalLLMClient:
    """Client for interacting with local LLM servers (Ollama, llama.cpp, HuggingFace)"""
    
    def __init__(self, server_type: str = "ollama", base_url: str = None, model: str = None):
        self.server_type = server_type.lower()
        self.base_url = base_url or self._get_default_url()
        self.model = model or self._get_default_model()
        
    def _get_default_url(self) -> str:
        """Get default URL based on server type"""
        defaults = {
            "ollama": "http://localhost:11434",
            "llamacpp": "http://localhost:8080",
            "huggingface": "http://localhost:5000"
        }
        return defaults.get(self.server_type, "http://localhost:11434")
    
    def _get_default_model(self) -> str:
        """Get default model based on server type"""
        defaults = {
            "ollama": "llama3.2",
            "llamacpp": "default",
            "huggingface": "microsoft/DialoGPT-medium"
        }
        return defaults.get(self.server_type, "llama3.2")
    
    def test_connection(self) -> bool:
        """Test if the LLM server is accessible"""
        try:
            if self.server_type == "ollama":
                response = requests.get(f"{self.base_url}/api/tags", timeout=5)
                return response.status_code == 200
            elif self.server_type == "llamacpp":
                response = requests.get(f"{self.base_url}/health", timeout=5)
                return response.status_code == 200
            elif self.server_type == "huggingface":
                response = requests.get(f"{self.base_url}/", timeout=5)
                return response.status_code == 200
        except Exception as e:
            logger.warning(f"Failed to connect to {self.server_type} server: {e}")
        return False
    
    def generate_analysis(self, resume_text: str, job_description: str) -> Optional[Dict]:
        """Generate enhanced analysis using local LLM"""
        try:
            prompt = self._create_analysis_prompt(resume_text, job_description)
            
            if self.server_type == "ollama":
                return self._call_ollama(prompt)
            elif self.server_type == "llamacpp":
                return self._call_llamacpp(prompt)
            elif self.server_type == "huggingface":
                return self._call_huggingface(prompt)
            else:
                logger.error(f"Unsupported server type: {self.server_type}")
                return None
                
        except Exception as e:
            logger.error(f"Error generating LLM analysis: {e}")
            return None
    
    def _create_analysis_prompt(self, resume_text: str, job_description: str) -> str:
        """Create a structured prompt for resume analysis"""
        prompt = f"""
You are an expert HR analyst. Analyze the following resume against the job description and provide detailed feedback.

JOB DESCRIPTION:
{job_description}

RESUME:
{resume_text}

Please provide analysis in the following JSON format:
{{
    "llm_analysis": {{
        "overall_assessment": "Brief overall assessment of candidate fit",
        "key_strengths": ["List of 3-5 key strengths"],
        "improvement_areas": ["List of 3-5 areas for improvement"],
        "recommendation_score": 85,
        "detailed_feedback": "Detailed paragraph of feedback"
    }}
}}

Focus on:
- Skills alignment
- Experience relevance  
- Education match
- Overall candidate potential
Respond only with valid JSON.
"""
        return prompt
    
    def _call_ollama(self, prompt: str) -> Optional[Dict]:
        """Call Ollama API"""
        try:
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "top_p": 0.9,
                    "max_tokens": 1000
                }
            }
            
            response = requests.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                llm_response = result.get("response", "")
                # Extract JSON from response
                try:
                    json_start = llm_response.find("{")
                    json_end = llm_response.rfind("}") + 1
                    if json_start != -1 and json_end > json_start:
                        json_str = llm_response[json_start:json_end]
                        return json.loads(json_str)
                except json.JSONDecodeError:
                    logger.warning("Failed to parse JSON from Ollama response")
                    
            return None
            
        except Exception as e:
            logger.error(f"Ollama API error: {e}")
            return None
    
    def _call_llamacpp(self, prompt: str) -> Optional[Dict]:
        """Call llama.cpp API"""
        try:
            payload = {
                "prompt": prompt,
                "n_predict": 1000,
                "temperature": 0.3,
                "top_p": 0.9,
                "stop": ["</s>"]
            }
            
            response = requests.post(
                f"{self.base_url}/completion",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                llm_response = result.get("content", "")
                # Extract JSON from response
                try:
                    json_start = llm_response.find("{")
                    json_end = llm_response.rfind("}") + 1
                    if json_start != -1 and json_end > json_start:
                        json_str = llm_response[json_start:json_end]
                        return json.loads(json_str)
                except json.JSONDecodeError:
                    logger.warning("Failed to parse JSON from llama.cpp response")
                    
            return None
            
        except Exception as e:
            logger.error(f"llama.cpp API error: {e}")
            return None
    
    def _call_huggingface(self, prompt: str) -> Optional[Dict]:
        """Call HuggingFace inference API"""
        try:
            payload = {
                "inputs": prompt,
                "parameters": {
                    "temperature": 0.3,
                    "max_new_tokens": 1000,
                    "return_full_text": False
                }
            }
            
            response = requests.post(
                f"{self.base_url}/generate",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    llm_response = result[0].get("generated_text", "")
                    # Extract JSON from response
                    try:
                        json_start = llm_response.find("{")
                        json_end = llm_response.rfind("}") + 1
                        if json_start != -1 and json_end > json_start:
                            json_str = llm_response[json_start:json_end]
                            return json.loads(json_str)
                    except json.JSONDecodeError:
                        logger.warning("Failed to parse JSON from HuggingFace response")
                        
            return None
            
        except Exception as e:
            logger.error(f"HuggingFace API error: {e}")
            return None


def get_llm_client() -> Optional[LocalLLMClient]:
    """Get configured LLM client from environment variables"""
    server_type = os.getenv("LLM_SERVER_TYPE", "ollama")
    base_url = os.getenv("LLM_BASE_URL")
    model = os.getenv("LLM_MODEL")
    
    client = LocalLLMClient(server_type, base_url, model)
    
    if client.test_connection():
        logger.info(f"Connected to {server_type} LLM server at {client.base_url}")
        return client
    else:
        logger.warning(f"Could not connect to {server_type} LLM server")
        return None
