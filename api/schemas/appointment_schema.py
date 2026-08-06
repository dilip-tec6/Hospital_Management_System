"""Pydantic schemas for appointment API requests and responses."""

from datetime import datetime

from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: datetime
    status: str = "Scheduled"


class AppointmentUpdate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: datetime
    status: str


class AppointmentResponse(BaseModel):
    appointment_id: int
    patient_id: int
    doctor_id: int
    appointment_date: datetime
    status: str