from db import get_connection

def fetch_suppliers():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
        SELECT SupplierId, SupplierName, SupplierAddress, SupplierContact, Status, DateCreated
        FROM Supplier
        ORDER BY SupplierId DESC
        """
        cursor.execute(query)
        rows = cursor.fetchall()

        columns = [column[0] for column in cursor.description]
        suppliers = [dict(zip(columns, row)) for row in rows]

        cursor.close()
        conn.close()

        return {"status": "success", "data": suppliers}

    except Exception as e:
        print("Error in fetch_all_suppliers:", e)
        return {"status": "error", "message": str(e)}
