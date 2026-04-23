"""
AROHAN STT Pipeline
Speech-to-Text processing with Bhashini (primary) and Whisper (fallback)
"""

from typing import Dict, Any, Optional, List
import asyncio
import io
import numpy as np
from datetime import datetime

from src.config.settings import settings
from src.nlp.language_detection import LanguageDetector


class STTPipeline:
    """
    Speech-to-Text pipeline for processing candidate audio
    Uses Bhashini API as primary and Whisper as fallback
    """

    def __init__(self):
        """Initialize the STT pipeline"""
        self.language_detector = LanguageDetector()
        self.bhashini_client = BhashiniClient()
        self.whisper_client = WhisperClient()
        self.audio_preprocessor = AudioPreprocessor()

    async def transcribe(
        self,
        audio_data: bytes,
        language: Optional[str] = None,
        use_fallback: bool = False
    ) -> Dict[str, Any]:
        """
        Transcribe audio data to text

        Args:
            audio_data: Raw audio data bytes
            language: Optional language code (auto-detected if not provided)
            use_fallback: Force use of Whisper fallback

        Returns:
            Dictionary with transcription results
        """
        start_time = datetime.utcnow()

        try:
            # Preprocess audio
            processed_audio = await self.audio_preprocessor.process(audio_data)

            # Detect language if not provided
            if not language:
                language = await self.language_detector.detect(processed_audio)

            # Transcribe using primary or fallback
            if use_fallback:
                result = await self._transcribe_with_whisper(processed_audio, language)
                result["stt_engine"] = "whisper"
            else:
                result = await self._transcribe_with_bhashini(processed_audio, language)
                result["stt_engine"] = "bhashini"

                # Fallback to Whisper if Bhashini fails
                if result.get("error") or result.get("confidence", 0) < 0.5:
                    print("Bhashini transcription failed or low confidence, falling back to Whisper")
                    result = await self._transcribe_with_whisper(processed_audio, language)
                    result["stt_engine"] = "whisper_fallback"

            # Add metadata
            result["language_detected"] = language
            result["processing_time_ms"] = int(
                (datetime.utcnow() - start_time).total_seconds() * 1000
            )
            result["timestamp"] = datetime.utcnow().isoformat()

            return result

        except Exception as e:
            # Return error result
            return {
                "text": "",
                "confidence": 0.0,
                "error": str(e),
                "stt_engine": "error",
                "language_detected": language,
                "processing_time_ms": int(
                    (datetime.utcnow() - start_time).total_seconds() * 1000
                ),
                "timestamp": datetime.utcnow().isoformat()
            }

    async def _transcribe_with_bhashini(
        self,
        audio_data: bytes,
        language: str
    ) -> Dict[str, Any]:
        """
        Transcribe using Bhashini API

        Args:
            audio_data: Processed audio data
            language: Detected language

        Returns:
            Transcription result
        """
        try:
            result = await self.bhashini_client.transcribe(audio_data, language)

            if result.get("success"):
                return {
                    "text": result.get("transcript", ""),
                    "confidence": result.get("confidence", 0.8),
                    "words": result.get("words", []),
                    "error": None
                }
            else:
                return {
                    "text": "",
                    "confidence": 0.0,
                    "error": result.get("error", "Bhashini transcription failed")
                }

        except Exception as e:
            return {
                "text": "",
                "confidence": 0.0,
                "error": f"Bhashini error: {str(e)}"
            }

    async def _transcribe_with_whisper(
        self,
        audio_data: bytes,
        language: str
    ) -> Dict[str, Any]:
        """
        Transcribe using Whisper model

        Args:
            audio_data: Processed audio data
            language: Detected language

        Returns:
            Transcription result
        """
        try:
            result = await self.whisper_client.transcribe(audio_data, language)

            if result.get("success"):
                return {
                    "text": result.get("transcript", ""),
                    "confidence": result.get("confidence", 0.7),
                    "words": result.get("words", []),
                    "error": None
                }
            else:
                return {
                    "text": "",
                    "confidence": 0.0,
                    "error": result.get("error", "Whisper transcription failed")
                }

        except Exception as e:
            return {
                "text": "",
                "confidence": 0.0,
                "error": f"Whisper error: {str(e)}"
            }


class BhashiniClient:
    """
    Bhashini API client for Indian language STT
    """

    def __init__(self):
        """Initialize Bhashini client"""
        self.api_key = settings.BHASHINI_API_KEY
        self.user_id = settings.BHASHINI_USER_ID
        self.base_url = "https://api.bhashini.ai"

    async def transcribe(self, audio_data: bytes, language: str) -> Dict[str, Any]:
        """
        Transcribe audio using Bhashini API

        Args:
            audio_data: Audio data bytes
            language: Language code

        Returns:
            Transcription result
        """
        # In real implementation, would make HTTP request to Bhashini API
        # For now, return mock result
        await asyncio.sleep(0.5)  # Simulate API call

        return {
            "success": True,
            "transcript": "This is a sample transcription from Bhashini",
            "confidence": 0.85,
            "words": [
                {"word": "This", "start": 0.0, "end": 0.5, "confidence": 0.9},
                {"word": "is", "start": 0.5, "end": 0.7, "confidence": 0.95},
                {"word": "a", "start": 0.7, "end": 0.8, "confidence": 0.9},
                {"word": "sample", "start": 0.8, "end": 1.2, "confidence": 0.85},
                {"word": "transcription", "start": 1.2, "end": 2.0, "confidence": 0.8},
                {"word": "from", "start": 2.0, "end": 2.3, "confidence": 0.9},
                {"word": "Bhashini", "start": 2.3, "end": 2.8, "confidence": 0.85}
            ]
        }


class WhisperClient:
    """
    Whisper client for fallback STT
    """

    def __init__(self):
        """Initialize Whisper client"""
        self.model_size = "base"  # Can be "tiny", "base", "small", "medium", "large"
        self.model = None

    async def transcribe(self, audio_data: bytes, language: str) -> Dict[str, Any]:
        """
        Transcribe audio using Whisper model

        Args:
            audio_data: Audio data bytes
            language: Language code

        Returns:
            Transcription result
        """
        # In real implementation, would use OpenAI Whisper or local Whisper.cpp
        # For now, return mock result
        await asyncio.sleep(1.0)  # Simulate processing

        return {
            "success": True,
            "transcript": "This is a sample transcription from Whisper",
            "confidence": 0.75,
            "words": [
                {"word": "This", "start": 0.0, "end": 0.5, "confidence": 0.8},
                {"word": "is", "start": 0.5, "end": 0.7, "confidence": 0.85},
                {"word": "a", "start": 0.7, "end": 0.8, "confidence": 0.8},
                {"word": "sample", "start": 0.8, "end": 1.2, "confidence": 0.75},
                {"word": "transcription", "start": 1.2, "end": 2.0, "confidence": 0.7},
                {"word": "from", "start": 2.0, "end": 2.3, "confidence": 0.8},
                {"word": "Whisper", "start": 2.3, "end": 2.8, "confidence": 0.75}
            ]
        }


class AudioPreprocessor:
    """
    Audio preprocessing for STT
    """

    def __init__(self):
        """Initialize audio preprocessor"""
        self.target_sample_rate = 16000  # 16kHz for STT
        self.target_channels = 1  # Mono
        self.max_duration_seconds = settings.AUDIO_MAX_DURATION_SECONDS

    async def process(self, audio_data: bytes) -> bytes:
        """
        Process audio data for STT

        Args:
            audio_data: Raw audio data

        Returns:
            Processed audio data
        """
        # In real implementation, would:
        # 1. Convert to target sample rate
        # 2. Convert to mono if needed
        # 3. Apply noise suppression
        # 4. Normalize audio levels
        # 5. Trim silence

        # For now, return original data
        return audio_data

    async def apply_noise_suppression(self, audio_data: bytes) -> bytes:
        """
        Apply noise suppression to audio

        Args:
            audio_data: Audio data

        Returns:
            Noise-suppressed audio data
        """
        # In real implementation, would use RNNoise or similar
        return audio_data

    async def normalize_audio(self, audio_data: bytes) -> bytes:
        """
        Normalize audio levels

        Args:
            audio_data: Audio data

        Returns:
            Normalized audio data
        """
        # In real implementation, would normalize to -3dB
        return audio_data

    async def trim_silence(self, audio_data: bytes) -> bytes:
        """
        Trim silence from beginning and end

        Args:
            audio_data: Audio data

        Returns:
            Trimmed audio data
        """
        # In real implementation, would use voice activity detection
        return audio_data