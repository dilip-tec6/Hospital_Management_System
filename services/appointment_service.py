from database.connection import get_connection

def add_appointment(appointment):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO appointments (appointment_id, patient_id, doctor_id, appointment_date, appointment_time)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (appointment.appointment_id, appointment.patient_id, appointment.doctor_id, appointment.appointment_date, appointment.appointment_time))
        conn.commit()
        print("✅ Appointment added successfully!")
    except Exception as e:
        print(f"❌ Error adding appointment: {e}")
    finally:
        if conn:
            conn.close()    
