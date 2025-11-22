from db import get_connection

def fetch_ris_items(ris_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            
  SELECT 
                rd.RID_details_id, 
                i.ProductName, 
                rd.Qty, 
                rd.UnitPrice,
                rd.Status,
                i.StockQty,
                po.Status AS POStatus,
                s.SupplierName AS SupplierName,
                name = u.fname + ' '+ mname + ' ' + lname
            FROM RIS_Details rd
            LEFT JOIN Item i ON rd.ItemId = i.ItemId
            LEFT JOIN Purchase_Order po ON po.RID_details_id = rd.RID_details_id
            LEFT JOIN Supplier s ON po.SupplierId = s.SupplierId
            LEFT JOIN [User] u ON rd.id = u.id
            WHERE rd.RIS_id = ?
        """, (ris_id,))
        
        rows = cursor.fetchall()
        if not rows:
            return {"status": "empty", "message": "No items found for this RIS."}
        
        columns = [col[0] for col in cursor.description]
        data = [dict(zip(columns, row)) for row in rows]
        return {"status": "success", "data": data}

    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        conn.close()
