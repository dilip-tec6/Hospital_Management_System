from database.connection import get_connection

def medical_record_exists(record_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        select_query = "SELECT * FROM medical_records WHERE record_id = %s"
        cursor.execute(select_query, (record_id,))
        record = cursor.fetchone()

        return record is not None
    except Exception as e:
        print(f"❌ Error checking medical record existence: {e}")
        return False
    finally:
        if conn:
            conn.close()