"""Appointment model representing a row in the appointments table."""

from datetime import datetime
from typing import Optional


class Appointment:
    """
    Represents an appointment record.

    Attributes map exactly to the `appointments` table schema:
    appointment_id, patient_id, doctor_id, appointment_date, status.
    """

    def __init__(
        self,
        patient_id: int,
        doctor_id: int,
        appointment_date: datetime,
        status: str = "Scheduled",
        appointment_id: Optional[int] = None,
    ) -> None:
        """
        Initialize an Appointment instance.

        Args:
            patient_id: FK reference to patients.patient_id (required).
            doctor_id: FK reference to doctors.doctor_id (required).
            appointment_date: Date and time of the appointment (required).
            status: Current status of the appointment. Defaults to
                'Scheduled', matching the database column default.
            appointment_id: Primary key, set by the database on creation.
        """
        self.appointment_id = appointment_id
        self.patient_id = patient_id
        self.doctor_id = doctor_id
        self.appointment_date = appointment_date
        self.status = status

    def __repr__(self) -> str:
        return (
            f"Appointment(appointment_id={self.appointment_id}, "
            f"patient_id={self.patient_id}, doctor_id={self.doctor_id}, "
            f"date={self.appointment_date}, status='{self.status}')"
        )

    @classmethod
    def from_row(cls, row: tuple) -> "Appointment":
        """
        Build an Appointment instance from a raw database row tuple.

        Expected column order:
        appointment_id, patient_id, doctor_id, appointment_date, status
        """
        return cls(
            appointment_id=row[0],
            patient_id=row[1],
            doctor_id=row[2],
            appointment_date=row[3],
            status=row[4]
        )