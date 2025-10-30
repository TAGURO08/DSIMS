from db import get_connection

def add_supplier(supplier_data):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
        INSERT INTO Supplier (SupplierName, SupplierAddress, SupplierContact, Status, DateCreated)
        VALUES (?, ?, ?, ?, GETDATE())
        """

        cursor.execute(
            query,
            (
                supplier_data.get("supplierName"),
                supplier_data.get("address"),
                supplier_data.get("contactNumber"),
                "Active",
            ),
        )

        conn.commit()
        cursor.close()
        conn.close()

        return {"status": "success", "message": "Supplier added successfully!"}

    except Exception as e:
        print("Error adding supplier:", e)
        return {"status": "error", "message": str(e)}
