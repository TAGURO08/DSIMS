from db import get_connection

def fetch_aggregated_ris_items():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT i.ProductName, SUM(rd.Qty) as RequestedQuantity
            FROM RIS_Details rd
            JOIN Item i ON rd.ItemId = i.ItemId
            GROUP BY i.ProductName
            ORDER BY RequestedQuantity DESC
        """)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        data = [dict(zip(columns, row)) for row in rows]
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        conn.close()
