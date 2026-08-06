"""Appointment model."""

from datetime import date, time, datetime
from typing import Optional


class Appointment:
    def __init__(
        self,
        patient_id: int,
        doctor_id: int,
        appointment_date: date,
        appointment_time: time,
        reason: Optional[str] = None,
        status: str = "Scheduled",
        appointment_id: Optional[int] = None,
        created_at: Optional[datetime] = None,
    ):
        self.appointment_id = appointment_id
        self.patient_id = patient_id
        self.doctor_id = doctor_id
        self.appointment_date = appointment_date
        self.appointment_time = appointment_time
        self.reason = reason
        self.status = status
        self.created_at = created_at

    def __repr__(self):
        return (
            f"Appointment(id={self.appointment_id}, "
            f"patient={self.patient_id}, "
            f"doctor={self.doctor_id}, "
            f"date={self.appointment_date}, "
            f"time={self.appointment_time})"
        )

    @classmethod
    def from_row(cls, row):
        return cls(
            appointment_id=row[0],
            patient_id=row[1],
            doctor_id=row[2],
            appointment_date=row[3],
            appointment_time=row[4],
            reason=row[5],
            status=row[6],
            created_at=row[7],
        )