from database.connection import get_connection

def main():
    try:
        conn = get_connection()
        print("✅ Connected to PostgreSQL successfully!")

        cursor = conn.cursor()
        cursor.execute("SELECT version();")

        version = cursor.fetchone()
        print(version[0])

        cursor.close()
        conn.close()

    except Exception as e:
        print("❌ Connection failed!")
        print(e)

if __name__ == "__main__":
    main()

# import os
# from dotenv import load_dotenv

# load_dotenv()

# print("DB_USER =", os.getenv("DB_USER"))
# print("DB_NAME =", os.getenv("DB_NAME"))