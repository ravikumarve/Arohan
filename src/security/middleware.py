"""
AROHAN Security Middleware
Comprehensive security middleware for API protection
"""

from fastapi import Request, Response, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from typing import Optional, Dict, Any, List
import time
import re
import hashlib
import secrets
from collections import defaultdict
from datetime import datetime, timedelta

from src.config.settings import settings


# ============================================================================
# Security Headers Middleware
# ============================================================================

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    def __init__(
        self,
        app: ASGIApp,
        include_hsts: bool = True,
        hsts_max_age: int = 31536000,
        include_subdomains: bool = True,
        preload: bool = False,
    ):
        super().__init__(app)
        self.include_hsts = include_hsts
        self.hsts_max_age = hsts_max_age
        self.include_subdomains = include_subdomains
        self.preload = preload
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Content Security Policy
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )
        
        # X-Content-Type-Options
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # X-Frame-Options
        response.headers["X-Frame-Options"] = "DENY"
        
        # X-XSS-Protection
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # Referrer-Policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Permissions-Policy
        response.headers["Permissions-Policy"] = (
            "geolocation=(), "
            "microphone=(), "
            "camera=(), "
            "payment=(), "
            "usb=(), "
            "magnetometer=(), "
            "gyroscope=(), "
            "accelerometer=()"
        )
        
        # Strict-Transport-Security (HSTS)
        if self.include_hsts:
            hsts_value = f"max-age={self.hsts_max_age}"
            if self.include_subdomains:
                hsts_value += "; includeSubDomains"
            if self.preload:
                hsts_value += "; preload"
            response.headers["Strict-Transport-Security"] = hsts_value
        
        # Cache-Control for sensitive endpoints
        if request.url.path in ["/auth/login", "/auth/register", "/auth/refresh"]:
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        
        return response


# ============================================================================
# Rate Limiting Middleware
# ============================================================================

class RateLimiter:
    """In-memory rate limiter using sliding window"""
    
    def __init__(self):
        self.requests: Dict[str, List[float]] = defaultdict(list)
        self.cleanup_interval = 300  # 5 minutes
        self.last_cleanup = time.time()
    
    def is_allowed(
        self,
        key: str,
        limit: int,
        window: int
    ) -> bool:
        """Check if request is allowed
        
        Args:
            key: Rate limit key (e.g., user_id or IP)
            limit: Maximum requests per window
            window: Time window in seconds
            
        Returns:
            bool: True if request is allowed
        """
        now = time.time()
        
        # Cleanup old entries
        if now - self.last_cleanup > self.cleanup_interval:
            self._cleanup()
            self.last_cleanup = now
        
        # Get existing requests
        requests = self.requests[key]
        
        # Remove requests outside the window
        requests[:] = [req_time for req_time in requests if now - req_time < window]
        
        # Check if limit exceeded
        if len(requests) >= limit:
            return False
        
        # Add current request
        requests.append(now)
        return True
    
    def _cleanup(self):
        """Clean up old entries"""
        now = time.time()
        for key in list(self.requests.keys()):
            self.requests[key][:] = [
                req_time for req_time in self.requests[key]
                if now - req_time < self.cleanup_interval
            ]
            if not self.requests[key]:
                del self.requests[key]


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    def __init__(
        self,
        app: ASGIApp,
        default_limit: int = 100,
        default_window: int = 60,
        endpoint_limits: Optional[Dict[str, Dict[str, int]]] = None
    ):
        super().__init__(app)
        self.default_limit = default_limit
        self.default_window = default_window
        self.endpoint_limits = endpoint_limits or {}
        self.rate_limiter = RateLimiter()
    
    async def dispatch(self, request: Request, call_next):
        # Get client identifier
        client_id = self._get_client_id(request)
        
        # Get rate limit for endpoint
        endpoint = request.url.path
        limit, window = self._get_rate_limit(endpoint)
        
        # Check rate limit
        if not self.rate_limiter.is_allowed(client_id, limit, window):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Maximum {limit} requests per {window} seconds.",
                headers={
                    "Retry-After": str(window),
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Window": str(window),
                }
            )
        
        # Add rate limit headers
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Window"] = str(window)
        
        return response
    
    def _get_client_id(self, request: Request) -> str:
        """Get client identifier for rate limiting
        
        Args:
            request: HTTP request
            
        Returns:
            str: Client identifier
        """
        # Try to get user ID from token
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]
            # Simple hash of token for identification
            return hashlib.sha256(token.encode()).hexdigest()[:16]
        
        # Fall back to IP address
        client_ip = request.client.host if request.client else "unknown"
        return f"ip:{client_ip}"
    
    def _get_rate_limit(self, endpoint: str) -> tuple[int, int]:
        """Get rate limit for endpoint
        
        Args:
            endpoint: API endpoint path
            
        Returns:
            tuple: (limit, window)
        """
        # Check for specific endpoint limit
        for pattern, limits in self.endpoint_limits.items():
            if re.match(pattern, endpoint):
                return limits.get("limit", self.default_limit), limits.get("window", self.default_window)
        
        # Return default limit
        return self.default_limit, self.default_window


# ============================================================================
# Request Validation Middleware
# ============================================================================

class RequestValidationMiddleware(BaseHTTPMiddleware):
    """Request validation middleware"""
    
    def __init__(
        self,
        app: ASGIApp,
        max_content_length: int = 10 * 1024 * 1024,  # 10MB
        allowed_content_types: Optional[List[str]] = None
    ):
        super().__init__(app)
        self.max_content_length = max_content_length
        self.allowed_content_types = allowed_content_types or [
            "application/json",
            "application/x-www-form-urlencoded",
            "multipart/form-data",
            "text/plain"
        ]
    
    async def dispatch(self, request: Request, call_next):
        # Check content length
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.max_content_length:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Request body too large. Maximum size: {self.max_content_length} bytes",
            )
        
        # Check content type for POST/PUT/PATCH
        if request.method in ["POST", "PUT", "PATCH"]:
            content_type = request.headers.get("content-type", "").split(";")[0].strip()
            if content_type and content_type not in self.allowed_content_types:
                raise HTTPException(
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                    detail=f"Unsupported content type: {content_type}",
                )
        
        # Validate request ID
        request_id = request.headers.get("X-Request-ID")
        if not request_id:
            request_id = secrets.token_urlsafe(16)
        
        # Add request ID to state
        request.state.request_id = request_id
        
        response = await call_next(request)
        
        # Add request ID to response
        response.headers["X-Request-ID"] = request_id
        
        return response


# ============================================================================
# Input Sanitization Middleware
# ============================================================================

class InputSanitizationMiddleware(BaseHTTPMiddleware):
    """Input sanitization middleware"""
    
    # Patterns to detect potential attacks
    SQL_INJECTION_PATTERN = re.compile(
        r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE)\b)",
        re.IGNORECASE
    )
    
    XSS_PATTERN = re.compile(
        r"(<script|<iframe|<object|<embed|javascript:|onerror=|onload=|onclick=)",
        re.IGNORECASE
    )
    
    PATH_TRAVERSAL_PATTERN = re.compile(
        r"(\.\./|\.\.\\\)",
        re.IGNORECASE
    )
    
    COMMAND_INJECTION_PATTERN = re.compile(
        r"(\;|\||\&\&|\$\(|\`)",
        re.IGNORECASE
    )
    
    def __init__(
        self,
        app: ASGIApp,
        sanitize_query_params: bool = True,
        sanitize_path_params: bool = True,
        sanitize_body: bool = True,
        block_suspicious: bool = True
    ):
        super().__init__(app)
        self.sanitize_query_params = sanitize_query_params
        self.sanitize_path_params = sanitize_path_params
        self.sanitize_body = sanitize_body
        self.block_suspicious = block_suspicious
    
    async def dispatch(self, request: Request, call_next):
        # Sanitize query parameters
        if self.sanitize_query_params:
            self._sanitize_params(request.query_params)
        
        # Sanitize path parameters
        if self.sanitize_path_params:
            self._sanitize_params(request.path_params)
        
        # Sanitize body (for JSON requests)
        if self.sanitize_body and request.method in ["POST", "PUT", "PATCH"]:
            content_type = request.headers.get("content-type", "")
            if "application/json" in content_type:
                body = await request.body()
                if body:
                    self._sanitize_json(body.decode())
        
        return await call_next(request)
    
    def _sanitize_params(self, params: Any):
        """Sanitize request parameters
        
        Args:
            params: Request parameters
            
        Raises:
            HTTPException: If suspicious input detected
        """
        if not params:
            return
        
        for key, value in params.items():
            if isinstance(value, str):
                self._check_suspicious_input(value, f"parameter '{key}'")
    
    def _sanitize_json(self, json_str: str):
        """Sanitize JSON body
        
        Args:
            json_str: JSON string
            
        Raises:
            HTTPException: If suspicious input detected
        """
        self._check_suspicious_input(json_str, "request body")
    
    def _check_suspicious_input(self, input_str: str, location: str):
        """Check for suspicious input patterns
        
        Args:
            input_str: Input string to check
            location: Location of input (for error message)
            
        Raises:
            HTTPException: If suspicious input detected
        """
        if not self.block_suspicious:
            return
        
        # Check for SQL injection
        if self.SQL_INJECTION_PATTERN.search(input_str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Potential SQL injection detected in {location}",
            )
        
        # Check for XSS
        if self.XSS_PATTERN.search(input_str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Potential XSS attack detected in {location}",
            )
        
        # Check for path traversal
        if self.PATH_TRAVERSAL_PATTERN.search(input_str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Potential path traversal attack detected in {location}",
            )
        
        # Check for command injection
        if self.COMMAND_INJECTION_PATTERN.search(input_str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Potential command injection detected in {location}",
            )


# ============================================================================
# Security Utilities
# ============================================================================

class SecurityUtils:
    """Security utility functions"""
    
    @staticmethod
    def generate_csrf_token() -> str:
        """Generate CSRF token
        
        Returns:
            str: CSRF token
        """
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def generate_nonce() -> str:
        """Generate nonce for CSP
        
        Returns:
            str: Nonce value
        """
        return secrets.token_urlsafe(16)
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename to prevent path traversal
        
        Args:
            filename: Original filename
            
        Returns:
            str: Sanitized filename
        """
        # Remove path separators
        filename = filename.replace("/", "").replace("\\", "")
        
        # Remove null bytes
        filename = filename.replace("\x00", "")
        
        # Limit length
        if len(filename) > 255:
            name, ext = os.path.splitext(filename)
            filename = name[:255 - len(ext)] + ext
        
        return filename
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format
        
        Args:
            email: Email address
            
        Returns:
            bool: True if valid
        """
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format
        
        Args:
            phone: Phone number
            
        Returns:
            bool: True if valid
        """
        # Remove non-digit characters
        digits = re.sub(r'[^\d]', '', phone)
        
        # Check length (10-15 digits)
        return 10 <= len(digits) <= 15
    
    @staticmethod
    def validate_pin_code(pin_code: str) -> bool:
        """Validate Indian PIN code format
        
        Args:
            pin_code: PIN code
            
        Returns:
            bool: True if valid
        """
        # Indian PIN codes are 6 digits
        return re.match(r'^\d{6}$', pin_code) is not None
    
    @staticmethod
    def mask_sensitive_data(data: str, mask_char: str = "*", visible_chars: int = 4) -> str:
        """Mask sensitive data
        
        Args:
            data: Sensitive data to mask
            mask_char: Character to use for masking
            visible_chars: Number of characters to keep visible
            
        Returns:
            str: Masked data
        """
        if len(data) <= visible_chars:
            return mask_char * len(data)
        
        return data[:visible_chars] + mask_char * (len(data) - visible_chars)


# ============================================================================
# CORS Configuration
# ============================================================================

def get_cors_middleware(
    app: ASGIApp,
    allowed_origins: Optional[List[str]] = None,
    allow_credentials: bool = True,
    allow_methods: Optional[List[str]] = None,
    allow_headers: Optional[List[str]] = None,
    max_age: int = 600
) -> CORSMiddleware:
    """Get CORS middleware with configuration
    
    Args:
        app: ASGI application
        allowed_origins: List of allowed origins
        allow_credentials: Whether to allow credentials
        allow_methods: List of allowed methods
        allow_headers: List of allowed headers
        max_age: Preflight cache max age
        
    Returns:
        CORSMiddleware: Configured CORS middleware
    """
    return CORSMiddleware(
        app=app,
        allow_origins=allowed_origins or ["*"],
        allow_credentials=allow_credentials,
        allow_methods=allow_methods or ["*"],
        allow_headers=allow_headers or ["*"],
        max_age=max_age,
    )


# ============================================================================
# Middleware Factory
# ============================================================================

def create_security_middleware(
    app: ASGIApp,
    enable_security_headers: bool = True,
    enable_rate_limiting: bool = True,
    enable_request_validation: bool = True,
    enable_input_sanitization: bool = True,
    enable_cors: bool = True,
    enable_https_redirect: bool = False,
    enable_trusted_host: bool = False,
) -> ASGIApp:
    """Create and apply security middleware
    
    Args:
        app: ASGI application
        enable_security_headers: Enable security headers
        enable_rate_limiting: Enable rate limiting
        enable_request_validation: Enable request validation
        enable_input_sanitization: Enable input sanitization
        enable_cors: Enable CORS
        enable_https_redirect: Enable HTTPS redirect
        enable_trusted_host: Enable trusted host
        
    Returns:
        ASGIApp: Application with security middleware
    """
    # Apply middleware in reverse order (last applied is first executed)
    
    if enable_trusted_host:
        app = TrustedHostMiddleware(
            app,
            allowed_hosts=settings.allowed_hosts or ["*"]
        )
    
    if enable_https_redirect:
        app = HTTPSRedirectMiddleware(app)
    
    if enable_cors:
        app = get_cors_middleware(
            app,
            allowed_origins=settings.cors_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    
    if enable_input_sanitization:
        app = InputSanitizationMiddleware(app)
    
    if enable_request_validation:
        app = RequestValidationMiddleware(app)
    
    if enable_rate_limiting:
        app = RateLimitMiddleware(
            app,
            default_limit=100,
            default_window=60,
            endpoint_limits={
                r"/auth/.*": {"limit": 5, "window": 60},  # Auth endpoints: 5 requests per minute
                r"/api/.*": {"limit": 100, "window": 60},  # API endpoints: 100 requests per minute
            }
        )
    
    if enable_security_headers:
        app = SecurityHeadersMiddleware(app)
    
    return app