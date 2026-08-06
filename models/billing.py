class billing : 
    def __init__(self, bill_id, patient_id, amount, billing_date):
        self.bill_id = bill_id
        self.patient_id = patient_id
        self.amount = amount
        self.billing_date = billing_date

    def __str__(self):
        return f"Bill ID: {self.bill_id}, Patient ID: {self.patient_id}, Amount: {self.amount}, Billing Date: {self.billing_date}"