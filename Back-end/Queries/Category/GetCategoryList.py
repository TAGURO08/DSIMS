import pyodbc
from db import get_connection

def get_category_list():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = "SELECT CategoryId, CategoryName FROM Category WHERE Status = 'Active'"
        cursor.execute(query)

        categories = []
        for row in cursor.fetchall():
            categories.append({
                "value": row.CategoryId,
                "label": row.CategoryName
            })

        return {"status": "success", "data": categories}

    except Exception as e:
        return {"status": "error", "message": str(e)}

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass
