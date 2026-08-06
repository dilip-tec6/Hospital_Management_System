"""Pydantic schemas for doctor API requests and responses."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class DoctorCreate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    specialization: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None


class DoctorUpdate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    specialization: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None


class DoctorResponse(BaseModel):
    doctor_id: int
    first_name: str
    last_name: str
    specialization: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    created_at: Optional[datetime] = None