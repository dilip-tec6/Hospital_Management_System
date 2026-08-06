"""Service layer for medical-record-related database operations."""

from typing import List, Optional

import psycopg2

from database.connection import get_connection
from models.medical_record import MedicalRecord


class MedicalRecordService:
    """Encapsulates all CRUD operations for the medical_records table."""

    def create_medical_record(self, record: MedicalRecord) -> MedicalRecord:
        """
        Insert a new medical record.

        Args:
            record: A MedicalRecord instance without record_id/record_date set.

        Returns:
            The same MedicalRecord instance populated with record_id
            and record_date.

        Raises:
            ValueError: If required fields are missing.
            psycopg2.errors.ForeignKeyViolation: If patient_id or doctor_id
                does not exist.
            psycopg2.Error: If the insert fails for another reason.
        """
        if record.patient_id is None or record.doctor_id is None:
            raise ValueError("patient_id and doctor_id are required.")

        query = """
            INSERT INTO medical_records
                (patient_id, doctor_id, diagnosis, prescription, notes)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING record_id, record_date;
        """
        values = (
            record.patient_id,
            record.doctor_id,
            record.diagnosis,
            record.prescription,
            record.notes,
        )

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, values)
            record.record_id, record.record_date = cursor.fetchone()
            connection.commit()
            return record
        except psycopg2.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()

    def get_all_medical_records(self) -> List[MedicalRecord]:
        """
        Retrieve all medical records, ordered by record_date (most recent first).

        Returns:
            A list of MedicalRecord instances.
        """
        query = "SELECT * FROM medical_records ORDER BY record_date DESC;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return [MedicalRecord.from_row(row) for row in rows]
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def get_medical_record_by_id(self, record_id: int) -> Optional[MedicalRecord]:
        """
        Retrieve a single medical record by its ID.

        Args:
            record_id: The medical record's primary key.

        Returns:
            A MedicalRecord instance, or None if no matching record exists.
        """
        query = "SELECT * FROM medical_records WHERE record_id = %s;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (record_id,))
            row = cursor.fetchone()
            return MedicalRecord.from_row(row) if row else None
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def get_records_by_patient_id(self, patient_id: int) -> List[MedicalRecord]:
        """
        Retrieve all medical records belonging to a specific patient.

        Args:
            patient_id: The patient's primary key.

        Returns:
            A list of MedicalRecord instances, most recent first.
        """
        query = """
            SELECT * FROM medical_records
            WHERE patient_id = %s
            ORDER BY record_date DESC;
        """

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (patient_id,))
            rows = cursor.fetchall()
            return [MedicalRecord.from_row(row) for row in rows]
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def update_medical_record(self, record: MedicalRecord) -> bool:
        """
        Update an existing medical record's details.

        Args:
            record: A MedicalRecord instance with record_id set to the
                record to update, and the fields to be saved.

        Returns:
            True if a row was updated, False if no matching record_id existed.

        Raises:
            ValueError: If record_id is not set.
        """
        if record.record_id is None:
            raise ValueError("record_id is required for an update.")

        query = """
            UPDATE medical_records
            SET patient_id = %s,
                doctor_id = %s,
                diagnosis = %s,
                prescription = %s,
                notes = %s
            WHERE record_id = %s;
        """
        values = (
            record.patient_id,
            record.doctor_id,
            record.diagnosis,
            record.prescription,
            record.notes,
            record.record_id,
        )

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, values)
            updated = cursor.rowcount > 0
            connection.commit()
            return updated
        except psycopg2.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()

    def delete_medical_record(self, record_id: int) -> bool:
        """
        Delete a medical record by ID.

        Args:
            record_id: The medical record's primary key.

        Returns:
            True if a row was deleted, False if no matching record_id existed.
        """
        query = "DELETE FROM medical_records WHERE record_id = %s;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (record_id,))
            deleted = cursor.rowcount > 0
            connection.commit()
            return deleted
        except psycopg2.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()