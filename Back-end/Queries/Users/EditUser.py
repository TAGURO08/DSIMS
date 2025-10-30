from db import get_connection

def edit_user_query(user_id, updated_data):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE [User]
            SET fname=?, mname=?, lname=?, birthdate=?, 
                email=?, office=?, role=?, status=?
            WHERE id=?
        """, (
            updated_data["fname"],
            updated_data.get("mname"),
            updated_data["lname"],
            updated_data["birthdate"],
            updated_data["email"],
            updated_data["office"],
            updated_data["role"],
            updated_data["status"],
            user_id
        ))


        conn.commit()

        if cursor.rowcount == 0:
            return {"status": "error", "message": "User not found"}

        cursor.close()
        conn.close()

        return {"status": "success", "message": "User updated successfully"}

    except Exception as e:
        return {"status": "error", "message": str(e)}
