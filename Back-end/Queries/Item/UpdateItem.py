from db import get_connection

def edit_item_query(item_id, updated_data):
    try:
        conn = get_connection()
        if conn is None:
            return {"status": "error", "message": "Database connection failed"}

        cursor = conn.cursor()

        # Get values from request body
        product_name = updated_data.get("productName")
        description = updated_data.get("description")
        category_name = updated_data.get("categoryName")
        unit_price = updated_data.get("unitPrice")

        # 🔍 Find category ID by name
        cursor.execute("SELECT CategoryId FROM Category WHERE CategoryName = ?", (category_name,))
        result = cursor.fetchone()
        if not result:
            conn.close()
            return {"status": "error", "message": "Category not found"}

        category_id = result[0]

        # 🔄 Update item
        cursor.execute("""
            UPDATE Item
            SET ProductName = ?, Description = ?, CategoryId = ?, UnitPrice = ?
            WHERE ItemId = ?
        """, (product_name, description, category_id, unit_price, item_id))

        conn.commit()
        conn.close()

        return {"status": "success", "message": "Item updated successfully"}

    except Exception as e:
        return {"status": "error", "message": str(e)}
