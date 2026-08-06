"""Service layer for billing-related database operations."""

from decimal import Decimal
from typing import List, Optional

import psycopg2

from database.connection import get_connection
from models.billing import Billing


class BillingService:
    """Encapsulates all CRUD operations for the billing table."""

    def create_bill(self, bill: Billing) -> Billing:
        """
        Insert a new billing record.

        Args:
            bill: A Billing instance without bill_id set.

        Returns:
            The same Billing instance populated with bill_id.

        Raises:
            ValueError: If required fields are missing or amount is invalid.
            psycopg2.errors.ForeignKeyViolation: If patient_id does not exist.
            psycopg2.Error: If the insert fails for another reason.
        """
        if bill.patient_id is None:
            raise ValueError("patient_id is required.")
        if bill.amount is None or bill.amount < 0:
            raise ValueError("amount must be a non-negative value.")

        query = """
            INSERT INTO billing
                (patient_id, amount, payment_status, payment_date)
            VALUES (%s, %s, %s, %s)
            RETURNING bill_id;
        """
        values = (
            bill.patient_id,
            bill.amount,
            bill.payment_status,
            bill.payment_date,
        )

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, values)
            bill.bill_id = cursor.fetchone()[0]
            connection.commit()
            return bill
        except psycopg2.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()

    def get_all_bills(self) -> List[Billing]:
        """
        Retrieve all billing records, ordered by bill_id.

        Returns:
            A list of Billing instances.
        """
        query = "SELECT * FROM billing ORDER BY bill_id;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return [Billing.from_row(row) for row in rows]
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def get_bill_by_id(self, bill_id: int) -> Optional[Billing]:
        """
        Retrieve a single billing record by its ID.

        Args:
            bill_id: The bill's primary key.

        Returns:
            A Billing instance, or None if no matching record exists.
        """
        query = "SELECT * FROM billing WHERE bill_id = %s;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (bill_id,))
            row = cursor.fetchone()
            return Billing.from_row(row) if row else None
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def get_bills_by_patient_id(self, patient_id: int) -> List[Billing]:
        """
        Retrieve all billing records for a specific patient.

        Args:
            patient_id: The patient's primary key.

        Returns:
            A list of Billing instances for that patient.
        """
        query = "SELECT * FROM billing WHERE patient_id = %s ORDER BY bill_id;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (patient_id,))
            rows = cursor.fetchall()
            return [Billing.from_row(row) for row in rows]
        except psycopg2.Error:
            raise
        finally:
            cursor.close()
            connection.close()

    def update_bill(self, bill: Billing) -> bool:
        """
        Update an existing billing record's details.

        Args:
            bill: A Billing instance with bill_id set to the record to
                update, and the fields to be saved.

        Returns:
            True if a row was updated, False if no matching bill_id existed.

        Raises:
            ValueError: If bill_id is not set, or amount is invalid.
        """
        if bill.bill_id is None:
            raise ValueError("bill_id is required for an update.")
        if bill.amount is None or bill.amount < 0:
            raise ValueError("amount must be a non-negative value.")

        query = """
            UPDATE billing
            SET patient_id = %s,
                amount = %s,
                payment_status = %s,
                payment_date = %s
            WHERE bill_id = %s;
        """
        values = (
            bill.patient_id,
            bill.amount,
            bill.payment_status,
            bill.payment_date,
            bill.bill_id,
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

    def delete_bill(self, bill_id: int) -> bool:
        """
        Delete a billing record by ID.

        Args:
            bill_id: The bill's primary key.

        Returns:
            True if a row was deleted, False if no matching bill_id existed.
        """
        query = "DELETE FROM billing WHERE bill_id = %s;"

        connection = get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, (bill_id,))
            deleted = cursor.rowcount > 0
            connection.commit()
            return deleted
        except psycopg2.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()
            connection.close()