from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class PatientBase(BaseModel):
    """Common patient fields."""

    first_name: str
    last_name: str
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    blood_group: Optional[str] = None


class PatientCreate(PatientBase):
    """Request body for creating a patient."""

    pass


class PatientUpdate(PatientBase):
    """Request body for updating a patient."""

    pass


class PatientResponse(PatientBase):
    """Response returned to the client."""

    patient_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)