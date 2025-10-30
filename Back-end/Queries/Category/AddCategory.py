from db import get_connection
from datetime import datetime

def add_category(category: dict):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        sql = """
        INSERT INTO Category (CategoryName, Description, Status, DateCreated)
        VALUES (?, ?, ?, ?)
        """
        cursor.execute(
            sql,
            (
                category["categoryName"],
                category["description"],
                category.get("status", "Active"),
                datetime.now().date(),
            ),
        )
        conn.commit()

        return {"status": "success", "message": "Category added successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
