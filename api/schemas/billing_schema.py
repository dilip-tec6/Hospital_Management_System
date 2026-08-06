"""Pydantic schemas for billing API requests and responses."""

from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class BillingCreate(BaseModel):
    patient_id: int
    amount: Decimal = Field(..., ge=0)
    payment_status: Optional[str] = Field(None, max_length=20)
    payment_date: Optional[date] = None


class BillingUpdate(BaseModel):
    patient_id: int
    amount: Decimal = Field(..., ge=0)
    payment_status: Optional[str] = Field(None, max_length=20)
    payment_date: Optional[date] = None


class BillingResponse(BaseModel):
    bill_id: int
    patient_id: int
    amount: Decimal
    payment_status: Optional[str] = None
    payment_date: Optional[date] = None