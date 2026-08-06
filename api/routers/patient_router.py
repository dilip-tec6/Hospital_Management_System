"""FastAPI router for patient endpoints."""

from typing import List

from fastapi import APIRouter, HTTPException, status

from api.schemas.patient_schema import PatientCreate, PatientResponse, PatientUpdate
from models.patient import Patient
from services.patient_service import PatientService

router = APIRouter(
    prefix="/patients",
    tags=["Patients"],
)

patient_service = PatientService()


@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(payload: PatientCreate) -> Patient:
    """Create a new patient."""
    patient = Patient(**payload.model_dump())
    try:
        return patient_service.create_patient(patient)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.get("/", response_model=List[PatientResponse])
def get_all_patients() -> List[Patient]:
    """Retrieve all patients."""
    return patient_service.get_all_patients()


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int) -> Patient:
    """Retrieve a single patient by ID."""
    patient = patient_service.get_patient_by_id(patient_id)
    if patient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found.")
    return patient


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: int, payload: PatientUpdate) -> Patient:
    """Update an existing patient."""
    patient = Patient(patient_id=patient_id, **payload.model_dump())
    updated = patient_service.update_patient(patient)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found.")
    return patient_service.get_patient_by_id(patient_id)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int) -> None:
    """Delete a patient by ID."""
    deleted = patient_service.delete_patient(patient_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found.")