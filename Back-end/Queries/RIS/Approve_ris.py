from datetime import datetime
import pyodbc
from db import get_connection

def approve_ris_query(ris_detail_id: int, supplier_id: int, qty_to_order: int, user_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Check if RIS_Details record exists
        cursor.execute("SELECT COUNT(*) FROM RIS_Details WHERE RID_details_id = ?", (ris_detail_id,))
        if cursor.fetchone()[0] == 0:
            return {"status": "error", "message": "RIS_Details record not found."}

        # Check if already approved
        cursor.execute("SELECT COUNT(*) FROM RIS_Details WHERE RID_details_id = ? AND Status = 'Approved'", (ris_detail_id,))
        if cursor.fetchone()[0] > 0:
            return {"status": "error", "message": "This item is already approved."}

        # Update RIS_Details
        cursor.execute("UPDATE RIS_Details SET Status = ?, id = ? WHERE RID_details_id = ?", ('Approved', user_id, ris_detail_id))

        # Insert into Purchase_Order with QtyToOrder
        cursor.execute("""
            INSERT INTO Purchase_Order (RID_details_id, SupplierId, DateApproved, QtyToOrder)
            VALUES (?, ?, ?, ?)
        """, (ris_detail_id, supplier_id, datetime.now(), qty_to_order))

        conn.commit()
        return {"status": "success", "message": "Item approved successfully."}

    except pyodbc.Error as e:
        conn.rollback()
        return {"status": "error", "message": f"Database error: {str(e)}"}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": f"Unexpected error: {str(e)}"}
    finally:
        conn.close()

