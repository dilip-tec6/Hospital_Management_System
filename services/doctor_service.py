"""Service layer for doctor-related database operations."""

from typing import List, Optional

import psycopg2

from database.connection import get_connection
from models.doctor import Doctor


class DoctorService:
    """Encapsulates all CRUD operations for the doctors table."""

    def create_doctor(self, doctor: Doctor) -> Doctor:
        """
        Insert a new doctor record.

        Args:
            doctor: A Doctor instance without doctor_id/created_at set.

        Returns:
            The same Doctor instance populated with doctor_id and created_at.

        Raises:
            ValueError: If required fields are missing.
            psycopg2.errors.UniqueViolation: If email already exists.
            psycopg2.Error: If the insert fails for another reason.
        """
        if not doctor.first_name or not doctor.last_name:
            raise ValueError("first_name and last_name are required.")

        query = """
            INSERT INTO doctors
                (first_name, last_name, specialization, phone, email)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING doctor_id, created_at;
        """
        values = (
            doctor.first_name,
            doctor.last_name,
            doctor.specialization,
            doctor.phone,
            doctor.email,
        )

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, values)
            doctor.doctor_id, doctor.created_at = cursor.fetchone()
            connection.commit()
            return doctor
        except psycopg2.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()

    def get_all_doctors(self) -> List[Doctor]:
        """
        Retrieve all doctors, ordered by doctor_id.

        Returns:
            A list of Doctor instances.
        """
        query = "SELECT * FROM doctors ORDER BY doctor_id;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return [Doctor.from_row(row) for row in rows]
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def get_doctor_by_id(self, doctor_id: int) -> Optional[Doctor]:
        """
        Retrieve a single doctor by their ID.

        Args:
            doctor_id: The doctor's primary key.

        Returns:
            A Doctor instance, or None if no matching record exists.
        """
        query = "SELECT * FROM doctors WHERE doctor_id = %s;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (doctor_id,))
            row = cursor.fetchone()
            return Doctor.from_row(row) if row else None
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def update_doctor(self, doctor: Doctor) -> bool:
        """
        Update an existing doctor's details.

        Args:
            doctor: A Doctor instance with doctor_id set to the
                record to update, and the fields to be saved.

        Returns:
            True if a row was updated, False if no matching doctor_id existed.

        Raises:
            ValueError: If doctor_id is not set.
        """
        if doctor.doctor_id is None:
            raise ValueError("doctor_id is required for an update.")

        query = """
            UPDATE doctors
            SET first_name = %s,
                last_name = %s,
                specialization = %s,
                phone = %s,
                email = %s
            WHERE doctor_id = %s;
        """
        values = (
            doctor.first_name,
            doctor.last_name,
            doctor.specialization,
            doctor.phone,
            doctor.email,
            doctor.doctor_id,
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

    def delete_doctor(self, doctor_id: int) -> bool:
        """
        Delete a doctor by ID.

        Note: appointments references doctor_id with ON DELETE CASCADE,
        so related appointments are removed automatically.
        medical_records references doctor_id WITHOUT cascade, so
        deleting a doctor who has existing medical records will raise
        a foreign key violation.

        Args:
            doctor_id: The doctor's primary key.

        Returns:
            True if a row was deleted, False if no matching doctor_id existed.
        """
        query = "DELETE FROM doctors WHERE doctor_id = %s;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (doctor_id,))
            deleted = cursor.rowcount > 0
            connection.commit()
            return deleted
        except psycopg2.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()