"""Pydantic schemas for appointment API requests and responses."""

from datetime import date, time, datetime
from typing import Optional

from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time
    reason: Optional[str] = None
    status: str = "Scheduled"


class AppointmentUpdate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time
    reason: Optional[str] = None
    status: str


class AppointmentResponse(BaseModel):
    appointment_id: int
    patient_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time
    reason: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True