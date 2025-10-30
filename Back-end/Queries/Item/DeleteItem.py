import pyodbc
from db import get_connection

def update_item_status(item_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = """
            UPDATE Item
            SET Status = 'Inactive'
            WHERE ItemId = ?
        """
        cursor.execute(query, (item_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success", "message": "Successfully deleted."}
    except Exception as e:
        return {"status": "error", "message": str(e)}
