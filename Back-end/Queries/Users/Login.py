from db import get_connection
import bcrypt

def login_user(user):
    try:
        conn = get_connection()
        if not conn:
            return {"status": "error", "message": "Database connection failed"}

        cursor = conn.cursor()
        cursor.execute("SELECT id, fname, mname, lname, email, office, role, birthdate, dateCreated, password FROM [User] WHERE email = ?", (user["email"],))
        row = cursor.fetchone()

        if not row:
            return {"status": "error", "message": "Invalid email or password"}
        
        stored_password = row[9]

        if bcrypt.checkpw(user["password"].encode("utf-8"), stored_password.encode("utf-8")):
            return {
                "status": "success",
                "message": "Login successful",
                "user": {
                    "id": row[0],
                    "fname": row[1],
                    "mname": row[2],
                    "lname": row[3],
                    "email": row[4],
                    "office": row[5],
                    "role": row[6],
                    "birthdate": row[7],
                    "dateCreated": row[8],
                }
            }
        else:
            return {"status": "error", "message": "Invalid email or password"}
    
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        if conn:
            cursor.close()
            conn.close()
