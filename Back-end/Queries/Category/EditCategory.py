from db import get_connection

def edit_category_query(category_id, category_data):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE Category
            SET CategoryName = ?, Description = ?, Status = ?
            WHERE CategoryId = ?
        """, (
            category_data["categoryName"],
            category_data["description"],
            category_data["status"],
            category_id
        ))

        conn.commit()
        conn.close()

        return {"status": "success", "message": "Category updated successfully."}

    except Exception as e:
        return {"status": "error", "message": str(e)}
