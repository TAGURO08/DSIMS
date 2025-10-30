from db import get_connection

def fetch_categories():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT CategoryId, CategoryName, Description, Status, DateCreated FROM Category")
        rows = cursor.fetchall()

        categories = []
        for row in rows:
            categories.append({
                "categoryId": row[0],
                "categoryName": row[1],
                "description": row[2],
                "status": row[3],
                "dateCreated": str(row[4])
            })

        return {"status": "success", "data": categories}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
