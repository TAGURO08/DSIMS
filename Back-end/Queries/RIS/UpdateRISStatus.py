from db import get_connection

def update_ris_status(ris_id: int, new_status: str):
    """
    Updates the Status column of RIS table for a given RIS_id
    """
    conn = get_connection()
    try:
        cursor = conn.cursor()
        query = """
            UPDATE RIS
            SET Status = ?
            WHERE RIS_id = ?
        """
        cursor.execute(query, (new_status, ris_id))
        conn.commit()
        return {"status": "success", "message": f"RIS {ris_id} status updated to {new_status}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        conn.close()
