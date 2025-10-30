from db import get_connection

def get_item_list():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT ItemId, ProductName FROM Item WHERE Status = 'Active'")
        rows = cursor.fetchall()

        if not rows:
            return {"status": "success", "data": []}

        data = [{"value": row[0], "label": row[1]} for row in rows]
        return {"status": "success", "data": data}

    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        conn.close()
