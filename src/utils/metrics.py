"""
Prometheus Metrics Configuration for AROHAN
Comprehensive metrics collection for monitoring and observability
"""

from prometheus_client import Counter, Histogram, Gauge, Info
from prometheus_fastapi_instrumentator import Instrumentator
from functools import wraps
import time
from typing import Callable, Any
import asyncio


# Business Metrics
interview_sessions_total = Counter(
    'arohan_interview_sessions_total',
    'Total number of interview sessions initiated',
    ['channel', 'language']
)

interview_sessions_completed = Counter(
    'arohan_interview_sessions_completed',
    'Total number of interview sessions completed',
    ['channel', 'language', 'result']
)

interview_sessions_failed = Counter(
    'arohan_interview_sessions_failed',
    'Total number of interview sessions that failed',
    ['channel', 'error_type']
)

drop_off_recovery_total = Counter(
    'arohan_drop_off_recovery_total',
    'Total number of drop-off recovery attempts',
    ['channel', 'success']
)

# STT Pipeline Metrics
stt_requests_total = Counter(
    'arohan_stt_requests_total',
    'Total number of STT requests',
    ['provider', 'language']
)

stt_requests_duration = Histogram(
    'arohan_stt_requests_duration_seconds',
    'STT request duration in seconds',
    ['provider', 'language'],
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0, 60.0]
)

stt_requests_failed = Counter(
    'arohan_stt_requests_failed',
    'Total number of failed STT requests',
    ['provider', 'error_type']
)

# Agent Metrics
agent_invocations_total = Counter(
    'arohan_agent_invocations_total',
    'Total number of agent invocations',
    ['agent_name', 'operation']
)

agent_execution_duration = Histogram(
    'arohan_agent_execution_duration_seconds',
    'Agent execution duration in seconds',
    ['agent_name', 'operation'],
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0]
)

agent_errors_total = Counter(
    'arohan_agent_errors_total',
    'Total number of agent errors',
    ['agent_name', 'error_type']
)

# Database Metrics
db_queries_total = Counter(
    'arohan_db_queries_total',
    'Total number of database queries',
    ['operation', 'table']
)

db_queries_duration = Histogram(
    'arohan_db_queries_duration_seconds',
    'Database query duration in seconds',
    ['operation', 'table'],
    buckets=[0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1.0, 5.0]
)

db_connections_active = Gauge(
    'arohan_db_connections_active',
    'Number of active database connections'
)

# External API Metrics
external_api_requests_total = Counter(
    'arohan_external_api_requests_total',
    'Total number of external API requests',
    ['service', 'endpoint', 'method']
)

external_api_requests_duration = Histogram(
    'arohan_external_api_requests_duration_seconds',
    'External API request duration in seconds',
    ['service', 'endpoint', 'method'],
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0]
)

external_api_requests_failed = Counter(
    'arohan_external_api_requests_failed',
    'Total number of failed external API requests',
    ['service', 'endpoint', 'error_type']
)

# Task Queue Metrics
celery_tasks_total = Counter(
    'arohan_celery_tasks_total',
    'Total number of Celery tasks processed',
    ['task_name', 'status']
)

celery_tasks_duration = Histogram(
    'arohan_celery_tasks_duration_seconds',
    'Celery task duration in seconds',
    ['task_name'],
    buckets=[0.5, 1.0, 5.0, 10.0, 30.0, 60.0, 300.0]
)

celery_queue_length = Gauge(
    'arohan_celery_queue_length',
    'Number of tasks in Celery queue',
    ['queue_name']
)

# Cache/Redis Metrics
redis_operations_total = Counter(
    'arohan_redis_operations_total',
    'Total number of Redis operations',
    ['operation', 'status']
)

redis_operations_duration = Histogram(
    'arohan_redis_operations_duration_seconds',
    'Redis operation duration in seconds',
    ['operation'],
    buckets=[0.001, 0.005, 0.01, 0.05, 0.1, 0.5]
)

redis_connections_active = Gauge(
    'arohan_redis_connections_active',
    'Number of active Redis connections'
)

# Scorecard Metrics
scorecard_generation_duration = Histogram(
    'arohan_scorecard_generation_duration_seconds',
    'Scorecard generation duration in seconds',
    buckets=[0.5, 1.0, 2.0, 5.0, 10.0, 30.0]
)

scorecard_scores = Histogram(
    'arohan_scorecard_scores',
    'Distribution of scorecard scores',
    ['score_type'],
    buckets=[i for i in range(0, 101, 5)]
)

# Matching Metrics
requisition_matches_total = Counter(
    'arohan_requisition_matches_total',
    'Total number of requisition matches',
    ['result']
)

matching_duration = Histogram(
    'arohan_matching_duration_seconds',
    'Candidate-to-requisition matching duration in seconds',
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0]
)

# System Info
system_info = Info(
    'arohan_build_info',
    'AROHAN build information'
)


def track_agent_execution(agent_name: str, operation: str):
    """Decorator to track agent execution metrics"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            agent_invocations_total.labels(
                agent_name=agent_name,
                operation=operation
            ).inc()
            
            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time
                agent_execution_duration.labels(
                    agent_name=agent_name,
                    operation=operation
                ).observe(duration)
                return result
            except Exception as e:
                agent_errors_total.labels(
                    agent_name=agent_name,
                    error_type=type(e).__name__
                ).inc()
                raise
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            agent_invocations_total.labels(
                agent_name=agent_name,
                operation=operation
            ).inc()
            
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                agent_execution_duration.labels(
                    agent_name=agent_name,
                    operation=operation
                ).observe(duration)
                return result
            except Exception as e:
                agent_errors_total.labels(
                    agent_name=agent_name,
                    error_type=type(e).__name__
                ).inc()
                raise
        
        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    return decorator


def track_external_api_call(service: str, endpoint: str, method: str):
    """Decorator to track external API call metrics"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            external_api_requests_total.labels(
                service=service,
                endpoint=endpoint,
                method=method
            ).inc()
            
            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time
                external_api_requests_duration.labels(
                    service=service,
                    endpoint=endpoint,
                    method=method
                ).observe(duration)
                return result
            except Exception as e:
                external_api_requests_failed.labels(
                    service=service,
                    endpoint=endpoint,
                    error_type=type(e).__name__
                ).inc()
                raise
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            external_api_requests_total.labels(
                service=service,
                endpoint=endpoint,
                method=method
            ).inc()
            
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                external_api_requests_duration.labels(
                    service=service,
                    endpoint=endpoint,
                    method=method
                ).observe(duration)
                return result
            except Exception as e:
                external_api_requests_failed.labels(
                    service=service,
                    endpoint=endpoint,
                    error_type=type(e).__name__
                ).inc()
                raise
        
        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    return decorator


def setup_metrics(app):
    """Setup Prometheus metrics for FastAPI application"""
    
    # Create instrumentator
    instrumentator = Instrumentator(
        should_group_status_codes=False,
        should_ignore_untemplated=True,
        should_group_untemplated=True,
        should_instrument_requests_inprogress=True,
        should_instrument_requests_duration=True,
        excluded_handlers=["/metrics"],
        env_var_name="ENABLE_METRICS",
        inprogress_url_pattern="/metrics/inprogress",
        inprogress_labels=True,
    )
    
    # Instrument the app
    instrumentator.instrument(app).expose(app, endpoint="/metrics")
    
    # Set system info
    system_info.info({
        'version': '2.0.0',
        'environment': 'production'
    })
    
    return instrumentator


def get_metrics_summary():
    """Get summary of key metrics for health checks"""
    return {
        'interview_sessions': {
            'total': interview_sessions_total._value.get(),
            'completed': interview_sessions_completed._value.get(),
            'failed': interview_sessions_failed._value.get()
        },
        'stt_requests': {
            'total': stt_requests_total._value.get(),
            'failed': stt_requests_failed._value.get()
        },
        'agent_invocations': agent_invocations_total._value.get(),
        'external_api_requests': external_api_requests_total._value.get(),
        'celery_tasks': celery_tasks_total._value.get()
    }