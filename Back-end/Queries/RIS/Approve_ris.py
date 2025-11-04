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

        # 1️⃣ Generate PO number and date
        PO_Number = generate_po_number()
        DateApproved = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # 2️⃣ Insert new Purchase Order record
        sql_insert = """
            INSERT INTO Purchase_Order (SupplierId, RID_details_id, DateApproved, PO_Number, QtyToOrder)
            VALUES (?, ?, ?, ?, ?)
        """
        cursor.execute(sql_insert, (SupplierId, RID_details_id, DateApproved, PO_Number, QtyToOrder))

        # 3️⃣ Update RIS_Details (Approved + user ID)
        sql_update_ris = """
            UPDATE RIS_Details
            SET Status = 'Approved', id = ?
            WHERE RID_details_id = ?
        """
        cursor.execute(sql_update_ris, (user_id, RID_details_id))

        # 4️⃣ Get ItemId and Qty from RIS_Details
        cursor.execute("""
            SELECT ItemId, Qty FROM RIS_Details WHERE RID_details_id = ?
        """, (RID_details_id,))
        row = cursor.fetchone()
        if row:
            item_id, req_qty = row

            # 5️⃣ Deduct requested quantity from Item stock
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
            "message": "Purchase order created, RIS_Details approved, and stock updated.",
            "PO_Number": PO_Number
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

    finally:
        cursor.close()
        conn.close()
