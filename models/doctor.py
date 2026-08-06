"""Doctor model representing a row in the doctors table."""

from datetime import datetime
from typing import Optional


class Doctor:
    """
    Represents a doctor record.

    Attributes map exactly to the `doctors` table schema:
    doctor_id, first_name, last_name, specialization, phone,
    email, created_at.
    """

    def __init__(
        self,
        first_name: str,
        last_name: str,
        specialization: Optional[str] = None,
        phone: Optional[str] = None,
        email: Optional[str] = None,
        doctor_id: Optional[int] = None,
        created_at: Optional[datetime] = None,
    ) -> None:
        """
        Initialize a Doctor instance.

        Args:
            first_name: Doctor's first name (required).
            last_name: Doctor's last name (required).
            specialization: Medical specialization (e.g. 'Cardiology').
            phone: Contact phone number.
            email: Contact email, must be unique in the database.
            doctor_id: Primary key, set by the database on creation.
            created_at: Record creation timestamp, set by the database.
        """
        self.doctor_id = doctor_id
        self.first_name = first_name
        self.last_name = last_name
        self.specialization = specialization
        self.phone = phone
        self.email = email
        self.created_at = created_at

    def __repr__(self) -> str:
        return (
            f"Doctor(doctor_id={self.doctor_id}, "
            f"name='{self.first_name} {self.last_name}', "
            f"specialization='{self.specialization}')"
        )

    @classmethod
    def from_row(cls, row: tuple) -> "Doctor":
        """
        Build a Doctor instance from a raw database row tuple.

        Expected column order:
        doctor_id, first_name, last_name, specialization,
        phone, email, created_at
        """
        return cls(
            doctor_id=row[0],
            first_name=row[1],
            last_name=row[2],
            specialization=row[3],
            phone=row[4],
            email=row[5],
            created_at=row[6],
        )