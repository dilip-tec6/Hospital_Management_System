"""Patient model representing a row in the patients table."""

from datetime import date, datetime
from typing import Optional


class Patient:
    """
    Represents a patient record.

    Attributes map exactly to the `patients` table schema:
    patient_id, first_name, last_name, gender, date_of_birth,
    phone, address, blood_group, created_at.
    """

    def __init__(
        self,
        first_name: str,
        last_name: str,
        gender: Optional[str] = None,
        date_of_birth: Optional[date] = None,
        phone: Optional[str] = None,
        address: Optional[str] = None,
        blood_group: Optional[str] = None,
        patient_id: Optional[int] = None,
        created_at: Optional[datetime] = None,
    ) -> None:
        """
        Initialize a Patient instance.

        Args:
            first_name: Patient's first name (required).
            last_name: Patient's last name (required).
            gender: Patient's gender.
            date_of_birth: Patient's date of birth.
            phone: Contact phone number.
            address: Residential address.
            blood_group: Blood group (e.g. 'A+', 'O-').
            patient_id: Primary key, set by the database on creation.
            created_at: Record creation timestamp, set by the database.
        """
        self.patient_id = patient_id
        self.first_name = first_name
        self.last_name = last_name
        self.gender = gender
        self.date_of_birth = date_of_birth
        self.phone = phone
        self.address = address
        self.blood_group = blood_group
        self.created_at = created_at

    def __repr__(self) -> str:
        return (
            f"Patient(patient_id={self.patient_id}, "
            f"name='{self.first_name} {self.last_name}')"
        )

    @classmethod
    def from_row(cls, row: tuple) -> "Patient":
        """
        Build a Patient instance from a raw database row tuple.

        Expected column order:
        patient_id, first_name, last_name, gender, date_of_birth,
        phone, address, blood_group, created_at
        """
        return cls(
            patient_id=row[0],
            first_name=row[1],
            last_name=row[2],
            gender=row[3],
            date_of_birth=row[4],
            phone=row[5],
            address=row[6],
            blood_group=row[7],
            created_at=row[8],
        )