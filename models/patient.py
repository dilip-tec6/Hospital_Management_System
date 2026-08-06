class Patient:
    def __init__(self, patient_id, name, age, gender, address, contact_number, medical_history, blood_group):
        self.patient_id = patient_id
        self.name = name
        self.age = age
        self.gender = gender
        self.address = address
        self.contact_number = contact_number
        self.medical_history = medical_history
        self.blood_group = blood_group

class Doctor:
    def __init__(self, doctor_id, name, specialization, contact_number, email):
        self.doctor_id = doctor_id
        self.name = name
        self.specialization = specialization
        self.contact_number = contact_number
        self.email = email

