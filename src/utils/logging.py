"""
AROHAN Logging Configuration
Structured logging setup with JSON output and correlation IDs for distributed tracing
"""

import structlog
import logging
import sys
import uuid
from contextvars import ContextVar
from typing import Optional
from src.config.settings import settings

# Context variable for correlation ID
correlation_id: ContextVar[Optional[str]] = ContextVar('correlation_id', default=None)


def get_correlation_id() -> str:
    """Get or create correlation ID for current request"""
    cid = correlation_id.get()
    if cid is None:
        cid = str(uuid.uuid4())
        correlation_id.set(cid)
    return cid


def set_correlation_id(cid: str) -> None:
    """Set correlation ID for current request"""
    correlation_id.set(cid)


def add_correlation_id_processor(logger, method_name, event_dict):
    """Add correlation ID to log entries"""
    cid = get_correlation_id()
    if cid:
        event_dict['correlation_id'] = cid
    return event_dict


def add_service_info_processor(logger, method_name, event_dict):
    """Add service information to log entries"""
    event_dict['service'] = 'arohan-api'
    event_dict['environment'] = settings.ENVIRONMENT
    event_dict['version'] = '2.0.0'
    return event_dict


def setup_logging():
    """Configure structured logging for the application"""

    # Configure standard logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, settings.LOG_LEVEL.upper())
    )

    # Configure structlog processors
    processors = [
        structlog.contextvars.merge_contextvars,
        add_correlation_id_processor,
        add_service_info_processor,
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.dev.set_exc_info,
        structlog.processors.TimeStamper(fmt="iso"),
    ]

    # Add JSON renderer for production, console for development
    if not settings.DEBUG:
        processors.append(structlog.processors.JSONRenderer())
    else:
        processors.append(structlog.dev.ConsoleRenderer())

    structlog.configure(
        processors=processors,
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str = None) -> structlog.BoundLogger:
    """Get a structured logger instance"""
    return structlog.get_logger(name)


class LoggingMiddleware:
    """Middleware to add correlation IDs to requests"""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope['type'] == 'http':
            # Extract correlation ID from headers or create new one
            headers = dict(scope.get('headers', []))
            cid = headers.get(b'x-correlation-id', headers.get(b'x-request-id'))
            
            if cid:
                set_correlation_id(cid.decode('utf-8'))
            else:
                set_correlation_id(str(uuid.uuid4()))

        await self.app(scope, receive, send)