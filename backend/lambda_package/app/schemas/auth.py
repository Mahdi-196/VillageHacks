# app/schemas/auth.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: str | None = Field(default=None, max_length=100)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class PublicUser(BaseModel):
    id: int
    email: EmailStr
    display_name: str | None
    created_at: datetime

class AuthResponse(BaseModel):
    user: PublicUser
    access_token: str
    token_type: str = "Bearer"
    expires_in_minutes: int
