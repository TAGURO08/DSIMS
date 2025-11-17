from db import get_connection

def fetch_delivery_data():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        query = """
            SELECT PO.PurchaseId, I.ProductName, S.SupplierName, PO.QtyToOrder, PO.DateApproved, PO.Status
            FROM Purchase_Order PO
            JOIN Supplier S ON PO.SupplierId = S.SupplierId
            JOIN RIS_Details RD ON PO.RID_details_id = RD.RID_details_id
            JOIN Item I ON RD.ItemId = I.ItemId
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        data = []
        for row in rows:
            data.append({
                "PurchaseId": row[0],
                "ProductName": row[1],
                "SupplierName": row[2],
                "QtyToOrder": row[3],
                "DateApproved": row[4].strftime("%Y-%m-%d") if row[4] else None,
                "Status": row[5]
            })
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()
