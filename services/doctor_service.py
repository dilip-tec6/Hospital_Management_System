from database.connection import get_connection

def add_doctor(doctor):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO doctors (doctor_id, name, specialization, contact_number, email)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (doctor.doctor_id, doctor.name, doctor.specialization, doctor.contact_number, doctor.email))
        conn.commit()
        print("✅ Doctor added successfully!") 
    except Exception as e:
        print(f"❌ Error adding doctor: {e}")
    finally:
        if conn:
            conn.close()