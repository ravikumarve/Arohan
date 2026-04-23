"""
AROHAN Authentication Utilities
JWT token generation and validation with RS256
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
import secrets
import os
from pathlib import Path

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
JWT_ALGORITHM = "RS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 30
JWT_REFRESH_TOKEN_EXPIRE_DAYS = 7

# Key paths
KEYS_DIR = Path(__file__).parent.parent.parent / "config" / "keys"
PRIVATE_KEY_PATH = KEYS_DIR / "jwt_private.pem"
PUBLIC_KEY_PATH = KEYS_DIR / "jwt_public.pem"


def generate_rsa_keys() -> tuple[str, str]:
    """Generate RSA key pair for JWT signing
    
    Returns:
        tuple: (private_key_pem, public_key_pem)
    """
    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.backends import default_backend
    
    # Generate private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )
    
    # Serialize private key
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    
    # Generate public key
    public_key = private_key.public_key()
    
    # Serialize public key
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    
    return private_pem.decode('utf-8'), public_pem.decode('utf-8')


def ensure_keys_exist() -> None:
    """Ensure RSA keys exist, generate if they don't"""
    KEYS_DIR.mkdir(parents=True, exist_ok=True)
    
    if not PRIVATE_KEY_PATH.exists() or not PUBLIC_KEY_PATH.exists():
        print("🔐 Generating RSA keys for JWT signing...")
        private_key, public_key = generate_rsa_keys()
        
        with open(PRIVATE_KEY_PATH, 'w') as f:
            f.write(private_key)
        os.chmod(PRIVATE_KEY_PATH, 0o600)  # Read/write for owner only
        
        with open(PUBLIC_KEY_PATH, 'w') as f:
            f.write(public_key)
        os.chmod(PUBLIC_KEY_PATH, 0o644)  # Read/write for owner, read for others
        
        print("✅ RSA keys generated successfully")


def get_private_key() -> str:
    """Get private key for JWT signing"""
    ensure_keys_exist()
    with open(PRIVATE_KEY_PATH, 'r') as f:
        return f.read()


def get_public_key() -> str:
    """Get public key for JWT verification"""
    ensure_keys_exist()
    with open(PUBLIC_KEY_PATH, 'r') as f:
        return f.read()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password
        
    Returns:
        bool: True if password matches hash
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password
    
    Args:
        password: Plain text password
        
    Returns:
        str: Hashed password
    """
    return pwd_context.hash(password)


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create JWT access token
    
    Args:
        data: Payload data to include in token
        expires_delta: Optional expiration time delta
        
    Returns:
        str: JWT access token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    
    private_key = get_private_key()
    encoded_jwt = jwt.encode(to_encode, private_key, algorithm=JWT_ALGORITHM)
    
    return encoded_jwt


def create_refresh_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create JWT refresh token
    
    Args:
        data: Payload data to include in token
        expires_delta: Optional expiration time delta
        
    Returns:
        str: JWT refresh token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh",
        "jti": secrets.token_urlsafe(32)  # Unique token ID
    })
    
    private_key = get_private_key()
    encoded_jwt = jwt.encode(to_encode, private_key, algorithm=JWT_ALGORITHM)
    
    return encoded_jwt


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and verify JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        Optional[Dict]: Decoded token payload or None if invalid
    """
    try:
        public_key = get_public_key()
        payload = jwt.decode(token, public_key, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError as e:
        print(f"JWT decode error: {e}")
        return None


def verify_token(token: str, token_type: str = "access") -> Optional[Dict[str, Any]]:
    """Verify JWT token and check token type
    
    Args:
        token: JWT token string
        token_type: Expected token type ("access" or "refresh")
        
    Returns:
        Optional[Dict]: Decoded token payload or None if invalid
    """
    payload = decode_token(token)
    
    if payload is None:
        return None
    
    # Check token type
    if payload.get("type") != token_type:
        return None
    
    return payload


def get_token_expiry(token: str) -> Optional[datetime]:
    """Get token expiration time
    
    Args:
        token: JWT token string
        
    Returns:
        Optional[datetime]: Token expiration time or None if invalid
    """
    payload = decode_token(token)
    
    if payload is None:
        return None
    
    exp_timestamp = payload.get("exp")
    if exp_timestamp:
        return datetime.fromtimestamp(exp_timestamp)
    
    return None


def is_token_expired(token: str) -> bool:
    """Check if token is expired
    
    Args:
        token: JWT token string
        
    Returns:
        bool: True if token is expired
    """
    expiry = get_token_expiry(token)
    
    if expiry is None:
        return True
    
    return datetime.utcnow() > expiry


def get_token_user_id(token: str) -> Optional[str]:
    """Get user ID from token
    
    Args:
        token: JWT token string
        
    Returns:
        Optional[str]: User ID or None if invalid
    """
    payload = decode_token(token)
    
    if payload is None:
        return None
    
    return payload.get("sub")


def get_token_company_id(token: str) -> Optional[str]:
    """Get company ID from token
    
    Args:
        token: JWT token string
        
    Returns:
        Optional[str]: Company ID or None if invalid
    """
    payload = decode_token(token)
    
    if payload is None:
        return None
    
    return payload.get("company_id")


def get_token_role(token: str) -> Optional[str]:
    """Get user role from token
    
    Args:
        token: JWT token string
        
    Returns:
        Optional[str]: User role or None if invalid
    """
    payload = decode_token(token)
    
    if payload is None:
        return None
    
    return payload.get("role")


def create_token_pair(
    user_id: str,
    company_id: str,
    role: str,
    email: str,
    name: str
) -> Dict[str, Any]:
    """Create access and refresh token pair
    
    Args:
        user_id: User ID
        company_id: Company ID
        role: User role
        email: User email
        name: User name
        
    Returns:
        Dict: Dictionary containing access_token, refresh_token, and token_type
    """
    # Create access token
    access_token = create_access_token({
        "sub": user_id,
        "company_id": company_id,
        "role": role,
        "email": email,
        "name": name
    })
    
    # Create refresh token
    refresh_token = create_refresh_token({
        "sub": user_id,
        "company_id": company_id,
        "role": role,
        "email": email,
        "name": name
    })
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


def refresh_access_token(refresh_token: str) -> Optional[Dict[str, Any]]:
    """Refresh access token using refresh token
    
    Args:
        refresh_token: Refresh token string
        
    Returns:
        Optional[Dict]: New token pair or None if invalid
    """
    # Verify refresh token
    payload = verify_token(refresh_token, "refresh")
    
    if payload is None:
        return None
    
    # Create new token pair
    return create_token_pair(
        user_id=payload["sub"],
        company_id=payload["company_id"],
        role=payload["role"],
        email=payload["email"],
        name=payload["name"]
    )


# Initialize keys on module import
ensure_keys_exist()