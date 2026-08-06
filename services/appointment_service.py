"""Service layer for appointment-related database operations."""

from typing import List, Optional

import psycopg2

from database.connection import get_connection
from models.appointment import Appointment


class AppointmentService:
    """Encapsulates all CRUD operations for the appointments table."""

    def create_appointment(self, appointment: Appointment) -> Appointment:
        """
        Insert a new appointment record.

        Args:
            appointment: An Appointment instance without appointment_id set.

        Returns:
            The same Appointment instance populated with appointment_id.

        Raises:
            ValueError: If required fields are missing.
            psycopg2.errors.ForeignKeyViolation: If patient_id or doctor_id
                does not exist.
            psycopg2.Error: If the insert fails for another reason.
        """
        if appointment.patient_id is None or appointment.doctor_id is None:
            raise ValueError("patient_id and doctor_id are required.")
        if not appointment.appointment_date:
            raise ValueError("appointment_date is required.")

        query = """
            INSERT INTO appointments
                (patient_id, doctor_id, appointment_date, status)
            VALUES (%s, %s, %s, %s)
            RETURNING appointment_id;
        """
        values = (
            appointment.patient_id,
            appointment.doctor_id,
            appointment.appointment_date,
            appointment.status,
        )

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, values)
            appointment.appointment_id = cursor.fetchone()[0]
            connection.commit()
            return appointment
        except psycopg2.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()

    def get_all_appointments(self) -> List[Appointment]:
        """
        Retrieve all appointments, ordered by appointment_date.

        Returns:
            A list of Appointment instances.
        """
        query = "SELECT * FROM appointments ORDER BY appointment_date;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return [Appointment.from_row(row) for row in rows]
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def get_appointment_by_id(self, appointment_id: int) -> Optional[Appointment]:
        """
        Retrieve a single appointment by its ID.

        Args:
            appointment_id: The appointment's primary key.

        Returns:
            An Appointment instance, or None if no matching record exists.
        """
        query = "SELECT * FROM appointments WHERE appointment_id = %s;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (appointment_id,))
            row = cursor.fetchone()
            return Appointment.from_row(row) if row else None
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def update_appointment(self, appointment: Appointment) -> bool:
        """
        Update an existing appointment's details.

        Args:
            appointment: An Appointment instance with appointment_id set
                to the record to update, and the fields to be saved.

        Returns:
            True if a row was updated, False if no matching
            appointment_id existed.

        Raises:
            ValueError: If appointment_id is not set.
        """
        if appointment.appointment_id is None:
            raise ValueError("appointment_id is required for an update.")

        query = """
            UPDATE appointments
            SET patient_id = %s,
                doctor_id = %s,
                appointment_date = %s,
                status = %s
            WHERE appointment_id = %s;
        """
        values = (
            appointment.patient_id,
            appointment.doctor_id,
            appointment.appointment_date,
            appointment.status,
            appointment.appointment_id,
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

    def delete_appointment(self, appointment_id: int) -> bool:
        """
        Delete an appointment by ID.

        Args:
            appointment_id: The appointment's primary key.

        Returns:
            True if a row was deleted, False if no matching
            appointment_id existed.
        """
        query = "DELETE FROM appointments WHERE appointment_id = %s;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (appointment_id,))
            deleted = cursor.rowcount > 0
            connection.commit()
            return deleted
        except psycopg2.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()