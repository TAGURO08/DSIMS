# queries.py
from db import get_connection

def receive_item_query(rid_details_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Fetch RIS item details and corresponding PO status
        cursor.execute("""
            SELECT RD.ItemId, RD.Qty, PO.Status as POStatus
            FROM RIS_Details RD
            LEFT JOIN Purchase_Order PO
                ON RD.RID_details_id = PO.RID_details_id
            WHERE RD.RID_details_id = ?
        """, (rid_details_id,))
        row = cursor.fetchone()

        if not row:
            return {"status": "error", "message": "RIS item not found"}

        item_id, qty_requested, po_status = row

        if po_status != "Delivered":
            return {
                "status": "error",
                "message": f"Item cannot be received. PO status: {po_status or 'Not Delivered'}"
            }

        # Deduct stock from Item table
        cursor.execute("""
            UPDATE Item
            SET StockQty = StockQty - ?
            WHERE ItemId = ?
        """, (qty_requested, item_id))

        # Add stockcard OUT entry with RID_details_id
        cursor.execute("""
            INSERT INTO StockCard (ItemId, TransactionType, Qty, RID_details_id, DateTransacted)
            VALUES (?, 'OUT', ?, ?, GETDATE())
        """, (item_id, qty_requested, rid_details_id))

        # Update RIS status to Received
        cursor.execute("""
            UPDATE RIS_Details
            SET Status = 'Released'
            WHERE RID_details_id = ?
        """, (rid_details_id,))

        conn.commit()
        return {"status": "success", "message": "Item successfully received!"}

    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}

    finally:
        cursor.close()
        conn.close()
