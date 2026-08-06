from database.connection import get_connection

def add_patient(patient):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO patients (patient_id, name, age, gender, address, contact_number, medical_history, blood_group)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (patient.patient_id, patient.name, patient.age, patient.gender, patient.address, patient.contact_number, patient.medical_history, patient.blood_group))
        conn.commit()
        print("✅ Patient added successfully!") 
    except Exception as e:
        print(f"❌ Error adding patient: {e}")
    finally:
        if conn:
            conn.close()