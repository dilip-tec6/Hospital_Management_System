"""FastAPI router for medical record endpoints."""

from typing import List

from fastapi import APIRouter, HTTPException, status

from api.schemas.medical_record_schema import (
    MedicalRecordCreate,
    MedicalRecordResponse,
    MedicalRecordUpdate,
)
from models.medical_record import MedicalRecord
from services.medical_record_service import MedicalRecordService

router = APIRouter(
    prefix="/medical-records",
    tags=["Medical Records"],
)

record_service = MedicalRecordService()


@router.post("/", response_model=MedicalRecordResponse, status_code=status.HTTP_201_CREATED)
def create_medical_record(payload: MedicalRecordCreate) -> MedicalRecord:
    """Create a new medical record."""
    record = MedicalRecord(**payload.model_dump())
    try:
        return record_service.create_medical_record(record)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        if "foreign key" in str(exc).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid patient_id or doctor_id.",
            )
        raise


@router.get("/", response_model=List[MedicalRecordResponse])
def get_all_medical_records() -> List[MedicalRecord]:
    """Retrieve all medical records."""
    return record_service.get_all_medical_records()


@router.get("/{record_id}", response_model=MedicalRecordResponse)
def get_medical_record(record_id: int) -> MedicalRecord:
    """Retrieve a single medical record by ID."""
    record = record_service.get_medical_record_by_id(record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical record not found.")
    return record


@router.get("/patient/{patient_id}", response_model=List[MedicalRecordResponse])
def get_records_by_patient(patient_id: int) -> List[MedicalRecord]:
    """Retrieve all medical records for a specific patient."""
    return record_service.get_records_by_patient_id(patient_id)


@router.put("/{record_id}", response_model=MedicalRecordResponse)
def update_medical_record(record_id: int, payload: MedicalRecordUpdate) -> MedicalRecord:
    """Update an existing medical record."""
    record = MedicalRecord(record_id=record_id, **payload.model_dump())
    updated = record_service.update_medical_record(record)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical record not found.")
    return record_service.get_medical_record_by_id(record_id)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medical_record(record_id: int) -> None:
    """Delete a medical record by ID."""
    deleted = record_service.delete_medical_record(record_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical record not found.")