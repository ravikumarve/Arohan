"""
AROHAN Matchmaker Agent
Finds matching job requisitions for candidates
"""

from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
import math
import asyncio

from src.agents.state import (
    CandidateSessionState,
    MatchmakerState,
    Scorecard
)
from src.db.database import get_db
from sqlalchemy import text


class MatchmakerAgent:
    """
    Matchmaker Agent - Finds matching job requisitions based on
    geography, scores, and candidate preferences
    """

    def __init__(self):
        """Initialize the Matchmaker agent"""
        self.current_state: Optional[MatchmakerState] = None
        self.geo_cache = {}  # Cache for geographic calculations
        self.match_thresholds = {
            "minimum_score": 50,
            "geo_radius_km": 50,
            "role_match_required": True
        }

    async def find_matches(self, state: CandidateSessionState) -> CandidateSessionState:
        """
        Find matching job requisitions for candidate

        Args:
            state: Current session state with scorecard

        Returns:
            Updated state with matched requisitions
        """
        # Initialize matchmaker state
        self.current_state = self._initialize_matchmaker_state(state)

        # Get candidate scorecard
        scorecard = state.get("scorecard")
        if not scorecard:
            # No scorecard available, return empty matches
            state["matched_requisitions"] = []
            return state

        # Get candidate location
        candidate_pin_code = state["candidate_pin_code"]
        candidate_location = await self._get_pincode_location(candidate_pin_code)

        if not candidate_location:
            # Could not determine location, return empty matches
            state["matched_requisitions"] = []
            return state

        # Find matching requisitions
        matched_requisitions = await self._find_matching_requisitions(
            state,
            scorecard,
            candidate_location
        )

        # Rank matches by relevance
        ranked_matches = self._rank_matches(
            matched_requisitions,
            scorecard,
            candidate_location
        )

        # Update state with matches
        state["matched_requisitions"] = ranked_matches

        return state

    async def _find_matching_requisitions(
        self,
        state: CandidateSessionState,
        scorecard: Scorecard,
        candidate_location: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Find requisitions that match candidate criteria

        Args:
            state: Current session state
            scorecard: Candidate scorecard
            candidate_location: Candidate's geographic location

        Returns:
            List of matching requisitions
        """
        matched_requisitions = []

        # Get database session
        async for db in get_db():
            try:
                # Query for open requisitions
                query = text("""
                    SELECT
                        r.id,
                        r.title,
                        r.company_id,
                        c.name as company_name,
                        r.status,
                        r.score_threshold,
                        r.requirements,
                        r.geo_radius_km,
                        r.pin_code as requisition_pin_code,
                        r.shift_preference,
                        r.created_at
                    FROM requisitions r
                    JOIN companies c ON r.company_id = c.id
                    WHERE r.status = 'open'
                    AND r.score_threshold <= :candidate_score
                """)

                result = await db.execute(
                    query,
                    {"candidate_score": scorecard["overall_score"]}
                )

                requisitions = result.fetchall()

                # Process each requisition
                for req in requisitions:
                    req_dict = dict(req._mapping)

                    # Check geographic compatibility
                    geo_match = await self._check_geographic_match(
                        candidate_location,
                        req_dict["requisition_pin_code"],
                        req_dict["geo_radius_km"]
                    )

                    if not geo_match["compatible"]:
                        continue

                    # Check role compatibility
                    role_match = self._check_role_match(
                        state,
                        scorecard,
                        req_dict
                    )

                    if not role_match["compatible"]:
                        continue

                    # Check shift preference
                    shift_match = self._check_shift_match(
                        state,
                        req_dict
                    )

                    if not shift_match["compatible"]:
                        continue

                    # Calculate match score
                    match_score = self._calculate_match_score(
                        scorecard,
                        req_dict,
                        geo_match,
                        role_match,
                        shift_match
                    )

                    # Add to matches if above threshold
                    if match_score >= self.match_thresholds["minimum_score"]:
                        matched_requisition = {
                            "requisition_id": req_dict["id"],
                            "title": req_dict["title"],
                            "company_id": req_dict["company_id"],
                            "company_name": req_dict["company_name"],
                            "match_score": match_score,
                            "distance_km": geo_match["distance_km"],
                            "score_threshold": req_dict["score_threshold"],
                            "candidate_score": scorecard["overall_score"],
                            "requirements": req_dict["requirements"],
                            "shift_preference": req_dict["shift_preference"],
                            "created_at": req_dict["created_at"].isoformat() if req_dict["created_at"] else None
                        }

                        matched_requisitions.append(matched_requisition)

            except Exception as e:
                print(f"Error finding requisitions: {e}")
                continue

        return matched_requisitions

    async def _check_geographic_match(
        self,
        candidate_location: Dict[str, Any],
        requisition_pin_code: str,
        geo_radius_km: int
    ) -> Dict[str, Any]:
        """
        Check if candidate is within geographic radius of requisition

        Args:
            candidate_location: Candidate's location coordinates
            requisition_pin_code: Requisition's pin code
            geo_radius_km: Maximum allowed distance in km

        Returns:
            Dictionary with compatibility status and distance
        """
        # Get requisition location
        requisition_location = await self._get_pincode_location(requisition_pin_code)

        if not requisition_location:
            return {"compatible": False, "distance_km": None}

        # Calculate distance
        distance_km = self._calculate_distance(
            candidate_location["latitude"],
            candidate_location["longitude"],
            requisition_location["latitude"],
            requisition_location["longitude"]
        )

        # Check if within radius
        compatible = distance_km <= geo_radius_km

        return {
            "compatible": compatible,
            "distance_km": distance_km
        }

    def _check_role_match(
        self,
        state: CandidateSessionState,
        scorecard: Scorecard,
        requisition: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Check if candidate's recommended roles match requisition

        Args:
            state: Current session state
            scorecard: Candidate scorecard
            requisition: Requisition details

        Returns:
            Dictionary with compatibility status and match details
        """
        recommended_roles = scorecard.get("recommended_roles", [])
        requisition_role = self._extract_role_from_title(requisition["title"])

        # Check if any recommended role matches
        compatible = any(
            self._roles_are_compatible(recommended_role, requisition_role)
            for recommended_role in recommended_roles
        )

        return {
            "compatible": compatible,
            "recommended_roles": recommended_roles,
            "requisition_role": requisition_role
        }

    def _check_shift_match(
        self,
        state: CandidateSessionState,
        requisition: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Check if candidate's shift preferences match requisition

        Args:
            state: Current session state
            requisition: Requisition details

        Returns:
            Dictionary with compatibility status
        """
        # For now, assume all shifts are compatible
        # In real implementation, would check candidate's shift preferences
        return {
            "compatible": True,
            "candidate_shift": "flexible",
            "requisition_shift": requisition.get("shift_preference", "flexible")
        }

    def _calculate_match_score(
        self,
        scorecard: Scorecard,
        requisition: Dict[str, Any],
        geo_match: Dict[str, Any],
        role_match: Dict[str, Any],
        shift_match: Dict[str, Any]
    ) -> float:
        """
        Calculate overall match score for requisition

        Args:
            scorecard: Candidate scorecard
            requisition: Requisition details
            geo_match: Geographic match results
            role_match: Role match results
            shift_match: Shift match results

        Returns:
            Match score (0-100)
        """
        # Score components
        score_components = {
            "score_alignment": 0.4,  # How well candidate score matches threshold
            "geo_proximity": 0.3,    # How close candidate is to location
            "role_fit": 0.2,        # How well role matches
            "shift_fit": 0.1        # How well shift preferences match
        }

        # Calculate score alignment
        candidate_score = scorecard["overall_score"]
        threshold_score = requisition["score_threshold"]
        score_alignment = min(
            ((candidate_score - threshold_score) / (100 - threshold_score)) * 100,
            100
        )

        # Calculate geo proximity (closer is better)
        distance_km = geo_match["distance_km"]
        geo_proximity = max(
            (1 - (distance_km / 50)) * 100,  # Normalize to 50km max
            0
        )

        # Calculate role fit
        role_fit = 100 if role_match["compatible"] else 0

        # Calculate shift fit
        shift_fit = 100 if shift_match["compatible"] else 0

        # Calculate weighted match score
        match_score = (
            score_alignment * score_components["score_alignment"] +
            geo_proximity * score_components["geo_proximity"] +
            role_fit * score_components["role_fit"] +
            shift_fit * score_components["shift_fit"]
        )

        return round(match_score, 1)

    def _rank_matches(
        self,
        matches: List[Dict[str, Any]],
        scorecard: Scorecard,
        candidate_location: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Rank matches by relevance score

        Args:
            matches: List of matched requisitions
            scorecard: Candidate scorecard
            candidate_location: Candidate's location

        Returns:
            Ranked list of matches
        """
        # Sort by match score (descending)
        ranked_matches = sorted(
            matches,
            key=lambda x: x["match_score"],
            reverse=True
        )

        # Add ranking information
        for i, match in enumerate(ranked_matches, 1):
            match["rank"] = i

        return ranked_matches

    async def _get_pincode_location(self, pin_code: str) -> Optional[Dict[str, Any]]:
        """
        Get geographic coordinates for pin code

        Args:
            pin_code: Indian pin code

        Returns:
            Dictionary with latitude and longitude
        """
        # Check cache first
        if pin_code in self.geo_cache:
            return self.geo_cache[pin_code]

        # In real implementation, would call geocoding API
        # For now, return mock data for common pincodes
        mock_locations = {
            "400001": {"latitude": 18.9402, "longitude": 72.8351},  # Mumbai
            "400001": {"latitude": 18.9402, "longitude": 72.8351},  # Mumbai
            "110001": {"latitude": 28.6139, "longitude": 77.2090},  # Delhi
            "560001": {"latitude": 12.9716, "longitude": 77.5946},  # Bangalore
            "600001": {"latitude": 13.0827, "longitude": 80.2707},  # Chennai
            "500001": {"latitude": 17.3850, "longitude": 78.4867},  # Hyderabad
            "700001": {"latitude": 22.5726, "longitude": 88.3639},  # Kolkata
            "411001": {"latitude": 18.5204, "longitude": 73.8567},  # Pune
            "380001": {"latitude": 23.0225, "longitude": 72.5714},  # Ahmedabad
            "201301": {"latitude": 28.6139, "longitude": 77.2090},  # Noida
        }

        location = mock_locations.get(pin_code)

        if location:
            # Cache the result
            self.geo_cache[pin_code] = location

        return location

    def _calculate_distance(
        self,
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float
    ) -> float:
        """
        Calculate distance between two coordinates using Haversine formula

        Args:
            lat1, lon1: First coordinate
            lat2, lon2: Second coordinate

        Returns:
            Distance in kilometers
        """
        # Convert to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))

        # Radius of Earth in kilometers
        r = 6371

        return c * r

    def _extract_role_from_title(self, title: str) -> str:
        """
        Extract role from job title

        Args:
            title: Job title

        Returns:
            Normalized role name
        """
        title_lower = title.lower()

        if "delivery" in title_lower or "driver" in title_lower:
            return "delivery"
        elif "warehouse" in title_lower or "picker" in title_lower or "packer" in title_lower:
            return "warehouse"
        elif "retail" in title_lower or "sales" in title_lower or "store" in title_lower:
            return "retail"
        else:
            return "delivery"  # Default

    def _roles_are_compatible(self, role1: str, role2: str) -> bool:
        """
        Check if two roles are compatible

        Args:
            role1: First role
            role2: Second role

        Returns:
            True if roles are compatible
        """
        # Normalize roles
        role1_normalized = self._extract_role_from_title(role1)
        role2_normalized = self._extract_role_from_title(role2)

        return role1_normalized == role2_normalized

    def _initialize_matchmaker_state(self, state: CandidateSessionState) -> MatchmakerState:
        """Initialize matchmaker-specific state"""
        return {
            "geo_search_radius_km": 50,
            "score_threshold": state.get("scorecard", {}).get("overall_score", 0) if state.get("scorecard") else 0,
            "matching_criteria": {},
            "candidate_traits": [],  # Would be embedding vector
            "potential_matches": []
        }

    async def dispatch_ats_webhook(
        self,
        candidate_id: str,
        requisition_id: str,
        match_data: Dict[str, Any]
    ) -> bool:
        """
        Dispatch webhook to employer's ATS system

        Args:
            candidate_id: Candidate ID
            requisition_id: Requisition ID
            match_data: Match details

        Returns:
            True if webhook dispatched successfully
        """
        # In real implementation, would make HTTP POST to employer's webhook URL
        # For now, return success
        print(f"Dispatching ATS webhook for candidate {candidate_id} to requisition {requisition_id}")
        return True

    async def send_whatsapp_notification(
        self,
        candidate_phone: str,
        match_details: List[Dict[str, Any]]
    ) -> bool:
        """
        Send WhatsApp notification to candidate about matches

        Args:
            candidate_phone: Candidate's phone number
            match_details: List of matched requisitions

        Returns:
            True if notification sent successfully
        """
        # In real implementation, would use Meta WhatsApp Business API
        # For now, return success
        print(f"Sending WhatsApp notification to {candidate_phone} about {len(match_details)} matches")
        return True