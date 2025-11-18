from datetime import datetime
from db import get_connection

def add_ris_transaction(data):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        order_by = data.get("order_by")
        items = data.get("items", [])

        if not order_by or not items:
            return {"status": "error", "message": "Missing required fields"}

        date_requested = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("""
            INSERT INTO RIS (Status, Order_by, DateRequested)
            OUTPUT INSERTED.RIS_id
            VALUES (?, ?, ?)
        """, ('Pending', order_by, date_requested))

        ris_id_row = cursor.fetchone()
        if not ris_id_row:
            raise Exception("Failed to retrieve RIS_id after insert")
        ris_id = ris_id_row[0]

        date_created = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        for item in items:
            item_id = item.get("item_id")
            quantity = int(item.get("quantity", 0))

            if not item_id or quantity <= 0:
                continue

            cursor.execute("SELECT UnitPrice, StockQty FROM Item WHERE ItemId = ?", (item_id,))
            row = cursor.fetchone()
            if not row:
                return {"status": "error", "message": f"ItemId {item_id} not found"}

            unit_price, stock_qty = row
            total_price = unit_price * quantity

            cursor.execute("""
                INSERT INTO RIS_Details (ItemId, RIS_id, Qty, DateCreated, UnitPrice, Status)
                VALUES (?, ?, ?, ?, ?, 'Pending')
            """, (item_id, ris_id, quantity, date_created, total_price))

        conn.commit()
        return {"status": "success", "message": "RIS transaction added successfully"}

    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        conn.close()
