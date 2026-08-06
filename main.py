from models.patient import Patient
from services.patient_service import PatientService
from models.doctor import Doctor
from services.doctor_service import DoctorService
from datetime import datetime, timedelta

from models.appointment import Appointment
from services.appointment_service import AppointmentService

def demo_patient_management() -> None:
    """Demonstrate PatientService CRUD operations."""
    patient_service = PatientService()

    new_patient = Patient(
        first_name="John",
        last_name="Doe",
        gender="Male",
        phone="9800000000",
        blood_group="O+",
    )
    created_patient = patient_service.create_patient(new_patient)
    print(f"Created: {created_patient}")

    for p in patient_service.get_all_patients():
        print(p)

    found_patient = patient_service.get_patient_by_id(created_patient.patient_id)
    print(f"Fetched: {found_patient}")

    found_patient.phone = "9811111111"
    patient_service.update_patient(found_patient)

    patient_service.delete_patient(found_patient.patient_id)


def demo_doctor_management() -> None:
    """Demonstrate DoctorService CRUD operations."""
    doctor_service = DoctorService()

    new_doctor = Doctor(
        first_name="Sarah",
        last_name="Sharma",
        specialization="Cardiology",
        phone="9812345678",
        email="sarah.sharma@hospital.com",
    )
    created_doctor = doctor_service.create_doctor(new_doctor)
    print(f"Created: {created_doctor}")

    for d in doctor_service.get_all_doctors():
        print(d)

    found_doctor = doctor_service.get_doctor_by_id(created_doctor.doctor_id)
    print(f"Fetched: {found_doctor}")

    found_doctor.specialization = "Interventional Cardiology"
    doctor_service.update_doctor(found_doctor)

    doctor_service.delete_doctor(found_doctor.doctor_id)


if __name__ == "__main__":
    demo_patient_management()
    demo_doctor_management()

def demo_appointment_management() -> None:
    """Demonstrate AppointmentService CRUD operations."""
    appointment_service = AppointmentService()

    # Note: patient_id and doctor_id must reference existing rows,
    # e.g. IDs created in demo_patient_management() / demo_doctor_management().
    new_appointment = Appointment(
        patient_id=1,
        doctor_id=1,
        appointment_date=datetime.now() + timedelta(days=1),
    )
    created_appointment = appointment_service.create_appointment(new_appointment)
    print(f"Created: {created_appointment}")

    for a in appointment_service.get_all_appointments():
        print(a)

    found_appointment = appointment_service.get_appointment_by_id(
        created_appointment.appointment_id
    )
    print(f"Fetched: {found_appointment}")

    found_appointment.status = "Completed"
    appointment_service.update_appointment(found_appointment)

    appointment_service.delete_appointment(found_appointment.appointment_id)


if __name__ == "__main__":
    demo_patient_management()
    demo_doctor_management()
    demo_appointment_management()
    