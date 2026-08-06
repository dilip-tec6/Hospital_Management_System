"""FastAPI router for doctor endpoints."""

from typing import List

from fastapi import APIRouter, HTTPException, status

from api.schemas.doctor_schema import DoctorCreate, DoctorResponse, DoctorUpdate
from models.doctor import Doctor
from services.doctor_service import DoctorService

router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"],
)

doctor_service = DoctorService()


@router.post("/", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
def create_doctor(payload: DoctorCreate) -> Doctor:
    """Create a new doctor."""
    doctor = Doctor(**payload.model_dump())
    try:
        return doctor_service.create_doctor(doctor)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        if "unique" in str(exc).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A doctor with this email already exists.",
            )
        raise


@router.get("/", response_model=List[DoctorResponse])
def get_all_doctors() -> List[Doctor]:
    """Retrieve all doctors."""
    return doctor_service.get_all_doctors()


@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor(doctor_id: int) -> Doctor:
    """Retrieve a single doctor by ID."""
    doctor = doctor_service.get_doctor_by_id(doctor_id)
    if doctor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found.")
    return doctor


@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(doctor_id: int, payload: DoctorUpdate) -> Doctor:
    """Update an existing doctor."""
    doctor = Doctor(doctor_id=doctor_id, **payload.model_dump())
    updated = doctor_service.update_doctor(doctor)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found.")
    return doctor_service.get_doctor_by_id(doctor_id)


@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doctor(doctor_id: int) -> None:
    """Delete a doctor by ID."""
    deleted = doctor_service.delete_doctor(doctor_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found.")