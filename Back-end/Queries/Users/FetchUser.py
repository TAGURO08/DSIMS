from db import get_connection

def fetch_users():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, lname, fname, mname, birthdate, email, office, role, status, dateCreated
            FROM [User]
        """)
        rows = cursor.fetchall()

        users = []
        for row in rows:
            users.append({
                "id": row[0],
                "lname": row[1],
                "fname": row[2],
                "mname": row[3],
                "birthdate": str(row[4]),
                "email": row[5],
                "office": row[6],
                "role": row[7],
                "status": row[8],
                "dateCreated": row[9]
            })

        cursor.close()
        conn.close()
        return {"status": "success", "data": users}
    except Exception as e:
        return {"status": "error", "message": str(e)}
