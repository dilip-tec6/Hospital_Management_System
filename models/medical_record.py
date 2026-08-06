class medical_record:
    def __init__(self, record_id, patient_id, doctor_id, diagnosis, treatment, date):
        self.record_id = record_id
        self.patient_id = patient_id
        self.doctor_id = doctor_id
        self.diagnosis = diagnosis
        self.treatment = treatment
        self.date = date

    def __str__(self):
        return f"Record ID: {self.record_id}, Patient ID: {self.patient_id}, Doctor ID: {self.doctor_id}, Diagnosis: {self.diagnosis}, Treatment: {self.treatment}, Date: {self.date}"