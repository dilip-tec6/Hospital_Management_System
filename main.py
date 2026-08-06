from models.patient import Patient
from services.patient_service import PatientService

patient_service = PatientService()

# Example: create a patient
new_patient = Patient(
    first_name="John",
    last_name="Doe",
    gender="Male",
    phone="9800000000",
    blood_group="O+",
)
created = patient_service.create_patient(new_patient)
print(f"Created: {created}")

# Example: list all patients
for p in patient_service.get_all_patients():
    print(p)

# Example: fetch one
found = patient_service.get_patient_by_id(created.patient_id)
print(f"Fetched: {found}")

# Example: update
found.phone = "9811111111"
patient_service.update_patient(found)

# Example: delete
patient_service.delete_patient(found.patient_id)