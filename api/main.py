"""Main entry point for the Hospital Management System API."""

from fastapi import FastAPI
from api.routers.patient_router import router as patient_router

app = FastAPI(
    title="Hospital Management System API",
    description="REST API for managing patients, doctors, appointments, medical records, and billing.",
    version="1.0.0",
)

# Register routers
app.include_router(patient_router)


@app.get("/")
def root():
    """Health check endpoint."""
    return {
        "message": "Hospital Management System API is running."
    }