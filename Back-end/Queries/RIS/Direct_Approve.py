from db import get_connection

def approve_ris_item_query(RID_details_id, user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT ItemId, Qty
            FROM RIS_Details
            WHERE RID_details_id = ?
        """, (RID_details_id,))
        row = cursor.fetchone()

        if not row:
            return {"status": "error", "message": "RIS item not found."}

        item_id, req_qty = row

        cursor.execute("""
            SELECT StockQty 
            FROM Item 
            WHERE ItemId = ?
        """, (item_id,))
        stock = cursor.fetchone()

        if not stock:
            return {"status": "error", "message": "Item not found."}

        stock_qty = stock[0]

        if stock_qty < req_qty:
            return {"status": "error", "message": "Insufficient stock."}

        cursor.execute("""
            UPDATE Item
            SET StockQty = StockQty - ?
            WHERE ItemId = ?
        """, (req_qty, item_id))

        cursor.execute("""
            UPDATE RIS_Details
            SET Status = 'Released', 
                id = ?
            WHERE RID_details_id = ?
        """, (user_id, RID_details_id))

        cursor.execute("""
            INSERT INTO StockCard
                (ItemId, TransactionType, Qty, DeliveryId, RID_details_id, DateTransacted)
            VALUES
                (?, 'Out', ?, NULL, ?, GETDATE())
        """, (item_id, req_qty, RID_details_id))

        conn.commit()

        return {"status": "success", "message": "Item approved, stock updated, and stockcard updated."}

    except Exception as e:
        return {"status": "error", "message": str(e)}

    finally:
        cursor.close()
        conn.close()
