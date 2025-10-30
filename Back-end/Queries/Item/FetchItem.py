import pyodbc
from db import get_connection

def fetch_items():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
        SELECT 
            i.ItemId,
            i.ProductName,
            c.CategoryName,
            i.Description,
            i.UnitPrice,
            i.Status,
            i.DateCreated
        FROM Item i
        INNER JOIN Category c ON i.CategoryId = c.CategoryId
        WHERE i.Status = 'Active'
        """

        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        items = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return {"status": "success", "data": items}

    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()
