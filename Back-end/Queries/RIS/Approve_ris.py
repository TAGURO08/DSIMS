from datetime import datetime
from db import get_connection
import random

def generate_po_number():
    date_part = datetime.now().strftime("%Y%m%d")
    random_part = random.randint(100, 999)
    return f"PO-{date_part}-{random_part}"

def add_purchase_order_query(SupplierId, RID_details_id, QtyToOrder, user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT d.ItemId, d.Qty, i.StockQty
            FROM RIS_Details d
            JOIN Item i ON d.ItemId = i.ItemId
            WHERE d.RID_details_id = ?
        """, (RID_details_id,))
        row = cursor.fetchone()

        if not row:
            return {"status": "error", "message": "Item not found"}

        item_id, req_qty, stock_qty = row

        qty_to_order = max(req_qty - stock_qty, 0)

        PO_Number = None
        if qty_to_order > 0:
            PO_Number = generate_po_number()
            DateApproved = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            cursor.execute("""
                INSERT INTO Purchase_Order 
                (SupplierId, RID_details_id, DateApproved, PO_Number, QtyToOrder, Status)
                VALUES (?, ?, ?, ?, ?, 'For Delivery')
            """, (SupplierId, RID_details_id, DateApproved, PO_Number, qty_to_order))

            cursor.execute("""
                UPDATE RIS
                SET id = ?, Status = 'For Delivery'
                WHERE RIS_id = (SELECT RIS_id FROM RIS_Details WHERE RID_details_id = ?)
            """, (user_id, RID_details_id))
        conn.commit()

        return {
            "status": "success",
            "message": "Order processed successfully.",
            "PO_Number": PO_Number if PO_Number else "No PO needed"
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

    finally:
        cursor.close()
        conn.close()
