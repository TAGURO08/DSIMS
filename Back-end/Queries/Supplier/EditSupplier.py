from db import get_connection

def edit_supplier(supplier_id, supplier_data):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
        UPDATE Supplier
        SET 
            SupplierName = ?, 
            SupplierAddress = ?, 
            SupplierContact = ?, 
            Status = ?
        WHERE SupplierID = ?
        """

        values = (
            supplier_data["supplier"],
            supplier_data["address"],
            supplier_data["contactNumber"],
            supplier_data["status"],
            supplier_id,
        )

        cursor.execute(query, values)
        conn.commit()

        if cursor.rowcount == 0:
            return {"status": "error", "message": "Supplier not found"}

        return {"status": "success", "message": "Supplier updated successfully"}

    except Exception as e:
        return {"status": "error", "message": str(e)}

    finally:
        cursor.close()
        conn.close()
