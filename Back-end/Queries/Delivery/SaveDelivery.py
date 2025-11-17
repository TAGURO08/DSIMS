from db import get_connection
from datetime import datetime

def mark_as_delivered(purchase_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE PO
            SET PO.Status = 'Delivered'
            FROM Purchase_Order PO
            INNER JOIN RIS_Details RD 
                ON RD.RID_details_id = PO.RID_details_id
            WHERE PO.PurchaseId = ?;
        """, (purchase_id,))

        delivery_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("""
            INSERT INTO Delivery (PurchaseId, DeliveryDate)
            OUTPUT INSERTED.DeliveryId
            VALUES (?, ?)
        """, (purchase_id, delivery_date))

        delivery_row = cursor.fetchone()
        if not delivery_row:
            raise Exception("Failed to insert into Delivery table")

        delivery_id = delivery_row[0]

        cursor.execute("""
            SELECT RD.RID_details_id, RD.ItemId, PO.QtyToOrder
            FROM Purchase_Order PO
            JOIN RIS_Details RD ON PO.RID_details_id = RD.RID_details_id
            WHERE PO.PurchaseId = ?
        """, (purchase_id,))
        items = cursor.fetchall()

        if not items:
            raise Exception("No items found for this PurchaseId")

        for rid_details_id, item_id, qty in items:

            cursor.execute("""
                INSERT INTO StockCard 
                    (ItemId, TransactionType, Qty, DeliveryId, DateTransacted)
                VALUES 
                    (?, 'IN', ?, ?, GETDATE())
            """, (item_id, qty, delivery_id))

            cursor.execute("""
                UPDATE Item
                SET StockQty = StockQty + ?
                WHERE ItemId = ?
            """, (qty, item_id))

        conn.commit()

        return {"status": "success", "message": "Delivery completed! Stock updated and StockCard recorded."}

    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}

    finally:
        cursor.close()
        conn.close()
