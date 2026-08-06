"""Main entry point for the Hospital Management System API."""

from fastapi import FastAPI

from api.routers.patient_router import router as patient_router
from api.routers.doctor_router import router as doctor_router
from api.routers.appointment_router import router as appointment_router
from api.routers.medical_record_router import router as medical_record_router
from api.routers.billing_router import router as billing_router

app = FastAPI(
    title="Hospital Management System API",
    description="REST API for managing patients, doctors, appointments, medical records, and billing.",
    version="1.0.0",
)

# Register routers
app.include_router(patient_router)
app.include_router(doctor_router)
app.include_router(appointment_router)
app.include_router(medical_record_router)
app.include_router(billing_router)


@app.get("/")
def root():
    """Health check endpoint."""
    return {
        "message": "Hospital Management System API is running."
    }