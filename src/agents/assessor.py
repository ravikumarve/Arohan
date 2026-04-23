"""
AROHAN Assessor Agent
Evaluates candidate transcripts and generates scorecards
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import re

from src.agents.state import (
    CandidateSessionState,
    Scorecard,
    AssessorState,
    QuestionResponse,
    TranscriptSegment
)


class AssessorAgent:
    """
    Assessor Agent - Analyzes candidate transcripts and generates detailed scorecards
    Outputs 1-100 scale scores across multiple dimensions
    """

    def __init__(self):
        """Initialize the Assessor agent"""
        self.current_state: Optional[AssessorState] = None
        self.scoring_criteria = self._load_scoring_criteria()
        self.keyword_weights = self._load_keyword_weights()

    def _load_scoring_criteria(self) -> Dict[str, Dict[str, Any]]:
        """Load scoring criteria for different dimensions"""
        return {
            "communication": {
                "weight": 0.25,
                "factors": [
                    "clarity",
                    "fluency",
                    "vocabulary",
                    "response_completeness"
                ]
            },
            "domain_knowledge": {
                "weight": 0.30,
                "factors": [
                    "role_understanding",
                    "technical_skills",
                    "industry_knowledge",
                    "experience_relevance"
                ]
            },
            "situational_judgment": {
                "weight": 0.25,
                "factors": [
                    "problem_solving",
                    "decision_making",
                    "customer_handling",
                    "adaptability"
                ]
            },
            "confidence": {
                "weight": 0.20,
                "factors": [
                    "voice_confidence",
                    "response_speed",
                    "certainty",
                    "engagement"
                ]
            }
        }

    def _load_keyword_weights(self) -> Dict[str, Dict[str, float]]:
        """Load keyword weights for different roles"""
        return {
            "delivery": {
                "positive": [
                    ("on time", 0.8),
                    ("customer service", 0.7),
                    ("navigation", 0.6),
                    ("reliable", 0.8),
                    ("efficient", 0.7),
                    ("safe", 0.6),
                    ("route", 0.5),
                    ("delivery", 0.6),
                    ("time management", 0.7),
                    ("communication", 0.6)
                ],
                "negative": [
                    ("late", -0.5),
                    ("difficult", -0.3),
                    ("problem", -0.4),
                    ("don't know", -0.6),
                    ("never", -0.5),
                    ("can't", -0.4)
                ]
            },
            "warehouse": {
                "positive": [
                    ("organized", 0.8),
                    ("inventory", 0.7),
                    ("safety", 0.8),
                    ("teamwork", 0.7),
                    ("efficient", 0.7),
                    ("accurate", 0.8),
                    ("lifting", 0.6),
                    ("forklift", 0.7),
                    ("packing", 0.6),
                    ("quality", 0.7)
                ],
                "negative": [
                    ("messy", -0.5),
                    ("careless", -0.6),
                    ("injury", -0.5),
                    ("lost", -0.4),
                    ("don't know", -0.6)
                ]
            },
            "retail": {
                "positive": [
                    ("customer", 0.8),
                    ("sales", 0.7),
                    ("friendly", 0.8),
                    ("helpful", 0.7),
                    ("product knowledge", 0.7),
                    ("merchandising", 0.6),
                    ("cash handling", 0.7),
                    ("inventory", 0.6),
                    ("service", 0.8),
                    ("satisfaction", 0.7)
                ],
                "negative": [
                    ("rude", -0.8),
                    ("impatient", -0.6),
                    ("ignore", -0.5),
                    ("don't care", -0.7),
                    ("lazy", -0.6)
                ]
            }
        }

    async def evaluate_candidate(self, state: CandidateSessionState) -> CandidateSessionState:
        """
        Evaluate candidate and generate comprehensive scorecard

        Args:
            state: Current session state with transcript

        Returns:
            Updated state with scorecard
        """
        # Initialize assessor state
        self.current_state = self._initialize_assessor_state(state)

        # Analyze transcript
        analysis_result = await self._analyze_transcript(state)

        # Calculate scores for each dimension
        communication_score = self._calculate_communication_score(state, analysis_result)
        domain_knowledge_score = self._calculate_domain_knowledge_score(state, analysis_result)
        situational_judgment_score = self._calculate_situational_judgment_score(state, analysis_result)
        confidence_score = self._calculate_confidence_score(state, analysis_result)

        # Calculate overall score
        overall_score = self._calculate_overall_score(
            communication_score,
            domain_knowledge_score,
            situational_judgment_score,
            confidence_score
        )

        # Determine language fluency
        language_fluency = self._determine_language_fluency(state, analysis_result)

        # Generate assessor notes
        assessor_notes = self._generate_assessor_notes(
            state,
            analysis_result,
            overall_score
        )

        # Determine recommended roles
        recommended_roles = self._determine_recommended_roles(
            state,
            analysis_result,
            overall_score
        )

        # Determine shortlist flag
        shortlist_flag = self._determine_shortlist_flag(overall_score, state)

        # Create scorecard
        scorecard: Scorecard = {
            "overall_score": overall_score,
            "communication_score": communication_score,
            "domain_knowledge_score": domain_knowledge_score,
            "situational_judgment_score": situational_judgment_score,
            "confidence_score": confidence_score,
            "language_fluency": language_fluency,
            "assessor_notes": assessor_notes,
            "recommended_roles": recommended_roles,
            "shortlist_flag": shortlist_flag,
            "assessed_at": datetime.utcnow()
        }

        # Update state with scorecard
        state["scorecard"] = scorecard

        return state

    async def _analyze_transcript(self, state: CandidateSessionState) -> Dict[str, Any]:
        """
        Analyze transcript for various metrics

        Returns:
            Dictionary with analysis results
        """
        transcript_segments = state["transcript_segments"]
        question_responses = state["question_responses"]

        # Extract all candidate text
        candidate_text = " ".join([
            segment["text"] for segment in transcript_segments
            if segment["speaker"] == "candidate"
        ])

        # Calculate basic metrics
        total_words = len(candidate_text.split())
        avg_response_length = total_words / len(question_responses) if question_responses else 0
        avg_confidence = sum(
            response["confidence_score"] for response in question_responses
        ) / len(question_responses) if question_responses else 0

        # Analyze keyword matches
        keyword_matches = self._analyze_keywords(candidate_text, state)

        # Analyze response patterns
        response_patterns = self._analyze_response_patterns(question_responses)

        # Analyze language usage
        language_analysis = self._analyze_language_usage(transcript_segments)

        return {
            "total_words": total_words,
            "avg_response_length": avg_response_length,
            "avg_confidence": avg_confidence,
            "keyword_matches": keyword_matches,
            "response_patterns": response_patterns,
            "language_analysis": language_analysis
        }

    def _calculate_communication_score(
        self,
        state: CandidateSessionState,
        analysis: Dict[str, Any]
    ) -> float:
        """Calculate communication score (1-100)"""
        criteria = self.scoring_criteria["communication"]

        # Clarity (based on confidence and response completeness)
        clarity_score = min(analysis["avg_confidence"] * 100, 100)

        # Fluency (based on response length and patterns)
        fluency_score = min(
            (analysis["avg_response_length"] / 15) * 100,
            100
        )

        # Vocabulary (based on keyword diversity)
        vocabulary_score = min(
            (len(analysis["keyword_matches"]["positive"]) / 5) * 100,
            100
        )

        # Response completeness (based on response patterns)
        completeness_score = analysis["response_patterns"].get("completeness", 70)

        # Weighted average
        communication_score = (
            clarity_score * 0.3 +
            fluency_score * 0.3 +
            vocabulary_score * 0.2 +
            completeness_score * 0.2
        )

        return round(communication_score, 1)

    def _calculate_domain_knowledge_score(
        self,
        state: CandidateSessionState,
        analysis: Dict[str, Any]
    ) -> float:
        """Calculate domain knowledge score (1-100)"""
        criteria = self.scoring_criteria["domain_knowledge"]

        # Role understanding (based on relevant keywords)
        role_keywords = analysis["keyword_matches"].get("role_relevant", 0)
        role_score = min((role_keywords / 3) * 100, 100)

        # Technical skills (based on technical keywords)
        technical_keywords = analysis["keyword_matches"].get("technical", 0)
        technical_score = min((technical_keywords / 2) * 100, 100)

        # Industry knowledge (based on industry keywords)
        industry_keywords = analysis["keyword_matches"].get("industry", 0)
        industry_score = min((industry_keywords / 2) * 100, 100)

        # Experience relevance (based on response patterns)
        experience_score = analysis["response_patterns"].get("experience_relevance", 70)

        # Weighted average
        domain_score = (
            role_score * 0.3 +
            technical_score * 0.25 +
            industry_score * 0.25 +
            experience_score * 0.2
        )

        return round(domain_score, 1)

    def _calculate_situational_judgment_score(
        self,
        state: CandidateSessionState,
        analysis: Dict[str, Any]
    ) -> float:
        """Calculate situational judgment score (1-100)"""
        criteria = self.scoring_criteria["situational_judgment"]

        # Problem solving (based on situational responses)
        problem_solving = analysis["response_patterns"].get("problem_solving", 70)

        # Decision making (based on response quality)
        decision_making = analysis["response_patterns"].get("decision_making", 70)

        # Customer handling (based on customer-related responses)
        customer_handling = analysis["response_patterns"].get("customer_handling", 70)

        # Adaptability (based on response to follow-ups)
        adaptability = analysis["response_patterns"].get("adaptability", 70)

        # Weighted average
        judgment_score = (
            problem_solving * 0.3 +
            decision_making * 0.25 +
            customer_handling * 0.25 +
            adaptability * 0.2
        )

        return round(judgment_score, 1)

    def _calculate_confidence_score(
        self,
        state: CandidateSessionState,
        analysis: Dict[str, Any]
    ) -> float:
        """Calculate confidence score (1-100)"""
        criteria = self.scoring_criteria["confidence"]

        # Voice confidence (based on STT confidence)
        voice_confidence = analysis["avg_confidence"] * 100

        # Response speed (based on response duration patterns)
        response_speed = analysis["response_patterns"].get("response_speed", 70)

        # Certainty (based on language patterns)
        certainty = analysis["language_analysis"].get("certainty", 70)

        # Engagement (based on response length and participation)
        engagement = min(
            (analysis["avg_response_length"] / 20) * 100,
            100
        )

        # Weighted average
        confidence_score = (
            voice_confidence * 0.3 +
            response_speed * 0.2 +
            certainty * 0.25 +
            engagement * 0.25
        )

        return round(confidence_score, 1)

    def _calculate_overall_score(
        self,
        communication_score: float,
        domain_knowledge_score: float,
        situational_judgment_score: float,
        confidence_score: float
    ) -> float:
        """Calculate overall score (1-100)"""
        criteria = self.scoring_criteria

        overall_score = (
            communication_score * criteria["communication"]["weight"] +
            domain_knowledge_score * criteria["domain_knowledge"]["weight"] +
            situational_judgment_score * criteria["situational_judgment"]["weight"] +
            confidence_score * criteria["confidence"]["weight"]
        )

        return round(overall_score, 1)

    def _determine_language_fluency(
        self,
        state: CandidateSessionState,
        analysis: Dict[str, Any]
    ) -> str:
        """Determine language fluency level"""
        confidence = analysis["avg_confidence"]
        response_quality = analysis["response_patterns"].get("quality", 0.7)

        combined_score = (confidence + response_quality) / 2

        if combined_score >= 0.85:
            return "native"
        elif combined_score >= 0.70:
            return "proficient"
        else:
            return "functional"

    def _generate_assessor_notes(
        self,
        state: CandidateSessionState,
        analysis: Dict[str, Any],
        overall_score: float
    ) -> str:
        """Generate comprehensive assessor notes"""
        notes = []

        # Overall assessment
        if overall_score >= 80:
            notes.append("Strong candidate with excellent communication and domain knowledge.")
        elif overall_score >= 60:
            notes.append("Good candidate with solid fundamentals and room for improvement.")
        elif overall_score >= 40:
            notes.append("Moderate candidate showing potential but needs development.")
        else:
            notes.append("Candidate requires significant training and development.")

        # Specific strengths
        strengths = []
        if analysis["keyword_matches"].get("positive", 0) > 3:
            strengths.append("good domain vocabulary")
        if analysis["avg_confidence"] > 0.8:
            strengths.append("high confidence")
        if analysis["response_patterns"].get("completeness", 0) > 70:
            strengths.append("comprehensive responses")

        if strengths:
            notes.append(f"Strengths: {', '.join(strengths)}.")

        # Areas for improvement
        improvements = []
        if analysis["avg_response_length"] < 10:
            improvements.append("more detailed responses")
        if analysis["avg_confidence"] < 0.6:
            improvements.append("increased confidence")
        if analysis["keyword_matches"].get("negative", 0) > 0:
            improvements.append("more positive language")

        if improvements:
            notes.append(f"Areas for improvement: {', '.join(improvements)}.")

        return " ".join(notes)

    def _determine_recommended_roles(
        self,
        state: CandidateSessionState,
        analysis: Dict[str, Any],
        overall_score: float
    ) -> List[str]:
        """Determine recommended roles based on analysis"""
        recommended_roles = []

        # Analyze keyword matches by role
        role_scores = {}
        for role, keywords in self.keyword_weights.items():
            positive_matches = sum(
                weight for keyword, weight in keywords["positive"]
                if keyword in analysis["keyword_matches"].get("matched_keywords", set())
            )
            role_scores[role] = positive_matches

        # Recommend top roles
        sorted_roles = sorted(role_scores.items(), key=lambda x: x[1], reverse=True)

        for role, score in sorted_roles[:2]:
            if score > 0 and overall_score >= 50:
                recommended_roles.append(role)

        # Default to delivery if no specific recommendations
        if not recommended_roles and overall_score >= 50:
            recommended_roles.append("delivery")

        return recommended_roles

    def _determine_shortlist_flag(
        self,
        overall_score: float,
        state: CandidateSessionState
    ) -> bool:
        """Determine if candidate should be shortlisted"""
        # Get score threshold from requisition (default 70)
        score_threshold = 70  # In real implementation, would fetch from requisition

        return overall_score >= score_threshold

    def _analyze_keywords(self, text: str, state: CandidateSessionState) -> Dict[str, Any]:
        """Analyze keyword matches in candidate's responses"""
        role = self._determine_role_from_state(state)
        keywords = self.keyword_weights.get(role, self.keyword_weights["delivery"])

        matched_keywords = set()
        positive_count = 0
        negative_count = 0
        role_relevant = 0
        technical = 0
        industry = 0

        # Check positive keywords
        for keyword, weight in keywords["positive"]:
            if keyword.lower() in text.lower():
                matched_keywords.add(keyword)
                positive_count += 1
                if weight > 0.7:
                    role_relevant += 1
                elif weight > 0.5:
                    technical += 1
                else:
                    industry += 1

        # Check negative keywords
        for keyword, weight in keywords["negative"]:
            if keyword.lower() in text.lower():
                matched_keywords.add(keyword)
                negative_count += 1

        return {
            "matched_keywords": matched_keywords,
            "positive": positive_count,
            "negative": negative_count,
            "role_relevant": role_relevant,
            "technical": technical,
            "industry": industry
        }

    def _analyze_response_patterns(self, responses: List[QuestionResponse]) -> Dict[str, Any]:
        """Analyze patterns in candidate responses"""
        if not responses:
            return {
                "completeness": 50,
                "problem_solving": 50,
                "decision_making": 50,
                "customer_handling": 50,
                "adaptability": 50,
                "response_speed": 50,
                "experience_relevance": 50,
                "quality": 0.5
            }

        # Calculate various pattern metrics
        avg_duration = sum(r["response_duration_seconds"] for r in responses) / len(responses)
        avg_confidence = sum(r["confidence_score"] for r in responses) / len(responses)

        # Analyze response quality based on duration and confidence
        quality = (avg_confidence + min(avg_duration / 30, 1.0)) / 2

        return {
            "completeness": min(avg_confidence * 100, 100),
            "problem_solving": min(avg_confidence * 100, 100),
            "decision_making": min(avg_confidence * 100, 100),
            "customer_handling": min(avg_confidence * 100, 100),
            "adaptability": min(avg_confidence * 100, 100),
            "response_speed": min(avg_duration / 20 * 100, 100),
            "experience_relevance": min(avg_confidence * 100, 100),
            "quality": quality
        }

    def _analyze_language_usage(self, segments: List[TranscriptSegment]) -> Dict[str, Any]:
        """Analyze language usage patterns"""
        if not segments:
            return {"certainty": 50, "formality": 50}

        # Analyze certainty based on language patterns
        certain_phrases = ["i am", "i have", "i can", "i will", "definitely", "certainly"]
        uncertain_phrases = ["i think", "maybe", "probably", "i guess", "not sure"]

        text = " ".join(s["text"] for s in segments).lower()

        certain_count = sum(1 for phrase in certain_phrases if phrase in text)
        uncertain_count = sum(1 for phrase in uncertain_phrases if phrase in text)

        total_phrases = certain_count + uncertain_count
        certainty = 50
        if total_phrases > 0:
            certainty = (certain_count / total_phrases) * 100

        return {"certainty": certainty, "formality": 50}

    def _determine_role_from_state(self, state: CandidateSessionState) -> str:
        """Determine role from state"""
        # In real implementation, would fetch from requisition
        return "delivery"

    def _initialize_assessor_state(self, state: CandidateSessionState) -> AssessorState:
        """Initialize assessor-specific state"""
        return {
            "analysis_progress": 0.0,
            "confidence_metrics": {},
            "keyword_matches": {},
            "sentiment_analysis": {},
            "domain_assessment": {}
        }