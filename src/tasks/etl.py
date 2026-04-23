"""
AROHAN ETL Pipelines
Data extraction, transformation, and loading for candidate processing
"""

from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timedelta
import asyncio
import json
import re
import logging

from src.config.settings import settings
from src.db.database import get_db
from sqlalchemy import text

logger = logging.getLogger(__name__)


class ETLPipeline:
    """
    Main ETL pipeline for candidate data processing
    Handles data extraction, transformation, and loading
    """

    def __init__(self):
        """Initialize ETL pipeline"""
        self.batch_size = 100
        self.max_retries = 3
        self.retry_delay = 5  # seconds

    async def run_candidate_enrichment_pipeline(
        self,
        candidate_ids: Optional[List[str]] = None,
        date_range: Optional[Tuple[datetime, datetime]] = None
    ) -> Dict[str, Any]:
        """
        Run candidate enrichment pipeline

        Args:
            candidate_ids: Optional list of candidate IDs to process
            date_range: Optional date range (start, end) for filtering

        Returns:
            Pipeline execution results
        """
        start_time = datetime.utcnow()
        results = {
            "pipeline": "candidate_enrichment",
            "started_at": start_time.isoformat(),
            "candidates_processed": 0,
            "candidates_enriched": 0,
            "candidates_failed": 0,
            "errors": []
        }

        try:
            # Get candidates to process
            candidates = await self._get_candidates_for_enrichment(
                candidate_ids,
                date_range
            )

            logger.info(f"Found {len(candidates)} candidates for enrichment")

            # Process candidates in batches
            for i in range(0, len(candidates), self.batch_size):
                batch = candidates[i:i + self.batch_size]

                for candidate in batch:
                    try:
                        # Enrich candidate data
                        enriched = await self._enrich_candidate(candidate)

                        if enriched:
                            results["candidates_enriched"] += 1
                        else:
                            results["candidates_failed"] += 1

                        results["candidates_processed"] += 1

                    except Exception as e:
                        logger.error(f"Error enriching candidate {candidate['id']}: {e}")
                        results["candidates_failed"] += 1
                        results["errors"].append({
                            "candidate_id": candidate["id"],
                            "error": str(e)
                        })

            results["completed_at"] = datetime.utcnow().isoformat()
            results["duration_seconds"] = (
                datetime.utcnow() - start_time
            ).total_seconds()
            results["status"] = "completed"

        except Exception as e:
            logger.error(f"Pipeline execution error: {e}")
            results["status"] = "failed"
            results["error"] = str(e)
            results["completed_at"] = datetime.utcnow().isoformat()

        return results

    async def run_transcript_normalization_pipeline(
        self,
        transcript_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Run transcript normalization pipeline

        Args:
            transcript_ids: Optional list of transcript IDs to process

        Returns:
            Pipeline execution results
        """
        start_time = datetime.utcnow()
        results = {
            "pipeline": "transcript_normalization",
            "started_at": start_time.isoformat(),
            "transcripts_processed": 0,
            "transcripts_normalized": 0,
            "transcripts_failed": 0,
            "errors": []
        }

        try:
            # Get transcripts to process
            transcripts = await self._get_transcripts_for_normalization(transcript_ids)

            logger.info(f"Found {len(transcripts)} transcripts for normalization")

            # Process transcripts
            for transcript in transcripts:
                try:
                    # Normalize transcript
                    normalized = await self._normalize_transcript(transcript)

                    if normalized:
                        results["transcripts_normalized"] += 1
                    else:
                        results["transcripts_failed"] += 1

                    results["transcripts_processed"] += 1

                except Exception as e:
                    logger.error(f"Error normalizing transcript {transcript['id']}: {e}")
                    results["transcripts_failed"] += 1
                    results["errors"].append({
                        "transcript_id": transcript["id"],
                        "error": str(e)
                    })

            results["completed_at"] = datetime.utcnow().isoformat()
            results["duration_seconds"] = (
                datetime.utcnow() - start_time
            ).total_seconds()
            results["status"] = "completed"

        except Exception as e:
            logger.error(f"Pipeline execution error: {e}")
            results["status"] = "failed"
            results["error"] = str(e)
            results["completed_at"] = datetime.utcnow().isoformat()

        return results

    async def run_scorecard_calculation_pipeline(
        self,
        session_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Run scorecard calculation pipeline

        Args:
            session_ids: Optional list of session IDs to process

        Returns:
            Pipeline execution results
        """
        start_time = datetime.utcnow()
        results = {
            "pipeline": "scorecard_calculation",
            "started_at": start_time.isoformat(),
            "sessions_processed": 0,
            "scorecards_calculated": 0,
            "scorecards_failed": 0,
            "errors": []
        }

        try:
            # Get sessions to process
            sessions = await self._get_sessions_for_scorecard_calculation(session_ids)

            logger.info(f"Found {len(sessions)} sessions for scorecard calculation")

            # Process sessions
            for session in sessions:
                try:
                    # Calculate scorecard
                    scorecard = await self._calculate_scorecard(session)

                    if scorecard:
                        results["scorecards_calculated"] += 1
                    else:
                        results["scorecards_failed"] += 1

                    results["sessions_processed"] += 1

                except Exception as e:
                    logger.error(f"Error calculating scorecard for session {session['id']}: {e}")
                    results["scorecards_failed"] += 1
                    results["errors"].append({
                        "session_id": session["id"],
                        "error": str(e)
                    })

            results["completed_at"] = datetime.utcnow().isoformat()
            results["duration_seconds"] = (
                datetime.utcnow() - start_time
            ).total_seconds()
            results["status"] = "completed"

        except Exception as e:
            logger.error(f"Pipeline execution error: {e}")
            results["status"] = "failed"
            results["error"] = str(e)
            results["completed_at"] = datetime.utcnow().isoformat()

        return results

    async def run_audit_trail_pipeline(
        self,
        date_range: Optional[Tuple[datetime, datetime]] = None
    ) -> Dict[str, Any]:
        """
        Run audit trail generation pipeline

        Args:
            date_range: Optional date range (start, end) for filtering

        Returns:
            Pipeline execution results
        """
        start_time = datetime.utcnow()
        results = {
            "pipeline": "audit_trail_generation",
            "started_at": start_time.isoformat(),
            "audit_entries_created": 0,
            "audit_entries_failed": 0,
            "errors": []
        }

        try:
            # Get events to audit
            events = await self._get_events_for_audit_trail(date_range)

            logger.info(f"Found {len(events)} events for audit trail")

            # Process events
            for event in events:
                try:
                    # Create audit entry
                    audit_entry = await self._create_audit_entry(event)

                    if audit_entry:
                        results["audit_entries_created"] += 1
                    else:
                        results["audit_entries_failed"] += 1

                except Exception as e:
                    logger.error(f"Error creating audit entry for event {event['id']}: {e}")
                    results["audit_entries_failed"] += 1
                    results["errors"].append({
                        "event_id": event["id"],
                        "error": str(e)
                    })

            results["completed_at"] = datetime.utcnow().isoformat()
            results["duration_seconds"] = (
                datetime.utcnow() - start_time
            ).total_seconds()
            results["status"] = "completed"

        except Exception as e:
            logger.error(f"Pipeline execution error: {e}")
            results["status"] = "failed"
            results["error"] = str(e)
            results["completed_at"] = datetime.utcnow().isoformat()

        return results

    async def run_data_quality_pipeline(
        self,
        entity_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Run data quality validation pipeline

        Args:
            entity_type: Optional entity type to validate (candidates, transcripts, scorecards)

        Returns:
            Pipeline execution results
        """
        start_time = datetime.utcnow()
        results = {
            "pipeline": "data_quality_validation",
            "started_at": start_time.isoformat(),
            "entities_validated": 0,
            "entities_passed": 0,
            "entities_failed": 0,
            "quality_issues": [],
            "errors": []
        }

        try:
            # Get entities to validate
            entities = await self._get_entities_for_validation(entity_type)

            logger.info(f"Found {len(entities)} entities for validation")

            # Process entities
            for entity in entities:
                try:
                    # Validate entity
                    validation_result = await self._validate_entity(entity)

                    if validation_result["valid"]:
                        results["entities_passed"] += 1
                    else:
                        results["entities_failed"] += 1
                        results["quality_issues"].extend(validation_result["issues"])

                    results["entities_validated"] += 1

                except Exception as e:
                    logger.error(f"Error validating entity {entity['id']}: {e}")
                    results["entities_failed"] += 1
                    results["errors"].append({
                        "entity_id": entity["id"],
                        "error": str(e)
                    })

            results["completed_at"] = datetime.utcnow().isoformat()
            results["duration_seconds"] = (
                datetime.utcnow() - start_time
            ).total_seconds()
            results["status"] = "completed"

        except Exception as e:
            logger.error(f"Pipeline execution error: {e}")
            results["status"] = "failed"
            results["error"] = str(e)
            results["completed_at"] = datetime.utcnow().isoformat()

        return results

    async def _get_candidates_for_enrichment(
        self,
        candidate_ids: Optional[List[str]] = None,
        date_range: Optional[Tuple[datetime, datetime]] = None
    ) -> List[Dict[str, Any]]:
        """Get candidates for enrichment"""
        async for db in get_db():
            try:
                query = text("""
                    SELECT
                        id,
                        phone,
                        pin_code,
                        language_detected,
                        created_at,
                        updated_at
                    FROM candidates
                    WHERE status = 'pending'
                """)

                params = {}

                if candidate_ids:
                    query += " AND id = ANY(:candidate_ids)"
                    params["candidate_ids"] = candidate_ids

                if date_range:
                    query += " AND created_at BETWEEN :start_date AND :end_date"
                    params["start_date"] = date_range[0]
                    params["end_date"] = date_range[1]

                query += " ORDER BY created_at DESC LIMIT 1000"

                result = await db.execute(query, params)
                candidates = result.fetchall()

                return [dict(row._mapping) for row in candidates]

            except Exception as e:
                logger.error(f"Error fetching candidates: {e}")
                return []

        return []

    async def _enrich_candidate(self, candidate: Dict[str, Any]) -> bool:
        """Enrich candidate data"""
        try:
            # Add geographic enrichment
            geo_data = await self._enrich_geographic_data(candidate["pin_code"])

            # Add language enrichment
            language_data = await self._enrich_language_data(candidate["language_detected"])

            # Add demographic enrichment
            demographic_data = await self._enrich_demographic_data(candidate["phone"])

            # Update candidate with enriched data
            async for db in get_db():
                try:
                    update_query = text("""
                        UPDATE candidates
                        SET
                            geo_data = :geo_data,
                            language_data = :language_data,
                            demographic_data = :demographic_data,
                            enriched_at = :enriched_at,
                            updated_at = :updated_at
                        WHERE id = :candidate_id
                    """)

                    await db.execute(update_query, {
                        "candidate_id": candidate["id"],
                        "geo_data": json.dumps(geo_data),
                        "language_data": json.dumps(language_data),
                        "demographic_data": json.dumps(demographic_data),
                        "enriched_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    })

                    await db.commit()
                    return True

                except Exception as e:
                    logger.error(f"Error updating candidate {candidate['id']}: {e}")
                    await db.rollback()
                    return False

        except Exception as e:
            logger.error(f"Error enriching candidate {candidate['id']}: {e}")
            return False

    async def _enrich_geographic_data(self, pin_code: str) -> Dict[str, Any]:
        """Enrich geographic data from pin code"""
        # Mock geographic data
        return {
            "pin_code": pin_code,
            "city": "Mumbai",
            "state": "Maharashtra",
            "country": "India",
            "latitude": 18.9402,
            "longitude": 72.8351,
            "region": "West",
            "tier": 1
        }

    async def _enrich_language_data(self, language: str) -> Dict[str, Any]:
        """Enrich language data"""
        # Mock language data
        return {
            "language": language,
            "language_family": "Indo-Aryan",
            "script": "Devanagari",
            "speakers_millions": 600,
            "official": True
        }

    async def _enrich_demographic_data(self, phone: str) -> Dict[str, Any]:
        """Enrich demographic data from phone number"""
        # Mock demographic data
        return {
            "phone": phone,
            "operator": "Jio",
            "circle": "Maharashtra",
            "type": "mobile"
        }

    async def _get_transcripts_for_normalization(
        self,
        transcript_ids: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Get transcripts for normalization"""
        async for db in get_db():
            try:
                query = text("""
                    SELECT
                        id,
                        candidate_id,
                        raw_text,
                        language_detected,
                        created_at
                    FROM transcripts
                    WHERE normalized = false
                """)

                params = {}

                if transcript_ids:
                    query += " AND id = ANY(:transcript_ids)"
                    params["transcript_ids"] = transcript_ids

                query += " ORDER BY created_at DESC LIMIT 1000"

                result = await db.execute(query, params)
                transcripts = result.fetchall()

                return [dict(row._mapping) for row in transcripts]

            except Exception as e:
                logger.error(f"Error fetching transcripts: {e}")
                return []

        return []

    async def _normalize_transcript(self, transcript: Dict[str, Any]) -> bool:
        """Normalize transcript text"""
        try:
            raw_text = transcript["raw_text"]
            language = transcript["language_detected"]

            # Apply normalization rules
            normalized_text = await self._apply_normalization_rules(raw_text, language)

            # Update transcript with normalized text
            async for db in get_db():
                try:
                    update_query = text("""
                        UPDATE transcripts
                        SET
                            normalized_text = :normalized_text,
                            normalized = true,
                            normalized_at = :normalized_at,
                            updated_at = :updated_at
                        WHERE id = :transcript_id
                    """)

                    await db.execute(update_query, {
                        "transcript_id": transcript["id"],
                        "normalized_text": normalized_text,
                        "normalized_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    })

                    await db.commit()
                    return True

                except Exception as e:
                    logger.error(f"Error updating transcript {transcript['id']}: {e}")
                    await db.rollback()
                    return False

        except Exception as e:
            logger.error(f"Error normalizing transcript {transcript['id']}: {e}")
            return False

    async def _apply_normalization_rules(self, text: str, language: str) -> str:
        """Apply language-specific normalization rules"""
        normalized = text

        # Normalize numbers
        normalized = self._normalize_numbers(normalized, language)

        # Normalize dates
        normalized = self._normalize_dates(normalized, language)

        # Normalize currency
        normalized = self._normalize_currency(normalized, language)

        # Normalize units
        normalized = self._normalize_units(normalized, language)

        # Clean up extra spaces
        normalized = re.sub(r'\s+', ' ', normalized).strip()

        return normalized

    def _normalize_numbers(self, text: str, language: str) -> str:
        """Normalize numbers to canonical format"""
        # Indian number words to digits
        number_map = {
            "ek": "1", "do": "2", "teen": "3", "chaar": "4", "paanch": "5",
            "che": "6", "saat": "7", "aath": "8", "nau": "9", "das": "10",
            "one": "1", "two": "2", "three": "3", "four": "4", "five": "5",
            "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10"
        }

        for word, digit in number_map.items():
            text = re.sub(rf'\b{word}\b', digit, text, flags=re.IGNORECASE)

        return text

    def _normalize_dates(self, text: str, language: str) -> str:
        """Normalize dates to canonical format"""
        # Indian date formats
        date_patterns = [
            (r'(\d{1,2})/(\d{1,2})/(\d{4})', r'\3-\2-\1'),  # DD/MM/YYYY to YYYY-MM-DD
            (r'(\d{1,2})-(\d{1,2})-(\d{4})', r'\3-\2-\1'),  # DD-MM-YYYY to YYYY-MM-DD
        ]

        for pattern, replacement in date_patterns:
            text = re.sub(pattern, replacement, text)

        return text

    def _normalize_currency(self, text: str, language: str) -> str:
        """Normalize currency to canonical format"""
        # Indian currency formats
        currency_patterns = [
            (r'Rs\.?\s*(\d+(?:,\d+)*)', r'₹\1'),  # Rs. to ₹
            (r'(\d+(?:,\d+)*)\s*rupees?', r'₹\1'),  # rupees to ₹
            (r'₹(\d+),(\d+)', r'₹\1\2'),  # Remove comma separator
        ]

        for pattern, replacement in currency_patterns:
            text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

        return text

    def _normalize_units(self, text: str, language: str) -> str:
        """Normalize units to canonical format"""
        # Indian unit conversions
        unit_map = {
            "lakh": "100000",
            "crore": "10000000",
            "thousand": "1000",
            "hundred": "100"
        }

        for unit, value in unit_map.items():
            text = re.sub(rf'\b(\d+)\s*{unit}\b', rf'\1 {value}', text, flags=re.IGNORECASE)

        return text

    async def _get_sessions_for_scorecard_calculation(
        self,
        session_ids: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Get sessions for scorecard calculation"""
        async for db in get_db():
            try:
                query = text("""
                    SELECT
                        id,
                        candidate_id,
                        transcript_segments,
                        interview_state,
                        created_at
                    FROM candidate_sessions
                    WHERE interview_state = 'completed'
                    AND scorecard_id IS NULL
                """)

                params = {}

                if session_ids:
                    query += " AND id = ANY(:session_ids)"
                    params["session_ids"] = session_ids

                query += " ORDER BY created_at DESC LIMIT 1000"

                result = await db.execute(query, params)
                sessions = result.fetchall()

                return [dict(row._mapping) for row in sessions]

            except Exception as e:
                logger.error(f"Error fetching sessions: {e}")
                return []

        return []

    async def _calculate_scorecard(self, session: Dict[str, Any]) -> bool:
        """Calculate scorecard for session"""
        try:
            # Import Assessor agent
            from src.agents.assessor import AssessorAgent
            from src.agents.state import CandidateSessionState

            # Create session state
            session_state: CandidateSessionState = {
                "session_id": session["id"],
                "candidate_phone": "",
                "candidate_pin_code": "",
                "campaign_id": None,
                "requisition_id": None,
                "interview_state": session["interview_state"],
                "current_question_index": 0,
                "total_questions": 5,
                "interview_duration_seconds": 0,
                "language_detected": "hi-IN",
                "inbound_channel": "ivr",
                "transcript_segments": json.loads(session.get("transcript_segments", "[]")),
                "question_responses": [],
                "scorecard": None,
                "matched_requisitions": [],
                "drop_off_count": 0,
                "last_question_asked": None,
                "recovery_context": None,
                "created_at": session["created_at"],
                "last_active_at": session["created_at"],
                "completed_at": session["created_at"]
            }

            # Calculate scorecard
            assessor = AssessorAgent()
            updated_state = await assessor.evaluate_candidate(session_state)

            # Store scorecard
            if updated_state.get("scorecard"):
                async for db in get_db():
                    try:
                        insert_query = text("""
                            INSERT INTO scorecards (
                                candidate_id,
                                session_id,
                                overall_score,
                                communication_score,
                                domain_knowledge_score,
                                situational_judgment_score,
                                confidence_score,
                                language_fluency,
                                assessor_notes,
                                recommended_roles,
                                shortlist_flag,
                                created_at
                            ) VALUES (
                                :candidate_id,
                                :session_id,
                                :overall_score,
                                :communication_score,
                                :domain_knowledge_score,
                                :situational_judgment_score,
                                :confidence_score,
                                :language_fluency,
                                :assessor_notes,
                                :recommended_roles,
                                :shortlist_flag,
                                :created_at
                            )
                        """)

                        scorecard = updated_state["scorecard"]

                        await db.execute(insert_query, {
                            "candidate_id": session["candidate_id"],
                            "session_id": session["id"],
                            "overall_score": scorecard["overall_score"],
                            "communication_score": scorecard["communication_score"],
                            "domain_knowledge_score": scorecard["domain_knowledge_score"],
                            "situational_judgment_score": scorecard["situational_judgment_score"],
                            "confidence_score": scorecard["confidence_score"],
                            "language_fluency": scorecard["language_fluency"],
                            "assessor_notes": scorecard["assessor_notes"],
                            "recommended_roles": json.dumps(scorecard["recommended_roles"]),
                            "shortlist_flag": scorecard["shortlist_flag"],
                            "created_at": datetime.utcnow()
                        })

                        await db.commit()
                        return True

                    except Exception as e:
                        logger.error(f"Error storing scorecard for session {session['id']}: {e}")
                        await db.rollback()
                        return False

            return False

        except Exception as e:
            logger.error(f"Error calculating scorecard for session {session['id']}: {e}")
            return False

    async def _get_events_for_audit_trail(
        self,
        date_range: Optional[Tuple[datetime, datetime]] = None
    ) -> List[Dict[str, Any]]:
        """Get events for audit trail"""
        async for db in get_db():
            try:
                query = text("""
                    SELECT
                        id,
                        event_type,
                        entity_type,
                        entity_id,
                        user_id,
                        changes,
                        created_at
                    FROM events
                    WHERE audited = false
                """)

                params = {}

                if date_range:
                    query += " AND created_at BETWEEN :start_date AND :end_date"
                    params["start_date"] = date_range[0]
                    params["end_date"] = date_range[1]

                query += " ORDER BY created_at DESC LIMIT 1000"

                result = await db.execute(query, params)
                events = result.fetchall()

                return [dict(row._mapping) for row in events]

            except Exception as e:
                logger.error(f"Error fetching events: {e}")
                return []

        return []

    async def _create_audit_entry(self, event: Dict[str, Any]) -> bool:
        """Create audit entry from event"""
        try:
            async for db in get_db():
                try:
                    insert_query = text("""
                        INSERT INTO audit_trail (
                            event_id,
                            event_type,
                            entity_type,
                            entity_id,
                            user_id,
                            changes,
                            ip_address,
                            user_agent,
                            created_at
                        ) VALUES (
                            :event_id,
                            :event_type,
                            :entity_type,
                            :entity_id,
                            :user_id,
                            :changes,
                            :ip_address,
                            :user_agent,
                            :created_at
                        )
                    """)

                    await db.execute(insert_query, {
                        "event_id": event["id"],
                        "event_type": event["event_type"],
                        "entity_type": event["entity_type"],
                        "entity_id": event["entity_id"],
                        "user_id": event.get("user_id"),
                        "changes": json.dumps(event.get("changes", {})),
                        "ip_address": event.get("ip_address", "127.0.0.1"),
                        "user_agent": event.get("user_agent", "AROHAN-ETL"),
                        "created_at": event["created_at"]
                    })

                    # Mark event as audited
                    update_query = text("""
                        UPDATE events
                        SET audited = true, audited_at = :audited_at
                        WHERE id = :event_id
                    """)

                    await db.execute(update_query, {
                        "event_id": event["id"],
                        "audited_at": datetime.utcnow()
                    })

                    await db.commit()
                    return True

                except Exception as e:
                    logger.error(f"Error creating audit entry for event {event['id']}: {e}")
                    await db.rollback()
                    return False

        except Exception as e:
            logger.error(f"Error creating audit entry: {e}")
            return False

    async def _get_entities_for_validation(
        self,
        entity_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get entities for validation"""
        async for db in get_db():
            try:
                if entity_type == "candidates":
                    query = text("""
                        SELECT id, phone, pin_code, language_detected, status
                        FROM candidates
                        LIMIT 1000
                    """)
                elif entity_type == "transcripts":
                    query = text("""
                        SELECT id, candidate_id, raw_text, language_detected
                        FROM transcripts
                        LIMIT 1000
                    """)
                elif entity_type == "scorecards":
                    query = text("""
                        SELECT id, candidate_id, overall_score, communication_score
                        FROM scorecards
                        LIMIT 1000
                    """)
                else:
                    # Validate all entity types
                    query = text("""
                        SELECT 'candidate' as entity_type, id, phone as identifier
                        FROM candidates
                        UNION ALL
                        SELECT 'transcript' as entity_type, id, candidate_id as identifier
                        FROM transcripts
                        UNION ALL
                        SELECT 'scorecard' as entity_type, id, candidate_id as identifier
                        FROM scorecards
                        LIMIT 1000
                    """)

                result = await db.execute(query)
                entities = result.fetchall()

                return [dict(row._mapping) for row in entities]

            except Exception as e:
                logger.error(f"Error fetching entities: {e}")
                return []

        return []

    async def _validate_entity(self, entity: Dict[str, Any]) -> Dict[str, Any]:
        """Validate entity data quality"""
        issues = []

        # Common validations
        if not entity.get("id"):
            issues.append({
                "severity": "critical",
                "field": "id",
                "message": "Missing entity ID"
            })

        # Entity-specific validations
        entity_type = entity.get("entity_type", "unknown")

        if entity_type == "candidate":
            # Validate candidate data
            if not entity.get("phone"):
                issues.append({
                    "severity": "critical",
                    "field": "phone",
                    "message": "Missing phone number"
                })

            if not entity.get("pin_code"):
                issues.append({
                    "severity": "warning",
                    "field": "pin_code",
                    "message": "Missing pin code"
                })

            if not entity.get("language_detected"):
                issues.append({
                    "severity": "warning",
                    "field": "language_detected",
                    "message": "Missing language detection"
                })

        elif entity_type == "transcript":
            # Validate transcript data
            if not entity.get("candidate_id"):
                issues.append({
                    "severity": "critical",
                    "field": "candidate_id",
                    "message": "Missing candidate ID"
                })

        elif entity_type == "scorecard":
            # Validate scorecard data
            if not entity.get("candidate_id"):
                issues.append({
                    "severity": "critical",
                    "field": "candidate_id",
                    "message": "Missing candidate ID"
                })

            overall_score = entity.get("overall_score")
            if overall_score is None or not (0 <= overall_score <= 100):
                issues.append({
                    "severity": "critical",
                    "field": "overall_score",
                    "message": f"Invalid overall score: {overall_score}"
                })

        return {
            "valid": len(issues) == 0,
            "issues": issues
        }


# Global ETL pipeline instance
etl_pipeline = ETLPipeline()