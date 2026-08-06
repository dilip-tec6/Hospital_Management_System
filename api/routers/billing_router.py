"""FastAPI router for billing endpoints."""

from typing import List

from fastapi import APIRouter, HTTPException, status

from api.schemas.billing_schema import BillingCreate, BillingResponse, BillingUpdate
from models.billing import Billing
from services.billing_service import BillingService

router = APIRouter(
    prefix="/billing",
    tags=["Billing"],
)

billing_service = BillingService()


@router.post("/", response_model=BillingResponse, status_code=status.HTTP_201_CREATED)
def create_bill(payload: BillingCreate) -> Billing:
    """Create a new billing record."""
    bill = Billing(**payload.model_dump())
    try:
        return billing_service.create_bill(bill)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        if "foreign key" in str(exc).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid patient_id.",
            )
        raise


@router.get("/", response_model=List[BillingResponse])
def get_all_bills() -> List[Billing]:
    """Retrieve all billing records."""
    return billing_service.get_all_bills()


@router.get("/{bill_id}", response_model=BillingResponse)
def get_bill(bill_id: int) -> Billing:
    """Retrieve a single billing record by ID."""
    bill = billing_service.get_bill_by_id(bill_id)
    if bill is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found.")
    return bill


@router.get("/patient/{patient_id}", response_model=List[BillingResponse])
def get_bills_by_patient(patient_id: int) -> List[Billing]:
    """Retrieve all billing records for a specific patient."""
    return billing_service.get_bills_by_patient_id(patient_id)


@router.put("/{bill_id}", response_model=BillingResponse)
def update_bill(bill_id: int, payload: BillingUpdate) -> Billing:
    """Update an existing billing record."""
    bill = Billing(bill_id=bill_id, **payload.model_dump())
    updated = billing_service.update_bill(bill)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found.")
    return billing_service.get_bill_by_id(bill_id)


@router.delete("/{bill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bill(bill_id: int) -> None:
    """Delete a billing record by ID."""
    deleted = billing_service.delete_bill(bill_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found.")