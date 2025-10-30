from datetime import datetime
import pyodbc
from db import get_connection

def approve_ris_query(ris_detail_id: int, supplier_id: int, user_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # ✅ Check if RIS_Details record exists
        cursor.execute("SELECT COUNT(*) FROM RIS_Details WHERE RID_details_id = ?", (ris_detail_id,))
        exists = cursor.fetchone()[0]
        if exists == 0:
            return {"status": "error", "message": "RIS_Details record not found."}

        # ✅ Check if already approved
        cursor.execute("""
            SELECT COUNT(*) FROM RIS_Details 
            WHERE RID_details_id = ? AND Status = 'Approved'
        """, (ris_detail_id,))
        already_approved = cursor.fetchone()[0]
        if already_approved > 0:
            return {"status": "error", "message": "This item is already approved."}

        # ✅ Update RIS_Details with Status and User ID (foreign key)
        cursor.execute("""
            UPDATE RIS_Details
            SET Status = ?, id = ?
            WHERE RID_details_id = ?
        """, ('Approved', user_id, ris_detail_id))

        # ✅ Insert into Purchase_Order
        cursor.execute("""
            INSERT INTO Purchase_Order (RID_details_id, SupplierId, DateApproved)
            VALUES (?, ?, ?)
        """, (ris_detail_id, supplier_id, datetime.now()))

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
