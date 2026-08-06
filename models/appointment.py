class Appointment:
    def __init__(self, appointment_id, patient_id, doctor_id, appointment_date, appointment_time):
        self.appointment_id = appointment_id
        self.patient_id = patient_id
        self.doctor_id = doctor_id
        self.appointment_date = appointment_date
        self.appointment_time = appointment_time

    def __str__(self):
        return f"Appointment ID: {self.appointment_id}, Patient ID: {self.patient_id}, Doctor ID: {self.doctor_id}, Date: {self.appointment_date}, Time: {self.appointment_time}"