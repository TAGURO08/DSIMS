from db import get_connection

def edit_office_query(office_id: int, data: dict):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Office
            SET officeName=?, officeLocation=?, status=?
            WHERE officeId=?
        """, (data["officeName"], data["location"], data["status"], office_id))
        conn.commit()
        affected = cursor.rowcount
        cursor.close()
        conn.close()
        if affected == 0:
            return {"status": "error", "message": "Office not found"}
        return {"status": "success", "message": "Office updated successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
