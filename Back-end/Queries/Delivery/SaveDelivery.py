from db import get_connection
from datetime import datetime

def mark_as_delivered(purchase_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE RD
            SET RD.Status = 'Delivered'
            FROM RIS_Details RD
            JOIN Purchase_Order PO ON RD.RID_details_id = PO.RID_details_id
            WHERE PO.PurchaseId = ?
        """, (purchase_id,))

        cursor.execute("""
            INSERT INTO Delivery (PurchaseId, DeliveryDate)
            VALUES (?, ?)
        """, (purchase_id, datetime.now()))

        conn.commit()
        return {"status": "success", "message": "Item marked as delivered."}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()
