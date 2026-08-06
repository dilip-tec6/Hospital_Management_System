"""Doctor model."""

from datetime import datetime
from typing import Optional


class Doctor:
    def __init__(
        self,
        first_name: str,
        last_name: str,
        specialization: Optional[str] = None,
        department: Optional[str] = None,
        phone: Optional[str] = None,
        email: Optional[str] = None,
        doctor_id: Optional[int] = None,
        created_at: Optional[datetime] = None,
    ):
        self.doctor_id = doctor_id
        self.first_name = first_name
        self.last_name = last_name
        self.specialization = specialization
        self.department = department
        self.phone = phone
        self.email = email
        self.created_at = created_at

    def __repr__(self):
        return (
            f"Doctor(id={self.doctor_id}, "
            f"name='{self.first_name} {self.last_name}', "
            f"specialization='{self.specialization}')"
        )

    @classmethod
    def from_row(cls, row):
        return cls(
            doctor_id=row[0],
            first_name=row[1],
            last_name=row[2],
            specialization=row[3],
            department=row[4],
            phone=row[5],
            email=row[6],
            created_at=row[7],
        )