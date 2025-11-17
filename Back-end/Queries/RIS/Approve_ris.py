from datetime import datetime
from db import get_connection
import random

def generate_po_number():
    """Generate unique PO number like PO-20251103-123"""
    date_part = datetime.now().strftime("%Y%m%d")
    random_part = random.randint(100, 999)
    return f"PO-{date_part}-{random_part}"

def add_purchase_order_query(SupplierId, RID_details_id, QtyToOrder, user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        PO_Number = generate_po_number()
        DateApproved = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        sql_insert = """
            INSERT INTO Purchase_Order (SupplierId, RID_details_id, DateApproved, PO_Number, QtyToOrder, Status)
            VALUES (?, ?, ?, ?, ?, 'For Delivery')
        """
        cursor.execute(sql_insert, (SupplierId, RID_details_id, DateApproved, PO_Number, QtyToOrder))

        # ✅ GET RIS_id from RIS_Details
        cursor.execute("""
            SELECT RIS_id FROM RIS_Details WHERE RID_details_id = ?
        """, (RID_details_id,))
        ris_row = cursor.fetchone()

        if ris_row:
            RIS_id = ris_row[0]

            # ✅ UPDATE RIS table with user id from localStorage
            cursor.execute("""
                UPDATE RIS
                SET id = ?, Status = 'For Delivery'
                WHERE RIS_id = ?
            """, (user_id, RIS_id))

        # Update item stock
        cursor.execute("""
            SELECT ItemId, Qty FROM RIS_Details WHERE RID_details_id = ?
        """, (RID_details_id,))
        row = cursor.fetchone()

        if row:
            item_id, req_qty = row

            cursor.execute("""
                UPDATE Item
                SET StockQty = CASE
                    WHEN StockQty >= ? THEN StockQty - ?
                    ELSE 0
                END
                WHERE ItemId = ?
            """, (req_qty, req_qty, item_id))

        conn.commit()

        return {
            "status": "success",
            "message": "PO created and RIS updated with user ID.",
            "PO_Number": PO_Number
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

    finally:
        cursor.close()
        conn.close()

