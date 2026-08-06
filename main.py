from models.patient import Patient
from services.patient_service import PatientService
from models.doctor import Doctor
from services.doctor_service import DoctorService
from datetime import datetime, timedelta

from models.appointment import Appointment
from services.appointment_service import AppointmentService

from models.medical_record import MedicalRecord
from services.medical_record_service import MedicalRecordService

from decimal import Decimal
from datetime import date

from models.billing import Billing
from services.billing_service import BillingService

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

def demo_medical_record_management() -> None:
    """Demonstrate MedicalRecordService CRUD operations."""
    record_service = MedicalRecordService()

    # Note: patient_id and doctor_id must reference existing rows.
    new_record = MedicalRecord(
        patient_id=1,
        doctor_id=1,
        diagnosis="Seasonal flu",
        prescription="Paracetamol 500mg, twice daily for 5 days",
        notes="Advised rest and hydration.",
    )
    created_record = record_service.create_medical_record(new_record)
    print(f"Created: {created_record}")

    for r in record_service.get_all_medical_records():
        print(r)

    found_record = record_service.get_medical_record_by_id(created_record.record_id)
    print(f"Fetched: {found_record}")

    patient_history = record_service.get_records_by_patient_id(1)
    print(f"Patient history: {patient_history}")

    found_record.notes = "Follow-up in 1 week if symptoms persist."
    record_service.update_medical_record(found_record)

    record_service.delete_medical_record(found_record.record_id)


if __name__ == "__main__":
    demo_patient_management()
    demo_doctor_management()
    demo_appointment_management()
    demo_medical_record_management()

def demo_billing_management() -> None:
    """Demonstrate BillingService CRUD operations."""
    billing_service = BillingService()

    # Note: patient_id must reference an existing patient row.
    new_bill = Billing(
        patient_id=1,
        amount=Decimal("1500.00"),
        payment_status="Pending",
    )
    created_bill = billing_service.create_bill(new_bill)
    print(f"Created: {created_bill}")

    for b in billing_service.get_all_bills():
        print(b)

    found_bill = billing_service.get_bill_by_id(created_bill.bill_id)
    print(f"Fetched: {found_bill}")

    patient_bills = billing_service.get_bills_by_patient_id(1)
    print(f"Patient bills: {patient_bills}")

    found_bill.payment_status = "Paid"
    found_bill.payment_date = date.today()
    billing_service.update_bill(found_bill)

    billing_service.delete_bill(found_bill.bill_id)


if __name__ == "__main__":
    demo_patient_management()
    demo_doctor_management()
    demo_appointment_management()
    demo_medical_record_management()
    demo_billing_management()