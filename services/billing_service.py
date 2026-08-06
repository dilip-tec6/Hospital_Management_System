from database.connection import get_connection

def billing_exists(bill_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        select_query = "SELECT * FROM billing WHERE bill_id = %s"
        cursor.execute(select_query, (bill_id,))
        bill = cursor.fetchone()

        return bill is not None
    except Exception as e:
        print(f"❌ Error checking billing existence: {e}")
        return False
    finally:
        if conn:
            conn.close() 