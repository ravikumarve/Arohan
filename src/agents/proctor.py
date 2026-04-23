"""
AROHAN Proctor Agent
Conducts adaptive voice interviews with candidates
"""

from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import random

from src.agents.state import (
    CandidateSessionState,
    InterviewState,
    TranscriptSegment,
    QuestionResponse,
    ProctorState
)
from src.nlp.stt import STTPipeline
from src.nlp.language_detection import LanguageDetector


class ProctorAgent:
    """
    Proctor Agent - Conducts adaptive 5-minute voice interviews
    Handles interruptions, colloquialisms, and adaptive questioning
    """

    def __init__(self):
        """Initialize the Proctor agent"""
        self.stt_pipeline = STTPipeline()
        self.language_detector = LanguageDetector()
        self.question_banks = self._load_question_banks()
        self.current_state: Optional[ProctorState] = None

    def _load_question_banks(self) -> Dict[str, List[Dict[str, Any]]]:
        """Load role-specific question banks"""
        return {
            "delivery": [
                {
                    "id": "q1",
                    "text": "Tell me about yourself and why you're interested in this delivery role.",
                    "difficulty": 1,
                    "category": "introduction",
                    "follow_ups": [
                        "What specific experience do you have with delivery?",
                        "What motivates you to work in delivery?"
                    ]
                },
                {
                    "id": "q2",
                    "text": "How would you handle a situation where you're running late for a delivery?",
                    "difficulty": 2,
                    "category": "situational",
                    "follow_ups": [
                        "What would you tell the customer?",
                        "How would you communicate with your manager?"
                    ]
                },
                {
                    "id": "q3",
                    "text": "Describe a time you had to deal with a difficult customer.",
                    "difficulty": 3,
                    "category": "behavioral",
                    "follow_ups": [
                        "How did you handle the situation?",
                        "What was the outcome?"
                    ]
                },
                {
                    "id": "q4",
                    "text": "How familiar are you with using navigation apps and following routes?",
                    "difficulty": 2,
                    "category": "technical",
                    "follow_ups": [
                        "Which apps have you used?",
                        "How do you handle areas with poor GPS signal?"
                    ]
                },
                {
                    "id": "q5",
                    "text": "What are your salary expectations and availability?",
                    "difficulty": 1,
                    "category": "logistics",
                    "follow_ups": [
                        "Are you available to work weekends?",
                        "Do you have your own vehicle?"
                    ]
                }
            ],
            "warehouse": [
                {
                    "id": "w1",
                    "text": "Tell me about your experience with warehouse work.",
                    "difficulty": 1,
                    "category": "introduction",
                    "follow_ups": [
                        "What types of warehouse tasks have you done?",
                        "Are you comfortable with heavy lifting?"
                    ]
                },
                # Add more warehouse-specific questions
            ],
            "retail": [
                {
                    "id": "r1",
                    "text": "Tell me about your experience in customer service or retail.",
                    "difficulty": 1,
                    "category": "introduction",
                    "follow_ups": [
                        "What do you enjoy most about customer service?",
                        "How do you handle busy periods?"
                    ]
                },
                # Add more retail-specific questions
            ]
        }

    async def process_interview(
        self,
        state: CandidateSessionState,
        audio_data: Optional[bytes] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> CandidateSessionState:
        """
        Process interview step - either start new question or process response

        Args:
            state: Current session state
            audio_data: Optional audio data from candidate
            metadata: Optional metadata (language, duration, etc.)

        Returns:
            Updated session state
        """
        # Initialize proctor state if needed
        if not self.current_state:
            self.current_state = self._initialize_proctor_state(state)

        # Detect language if not already detected
        if state["language_detected"] == "hi-IN" and audio_data:
            detected_language = await self.language_detector.detect(audio_data)
            state["language_detected"] = detected_language

        # Process based on interview state
        if state["interview_state"] == InterviewState.INITIATED:
            # Start interview with first question
            return await self._start_interview(state)
        elif state["interview_state"] == InterviewState.IN_PROGRESS:
            # Process candidate response
            if audio_data:
                return await self._process_response(state, audio_data, metadata)
            else:
                # Generate next question
                return await self._generate_next_question(state)
        elif state["interview_state"] == InterviewState.RECOVERED:
            # Resume from drop-off
            return await self._resume_interview(state)
        else:
            # Interview complete or other state
            return state

    async def _start_interview(self, state: CandidateSessionState) -> CandidateSessionState:
        """Start the interview with first question"""
        # Get first question
        role = self._determine_role_from_requisition(state)
        questions = self.question_banks.get(role, self.question_banks["delivery"])

        if questions:
            first_question = questions[0]
            state["last_question_asked"] = first_question["text"]
            state["interview_state"] = InterviewState.IN_PROGRESS
            state["current_question_index"] = 0

        return state

    async def _process_response(
        self,
        state: CandidateSessionState,
        audio_data: bytes,
        metadata: Optional[Dict[str, Any]] = None
    ) -> CandidateSessionState:
        """
        Process candidate's audio response

        Args:
            state: Current session state
            audio_data: Audio data from candidate
            metadata: Optional metadata

        Returns:
            Updated session state with transcript and next question
        """
        # Transcribe audio
        transcript_result = await self.stt_pipeline.transcribe(
            audio_data,
            language=state["language_detected"]
        )

        # Create transcript segment
        segment: TranscriptSegment = {
            "speaker": "candidate",
            "text": transcript_result["text"],
            "timestamp": datetime.utcnow(),
            "confidence": transcript_result["confidence"],
            "language_detected": state["language_detected"]
        }

        # Add to transcript
        state["transcript_segments"].append(segment)

        # Create question-response pair
        current_question = self._get_current_question(state)
        response: QuestionResponse = {
            "question_id": current_question["id"] if current_question else "",
            "question_text": current_question["text"] if current_question else "",
            "response_text": transcript_result["text"],
            "response_duration_seconds": metadata.get("duration", 0) if metadata else 0,
            "confidence_score": transcript_result["confidence"],
            "follow_up_generated": False
        }

        state["question_responses"].append(response)

        # Update interview duration
        state["interview_duration_seconds"] += metadata.get("duration", 0) if metadata else 0

        # Analyze response for adaptive questioning
        await self._analyze_response_for_adaptation(state, response)

        # Check if interview should continue or complete
        if state["current_question_index"] >= state["total_questions"] - 1:
            state["interview_state"] = InterviewState.COMPLETED
            state["completed_at"] = datetime.utcnow()
        else:
            # Move to next question
            state["current_question_index"] += 1
            next_question = self._get_next_question(state)
            if next_question:
                state["last_question_asked"] = next_question["text"]

        return state

    async def _generate_next_question(self, state: CandidateSessionState) -> CandidateSessionState:
        """Generate next question based on adaptive strategy"""
        next_question = self._get_next_question(state)
        if next_question:
            state["last_question_asked"] = next_question["text"]
        return state

    async def _resume_interview(self, state: CandidateSessionState) -> CandidateSessionState:
        """Resume interview after drop-off"""
        # Generate recovery message
        recovery_message = self._get_recovery_message(state["language_detected"])
        state["last_question_asked"] = recovery_message

        # Continue with last question or next
        if state["last_question_asked"]:
            state["interview_state"] = InterviewState.IN_PROGRESS

        return state

    async def _analyze_response_for_adaptation(
        self,
        state: CandidateSessionState,
        response: QuestionResponse
    ):
        """
        Analyze response to determine adaptive questioning strategy

        Args:
            state: Current session state
            response: Current question-response pair
        """
        # Analyze response quality
        response_quality = self._assess_response_quality(response)

        # Adjust difficulty based on response
        if response_quality == "strong":
            self.current_state["current_difficulty_level"] = min(
                self.current_state["current_difficulty_level"] + 1,
                5
            )
        elif response_quality == "weak":
            self.current_state["current_difficulty_level"] = max(
                self.current_state["current_difficulty_level"] - 1,
                1
            )

        # Check for need for clarification
        if response["confidence_score"] < 0.6:
            self.current_state["clarification_requests"] += 1

    def _assess_response_quality(self, response: QuestionResponse) -> str:
        """
        Assess the quality of candidate's response

        Returns:
            "strong", "moderate", or "weak"
        """
        # Simple heuristic based on response length and confidence
        response_length = len(response["response_text"].split())
        confidence = response["confidence_score"]

        if response_length > 20 and confidence > 0.8:
            return "strong"
        elif response_length > 10 and confidence > 0.6:
            return "moderate"
        else:
            return "weak"

    def _get_current_question(self, state: CandidateSessionState) -> Optional[Dict[str, Any]]:
        """Get current question based on state"""
        role = self._determine_role_from_requisition(state)
        questions = self.question_banks.get(role, self.question_banks["delivery"])

        if 0 <= state["current_question_index"] < len(questions):
            return questions[state["current_question_index"]]
        return None

    def _get_next_question(self, state: CandidateSessionState) -> Optional[Dict[str, Any]]:
        """Get next question based on adaptive strategy"""
        role = self._determine_role_from_requisition(state)
        questions = self.question_banks.get(role, self.question_banks["delivery"])

        next_index = state["current_question_index"] + 1
        if 0 <= next_index < len(questions):
            return questions[next_index]
        return None

    def _determine_role_from_requisition(self, state: CandidateSessionState) -> str:
        """Determine role from requisition or default to delivery"""
        # In real implementation, would fetch requisition details
        return "delivery"

    def _initialize_proctor_state(self, state: CandidateSessionState) -> ProctorState:
        """Initialize proctor-specific state"""
        return {
            "current_difficulty_level": 1,
            "adaptive_strategy": "adaptive",
            "interruption_count": 0,
            "clarification_requests": 0,
            "question_bank": self.question_banks.get("delivery", []),
            "next_question": None
        }

    def _get_recovery_message(self, language: str) -> str:
        """Get recovery message based on language"""
        recovery_messages = {
            "hi-IN": "कोई बात नहीं — जहां छोड़ा था, वहां से शुरू करते हैं।",
            "en-IN": "No problem — let's continue from where we left off.",
            "ta-IN": "பிரச்சனை இல்லை — நிறுத்திய இடத்திலிருந்து தொடர்வோம்.",
            "default": "No problem — let's continue from where we left off."
        }
        return recovery_messages.get(language, recovery_messages["default"])

    def get_next_action(self, state: CandidateSessionState) -> Dict[str, Any]:
        """
        Get next action for the interview process

        Returns:
            Dictionary with action type and content
        """
        if state["interview_state"] == InterviewState.INITIATED:
            return {
                "action": "start_interview",
                "question": state["last_question_asked"],
                "language": state["language_detected"]
            }
        elif state["interview_state"] == InterviewState.IN_PROGRESS:
            return {
                "action": "continue_interview",
                "question": state["last_question_asked"],
                "question_number": state["current_question_index"] + 1,
                "total_questions": state["total_questions"]
            }
        elif state["interview_state"] == InterviewState.COMPLETED:
            return {
                "action": "complete_interview",
                "message": "Thank you for completing the interview. We will get back to you soon."
            }
        elif state["interview_state"] == InterviewState.RECOVERED:
            return {
                "action": "recover_interview",
                "message": state["last_question_asked"],
                "question_number": state["current_question_index"] + 1
            }
        else:
            return {
                "action": "unknown_state",
                "message": "Interview state unclear"
            }