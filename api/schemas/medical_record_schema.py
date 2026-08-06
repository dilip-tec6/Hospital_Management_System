"""Pydantic schemas for medical record API requests and responses."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class MedicalRecordCreate(BaseModel):
    patient_id: int
    doctor_id: int
    diagnosis: Optional[str] = None
    prescription: Optional[str] = None
    notes: Optional[str] = None


class MedicalRecordUpdate(BaseModel):
    patient_id: int
    doctor_id: int
    diagnosis: Optional[str] = None
    prescription: Optional[str] = None
    notes: Optional[str] = None


class MedicalRecordResponse(BaseModel):
    record_id: int
    patient_id: int
    doctor_id: int
    diagnosis: Optional[str] = None
    prescription: Optional[str] = None
    notes: Optional[str] = None
    record_date: Optional[datetime] = None