"""
AROHAN Language Detection
Detects language from audio input for STT routing
"""

from typing import Dict, Any, Optional
import asyncio

from src.config.settings import settings


class LanguageDetector:
    """
    Language detector for audio input
    Supports 22 Indian languages
    """

    def __init__(self):
        """Initialize language detector"""
        self.supported_languages = {
            "hi-IN": "Hindi",
            "en-IN": "English (India)",
            "ta-IN": "Tamil",
            "te-IN": "Telugu",
            "bn-IN": "Bengali",
            "mr-IN": "Marathi",
            "gu-IN": "Gujarati",
            "kn-IN": "Kannada",
            "ml-IN": "Malayalam",
            "pa-IN": "Punjabi",
            "or-IN": "Odia",
            "as-IN": "Assamese",
            "ur-IN": "Urdu",
            "sd-IN": "Sindhi",
            "ne-IN": "Nepali",
            "sa-IN": "Sanskrit",
            "mai-IN": "Maithili",
            "brx-IN": "Bodo",
            "doi-IN": "Dogri",
            "kok-IN": "Konkani",
            "mni-IN": "Manipuri",
            "sat-IN": "Santali"
        }

        self.language_patterns = {
            "hi-IN": ["namaste", "dhanyavad", "kripya", "main", "hai", "hoga"],
            "en-IN": ["hello", "thank", "please", "yes", "no", "okay"],
            "ta-IN": ["vanakkam", "nandri", "thappu", "illai", "aamam"],
            "te-IN": ["namaskaram", "dhanyavadalu", "dayachesi", "ledu", "avunu"],
            "bn-IN": ["namaskar", "dhonnobad", "doya", "na", "ha"],
            "mr-IN": ["namaskar", "dhanyavad", "krupa", "nahi", "ho"],
            "gu-IN": ["namaste", "aabhar", "kripa", "nathi", "chhe"],
            "kn-IN": ["namaskara", "dhanyavadagalu", "dayavittu", "illa", "ide"],
            "ml-IN": ["namaskaram", "nanni", "dayavayi", "illa", "unde"],
            "pa-IN": ["sat sri akal", "dhannavaad", "kirpa", "nahi", "ha"],
            "or-IN": ["namaskar", "dhanyabaad", "dayakru", "na", "ha"],
            "as-IN": ["nomoskar", "dhonyobad", "doya", "noi", "hwa"],
            "ur-IN": ["adaab", "shukriya", "meherbani", "nahi", "ha"],
            "sd-IN": ["namaste", "meharbani", "kripa", "nai", "ha"],
            "ne-IN": ["namaste", "dhanyabad", "kripaya", "hoina", "ho"],
            "sa-IN": ["namaste", "dhanyavad", "kripaya", "na", "asti"],
            "mai-IN": ["pranam", "dhanyavad", "kripaya", "nai", "ha"],
            "brx-IN": ["namaskar", "khorma", "arzu", "no", "ha"],
            "doi-IN": ["namaskar", "dhanyavad", "kripa", "nai", "ha"],
            "kok-IN": ["namaskar", "devos", "upkar", "nai", "ha"],
            "mni-IN": ["khunthai", "thoknaba", "yengnaba", "natta", "haye"],
            "sat-IN": ["johar", "dhanyabad", "upkar", "na", "ha"]
        }

    async def detect(self, audio_data: bytes) -> str:
        """
        Detect language from audio data

        Args:
            audio_data: Audio data bytes

        Returns:
            Detected language code (default: "hi-IN")
        """
        try:
            # In real implementation, would use:
            # 1. FastLangDetect on first 5 seconds
            # 2. Acoustic model analysis
            # 3. Language identification model

            # For now, return default language
            await asyncio.sleep(0.1)  # Simulate processing

            return "hi-IN"  # Default to Hindi

        except Exception as e:
            print(f"Language detection error: {e}")
            return "hi-IN"  # Fallback to Hindi

    async def detect_from_text(self, text: str) -> str:
        """
        Detect language from text transcript

        Args:
            text: Transcribed text

        Returns:
            Detected language code
        """
        text_lower = text.lower()

        # Check for language-specific patterns
        language_scores = {}

        for lang_code, patterns in self.language_patterns.items():
            score = 0
            for pattern in patterns:
                if pattern in text_lower:
                    score += 1
            language_scores[lang_code] = score

        # Return language with highest score
        if language_scores:
            best_language = max(language_scores.items(), key=lambda x: x[1])
            if best_language[1] > 0:
                return best_language[0]

        # Default to Hindi if no patterns found
        return "hi-IN"

    def get_language_name(self, language_code: str) -> str:
        """
        Get language name from code

        Args:
            language_code: Language code

        Returns:
            Language name
        """
        return self.supported_languages.get(language_code, "Unknown")

    def is_supported(self, language_code: str) -> bool:
        """
        Check if language is supported

        Args:
            language_code: Language code

        Returns:
            True if supported
        """
        return language_code in self.supported_languages

    def get_supported_languages(self) -> Dict[str, str]:
        """
        Get all supported languages

        Returns:
            Dictionary of language codes and names
        """
        return self.supported_languages.copy()