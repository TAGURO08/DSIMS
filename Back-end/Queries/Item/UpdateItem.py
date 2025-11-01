from db import get_connection

def edit_item_query(item_id, updated_data):
    try:
        conn = get_connection()
        if conn is None:
            return {"status": "error", "message": "Database connection failed"}

        cursor = conn.cursor()

        product_name = updated_data.get("productName")
        description = updated_data.get("description")
        category_name = updated_data.get("categoryName")
        unit_price = updated_data.get("unitPrice")
        stock_qty = updated_data.get("stockQty")

        cursor.execute("SELECT CategoryId FROM Category WHERE CategoryName = ?", (category_name,))
        result = cursor.fetchone()
        if not result:
            conn.close()
            return {"status": "error", "message": "Category not found"}

        category_id = result[0]

        cursor.execute("""
            UPDATE Item
            SET ProductName = ?, Description = ?, CategoryId = ?, UnitPrice = ?, StockQty = ?
            WHERE ItemId = ?
        """, (product_name, description, category_id, unit_price, stock_qty, item_id))

        conn.commit()
        conn.close()

        return {"status": "success", "message": "Item updated successfully"}

    except Exception as e:
        return {"status": "error", "message": str(e)}
