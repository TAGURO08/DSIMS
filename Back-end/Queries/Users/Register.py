from datetime import date
import bcrypt
from db import get_connection

def register_user(user):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM [User] WHERE email = ?", (user["email"],))
        if cursor.fetchone()[0] > 0:
            return {"status": "error", "message": "Email already exists"}

        hashed_password = bcrypt.hashpw(user["password"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        today = date.today()

        cursor.execute("""
            INSERT INTO [User] (fname, mname, lname, birthdate, email, office, role, password, dateCreated, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
        """, (
            user["fname"],
            user.get("mname"),
            user["lname"],
            user["birthdate"],
            user["email"],
            user["office"],
            user["role"],
            hashed_password,
            today
        ))

        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success", "message": "User registered successfully"}

    except Exception as e:
        return {"status": "error", "message": str(e)}
