import pyodbc
from db import get_connection

def add_item(item_data):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        check_query = "SELECT COUNT(*) FROM Category WHERE CategoryId = ?"
        cursor.execute(check_query, (item_data["categoryId"],))
        count = cursor.fetchone()[0]

        if count == 0:
            return {"status": "error", "message": "Invalid CategoryId. Category does not exist."}

        query = """
        INSERT INTO Item (ProductName, CategoryId, Description, UnitPrice, Status, DateCreated)
        VALUES (?, ?, ?, ?, 'Active', GETDATE())
        """

        cursor.execute(
            query,
            (
                item_data["productName"],
                item_data["categoryId"],
                item_data["description"],
                item_data["unitPrice"],
            ),
        )

        conn.commit()
        return {"status": "success", "message": "Item added successfully"}

    except pyodbc.IntegrityError as e:
        return {"status": "error", "message": "Foreign key constraint failed: " + str(e)}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()
