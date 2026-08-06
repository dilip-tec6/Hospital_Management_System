"""Billing model representing a row in the billing table."""

from datetime import date
from decimal import Decimal
from typing import Optional


class Billing:
    """
    Represents a billing record.

    Attributes map exactly to the `billing` table schema:
    bill_id, patient_id, amount, payment_status, payment_date.
    """

    def __init__(
        self,
        patient_id: int,
        amount: Decimal,
        payment_status: Optional[str] = None,
        payment_date: Optional[date] = None,
        bill_id: Optional[int] = None,
    ) -> None:
        """
        Initialize a Billing instance.

        Args:
            patient_id: FK reference to patients.patient_id (required).
            amount: Bill amount (required).
            payment_status: Status of payment (e.g. 'Paid', 'Pending', 'Unpaid').
            payment_date: Date the payment was made, if any.
            bill_id: Primary key, set by the database on creation.
        """
        self.bill_id = bill_id
        self.patient_id = patient_id
        self.amount = amount
        self.payment_status = payment_status
        self.payment_date = payment_date

    def __repr__(self) -> str:
        return (
            f"Billing(bill_id={self.bill_id}, "
            f"patient_id={self.patient_id}, amount={self.amount}, "
            f"status='{self.payment_status}')"
        )