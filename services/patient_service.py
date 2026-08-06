"""Service layer for patient-related database operations."""

from typing import List, Optional

import psycopg2

from database.connection import get_connection
from models.patient import Patient


class PatientService:
    """Encapsulates all CRUD operations for the patients table."""

    def create_patient(self, patient: Patient) -> Patient:
        """
        Insert a new patient record.

        Args:
            patient: A Patient instance without patient_id/created_at set.

        Returns:
            The same Patient instance populated with patient_id and created_at.

        Raises:
            ValueError: If required fields are missing.
            psycopg2.Error: If the insert fails.
        """
        if not patient.first_name or not patient.last_name:
            raise ValueError("first_name and last_name are required.")

        query = """
            INSERT INTO patients
                (first_name, last_name, gender, date_of_birth,
                 phone, address, blood_group)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING patient_id, created_at;
        """
        values = (
            patient.first_name,
            patient.last_name,
            patient.gender,
            patient.date_of_birth,
            patient.phone,
            patient.address,
            patient.blood_group,
        )

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, values)
            patient.patient_id, patient.created_at = cursor.fetchone()
            connection.commit()
            return patient
        except psycopg2.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()

    def get_all_patients(self) -> List[Patient]:
        """
        Retrieve all patients, ordered by patient_id.

        Returns:
            A list of Patient instances.
        """
        query = "SELECT * FROM patients ORDER BY patient_id;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return [Patient.from_row(row) for row in rows]
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def get_patient_by_id(self, patient_id: int) -> Optional[Patient]:
        """
        Retrieve a single patient by their ID.

        Args:
            patient_id: The patient's primary key.

        Returns:
            A Patient instance, or None if no matching record exists.
        """
        query = "SELECT * FROM patients WHERE patient_id = %s;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (patient_id,))
            row = cursor.fetchone()
            return Patient.from_row(row) if row else None
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def update_patient(self, patient: Patient) -> bool:
        """
        Update an existing patient's details.

        Args:
            patient: A Patient instance with patient_id set to the
                record to update, and the fields to be saved.

        Returns:
            True if a row was updated, False if no matching patient_id existed.

        Raises:
            ValueError: If patient_id is not set.
        """
        if patient.patient_id is None:
            raise ValueError("patient_id is required for an update.")

        query = """
            UPDATE patients
            SET first_name = %s,
                last_name = %s,
                gender = %s,
                date_of_birth = %s,
                phone = %s,
                address = %s,
                blood_group = %s
            WHERE patient_id = %s;
        """
        values = (
            patient.first_name,
            patient.last_name,
            patient.gender,
            patient.date_of_birth,
            patient.phone,
            patient.address,
            patient.blood_group,
            patient.patient_id,
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

    def delete_patient(self, patient_id: int) -> bool:
        """
        Delete a patient by ID.

        Note: appointments and medical_records reference patients via
        foreign keys. appointments has ON DELETE CASCADE, so related
        appointments are removed automatically. medical_records and
        billing do NOT cascade, so deleting a patient with existing
        medical records or bills will raise a foreign key violation.

        Args:
            patient_id: The patient's primary key.

        Returns:
            True if a row was deleted, False if no matching patient_id existed.
        """
        query = "DELETE FROM patients WHERE patient_id = %s;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (patient_id,))
            deleted = cursor.rowcount > 0
            connection.commit()
            return deleted
        except psycopg2.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()