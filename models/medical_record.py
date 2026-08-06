"""Medical record model representing a row in the medical_records table."""

from datetime import datetime
from typing import Optional


class MedicalRecord:
    """
    Represents a medical record entry.

    Attributes map exactly to the `medical_records` table schema:
    record_id, patient_id, doctor_id, diagnosis, prescription,
    notes, record_date.
    """

    def __init__(
        self,
        patient_id: int,
        doctor_id: int,
        diagnosis: Optional[str] = None,
        prescription: Optional[str] = None,
        notes: Optional[str] = None,
        record_id: Optional[int] = None,
        record_date: Optional[datetime] = None,
    ) -> None:
        """
        Initialize a MedicalRecord instance.

        Args:
            patient_id: FK reference to patients.patient_id (required).
            doctor_id: FK reference to doctors.doctor_id (required).
            diagnosis: Diagnosis text for this record.
            prescription: Prescribed medication/treatment text.
            notes: Additional clinical notes.
            record_id: Primary key, set by the database on creation.
            record_date: Timestamp of the record, set by the database.
        """
        self.record_id = record_id
        self.patient_id = patient_id
        self.doctor_id = doctor_id
        self.diagnosis = diagnosis
        self.prescription = prescription
        self.notes = notes
        self.record_date = record_date

    def __repr__(self) -> str:
        return (
            f"MedicalRecord(record_id={self.record_id}, "
            f"patient_id={self.patient_id}, doctor_id={self.doctor_id}, "
            f"diagnosis='{self.diagnosis}')"
        )

    @classmethod
    def from_row(cls, row: tuple) -> "MedicalRecord":
        """
        Build a MedicalRecord instance from a raw database row tuple.

        Expected column order:
        record_id, patient_id, doctor_id, diagnosis, prescription,
        notes, record_date
        """
        return cls(
            record_id=row[0],
            patient_id=row[1],
            doctor_id=row[2],
            diagnosis=row[3],
            prescription=row[4],
            notes=row[5],
            record_date=row[6],
        )