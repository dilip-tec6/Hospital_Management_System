"""FastAPI router for appointment endpoints."""

from typing import List

from fastapi import APIRouter, HTTPException, status

from api.schemas.appointment_schema import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
)
from models.appointment import Appointment
from services.appointment_service import AppointmentService

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"],
)

appointment_service = AppointmentService()


@router.post("/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(payload: AppointmentCreate) -> Appointment:
    """Create a new appointment."""
    appointment = Appointment(**payload.model_dump())
    try:
        return appointment_service.create_appointment(appointment)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        if "foreign key" in str(exc).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid patient_id or doctor_id.",
            )
        raise


@router.get("/", response_model=List[AppointmentResponse])
def get_all_appointments() -> List[Appointment]:
    """Retrieve all appointments."""
    return appointment_service.get_all_appointments()


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(appointment_id: int) -> Appointment:
    """Retrieve a single appointment by ID."""
    appointment = appointment_service.get_appointment_by_id(appointment_id)
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found.")
    return appointment


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(appointment_id: int, payload: AppointmentUpdate) -> Appointment:
    """Update an existing appointment."""
    appointment = Appointment(appointment_id=appointment_id, **payload.model_dump())
    updated = appointment_service.update_appointment(appointment)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found.")
    return appointment_service.get_appointment_by_id(appointment_id)


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(appointment_id: int) -> None:
    """Delete an appointment by ID."""
    deleted = appointment_service.delete_appointment(appointment_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found.")