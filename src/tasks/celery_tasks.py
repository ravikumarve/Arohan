"""
AROHAN Celery Tasks
Background task processing for audio, data, and ETL operations
"""

from typing import Dict, Any, Optional, List
from datetime import datetime
import asyncio
from celery import Celery
from celery.schedules import crontab

from src.config.settings import settings
from src.tasks.etl import ETLPipeline

# Create Celery app
celery_app = Celery(
    'arohan_tasks',
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Kolkata',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Configure periodic tasks
celery_app.conf.beat_schedule = {
    'candidate-enrichment-every-hour': {
        'task': 'src.tasks.celery_tasks.run_candidate_enrichment',
        'schedule': crontab(minute=0),  # Every hour
    },
    'transcript-normalization-every-30-minutes': {
        'task': 'src.tasks.celery_tasks.run_transcript_normalization',
        'schedule': crontab(minute='*/30'),  # Every 30 minutes
    },
    'scorecard-calculation-every-15-minutes': {
        'task': 'src.tasks.celery_tasks.run_scorecard_calculation',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
    },
    'audit-trail-generation-daily': {
        'task': 'src.tasks.celery_tasks.run_audit_trail_generation',
        'schedule': crontab(hour=2, minute=0),  # Daily at 2 AM
    },
    'data-quality-validation-daily': {
        'task': 'src.tasks.celery_tasks.run_data_quality_validation',
        'schedule': crontab(hour=3, minute=0),  # Daily at 3 AM
    },
}


@celery_app.task(bind=True, name='src.tasks.celery_tasks.process_audio')
def process_audio(self, audio_data: bytes, session_id: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process audio data through STT pipeline

    Args:
        audio_data: Raw audio data
        session_id: Interview session ID
        metadata: Audio metadata (language, duration, etc.)

    Returns:
        Processing result with transcript
    """
    try:
        # Import STT pipeline
        from src.nlp.stt import STTPipeline

        # Create STT pipeline
        stt_pipeline = STTPipeline()

        # Process audio (run async in sync context)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            result = loop.run_until_complete(
                stt_pipeline.transcribe(
                    audio_data,
                    language=metadata.get("language"),
                    use_fallback=metadata.get("use_fallback", False)
                )
            )
        finally:
            loop.close()

        return {
            "success": True,
            "session_id": session_id,
            "transcript": result.get("text", ""),
            "confidence": result.get("confidence", 0.0),
            "language_detected": result.get("language_detected"),
            "stt_engine": result.get("stt_engine"),
            "processing_time_ms": result.get("processing_time_ms"),
            "processed_at": datetime.utcnow().isoformat()
        }

    except Exception as e:
        return {
            "success": False,
            "session_id": session_id,
            "error": str(e),
            "processed_at": datetime.utcnow().isoformat()
        }


@celery_app.task(bind=True, name='src.tasks.celery_tasks.run_agent_workflow')
def run_agent_workflow(self, session_id: str, audio_data: Optional[bytes] = None) -> Dict[str, Any]:
    """
    Run agent workflow for interview session

    Args:
        session_id: Interview session ID
        audio_data: Optional audio data from candidate

    Returns:
        Workflow execution result
    """
    try:
        # Import agent orchestrator
        from src.agents.orchestrator import orchestrator

        # Create event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            if audio_data:
                # Continue session with audio
                result = loop.run_until_complete(
                    orchestrator.continue_session(session_id, audio_data)
                )
            else:
                # Get session state
                result = loop.run_until_complete(
                    orchestrator.get_session_state(session_id)
                )
        finally:
            loop.close()

        return {
            "success": True,
            "session_id": session_id,
            "session_state": result.get("interview_state"),
            "current_question": result.get("last_question_asked"),
            "transcript_segments": len(result.get("transcript_segments", [])),
            "scorecard": result.get("scorecard"),
            "matched_requisitions": len(result.get("matched_requisitions", [])),
            "processed_at": datetime.utcnow().isoformat()
        }

    except Exception as e:
        return {
            "success": False,
            "session_id": session_id,
            "error": str(e),
            "processed_at": datetime.utcnow().isoformat()
        }


@celery_app.task(bind=True, name='src.tasks.celery_tasks.run_candidate_enrichment')
def run_candidate_enrichment(self) -> Dict[str, Any]:
    """
    Run candidate enrichment ETL pipeline

    Returns:
        Pipeline execution result
    """
    try:
        # Create ETL pipeline
        etl = ETLPipeline()

        # Create event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            result = loop.run_until_complete(
                etl.run_candidate_enrichment_pipeline()
            )
        finally:
            loop.close()

        return result

    except Exception as e:
        return {
            "pipeline": "candidate_enrichment",
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.utcnow().isoformat()
        }


@celery_app.task(bind=True, name='src.tasks.celery_tasks.run_transcript_normalization')
def run_transcript_normalization(self) -> Dict[str, Any]:
    """
    Run transcript normalization ETL pipeline

    Returns:
        Pipeline execution result
    """
    try:
        # Create ETL pipeline
        etl = ETLPipeline()

        # Create event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            result = loop.run_until_complete(
                etl.run_transcript_normalization_pipeline()
            )
        finally:
            loop.close()

        return result

    except Exception as e:
        return {
            "pipeline": "transcript_normalization",
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.utcnow().isoformat()
        }


@celery_app.task(bind=True, name='src.tasks.celery_tasks.run_scorecard_calculation')
def run_scorecard_calculation(self) -> Dict[str, Any]:
    """
    Run scorecard calculation ETL pipeline

    Returns:
        Pipeline execution result
    """
    try:
        # Create ETL pipeline
        etl = ETLPipeline()

        # Create event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            result = loop.run_until_complete(
                etl.run_scorecard_calculation_pipeline()
            )
        finally:
            loop.close()

        return result

    except Exception as e:
        return {
            "pipeline": "scorecard_calculation",
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.utcnow().isoformat()
        }


@celery_app.task(bind=True, name='src.tasks.celery_tasks.run_audit_trail_generation')
def run_audit_trail_generation(self) -> Dict[str, Any]:
    """
    Run audit trail generation ETL pipeline

    Returns:
        Pipeline execution result
    """
    try:
        # Create ETL pipeline
        etl = ETLPipeline()

        # Create event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            result = loop.run_until_complete(
                etl.run_audit_trail_pipeline()
            )
        finally:
            loop.close()

        return result

    except Exception as e:
        return {
            "pipeline": "audit_trail_generation",
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.utcnow().isoformat()
        }


@celery_app.task(bind=True, name='src.tasks.celery_tasks.run_data_quality_validation')
def run_data_quality_validation(self) -> Dict[str, Any]:
    """
    Run data quality validation ETL pipeline

    Returns:
        Pipeline execution result
    """
    try:
        # Create ETL pipeline
        etl = ETLPipeline()

        # Create event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            result = loop.run_until_complete(
                etl.run_data_quality_pipeline()
            )
        finally:
            loop.close()

        return result

    except Exception as e:
        return {
            "pipeline": "data_quality_validation",
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.utcnow().isoformat()
        }


@celery_app.task(bind=True, name='src.tasks.celery_tasks.send_whatsapp_notification')
def send_whatsapp_notification(self, phone_number: str, message: str, session_id: str) -> Dict[str, Any]:
    """
    Send WhatsApp notification to candidate

    Args:
        phone_number: Candidate's phone number
        message: Message to send
        session_id: Session ID for tracking

    Returns:
        Notification sending result
    """
    try:
        # Import Meta MCP server
        from src.mcp.meta_server import MetaMCPServer

        # Create Meta server
        meta_server = MetaMCPServer()

        # Create event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            result = loop.run_until_complete(
                meta_server.send_text_message(phone_number, message, session_id)
            )
        finally:
            loop.close()

        return {
            "success": result.get("success", False),
            "phone_number": phone_number,
            "message_id": result.get("message_id"),
            "session_id": session_id,
            "sent_at": datetime.utcnow().isoformat()
        }

    except Exception as e:
        return {
            "success": False,
            "phone_number": phone_number,
            "session_id": session_id,
            "error": str(e),
            "sent_at": datetime.utcnow().isoformat()
        }


@celery_app.task(bind=True, name='src.tasks.celery_tasks.dispatch_ats_webhook')
def dispatch_ats_webhook(self, candidate_id: str, requisition_id: str, webhook_url: str) -> Dict[str, Any]:
    """
    Dispatch webhook to employer's ATS system

    Args:
        candidate_id: Candidate ID
        requisition_id: Requisition ID
        webhook_url: ATS webhook URL

    Returns:
        Webhook dispatch result
    """
    try:
        # Import Matchmaker agent
        from src.agents.matchmaker import MatchmakerAgent

        # Create Matchmaker agent
        matchmaker = MatchmakerAgent()

        # Create event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            result = loop.run_until_complete(
                matchmaker.dispatch_ats_webhook(candidate_id, requisition_id, {
                    "webhook_url": webhook_url,
                    "timestamp": datetime.utcnow().isoformat()
                })
            )
        finally:
            loop.close()

        return {
            "success": result,
            "candidate_id": candidate_id,
            "requisition_id": requisition_id,
            "webhook_url": webhook_url,
            "dispatched_at": datetime.utcnow().isoformat()
        }

    except Exception as e:
        return {
            "success": False,
            "candidate_id": candidate_id,
            "requisition_id": requisition_id,
            "webhook_url": webhook_url,
            "error": str(e),
            "dispatched_at": datetime.utcnow().isoformat()
        }


@celery_app.task(bind=True, name='src.tasks.celery_tasks.cleanup_old_sessions')
def cleanup_old_sessions(self, days_old: int = 7) -> Dict[str, Any]:
    """
    Clean up old session data

    Args:
        days_old: Age threshold in days

    Returns:
        Cleanup result
    """
    try:
        # Calculate cutoff date
        cutoff_date = datetime.utcnow() - timedelta(days=days_old)

        # In real implementation, would delete old sessions from database
        # For now, return mock result

        return {
            "success": True,
            "cutoff_date": cutoff_date.isoformat(),
            "sessions_cleaned": 100,  # Mock value
            "cleaned_at": datetime.utcnow().isoformat()
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "cleaned_at": datetime.utcnow().isoformat()
        }


@celery_app.task(bind=True, name='src.tasks.celery_tasks.generate_daily_report')
def generate_daily_report(self) -> Dict[str, Any]:
    """
    Generate daily analytics report

    Returns:
        Report generation result
    """
    try:
        # In real implementation, would generate comprehensive daily report
        # For now, return mock result

        return {
            "success": True,
            "report_date": datetime.utcnow().date().isoformat(),
            "metrics": {
                "total_interviews": 150,
                "completed_interviews": 120,
                "shortlisted_candidates": 45,
                "average_score": 72.5,
                "stt_success_rate": 98.5,
                "agent_accuracy": 92.3
            },
            "generated_at": datetime.utcnow().isoformat()
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "generated_at": datetime.utcnow().isoformat()
        }