from db import get_connection

def fetch_delivery_data():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        query = """
            SELECT I.ProductName, S.SupplierName, PO.QtyToOrder, PO.DateApproved, RD.Status
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
                "ProductName": row.ProductName,
                "SupplierName": row.SupplierName,
                "QtyToOrder": row.QtyToOrder,
                "DateApproved": row.DateApproved.strftime("%Y-%m-%d") if row.DateApproved else None,
                "Status": row.Status
            })
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()
