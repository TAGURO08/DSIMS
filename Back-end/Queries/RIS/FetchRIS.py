from datetime import datetime
from db import get_connection

def fetch_ris_data():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                r.RIS_id,
                r.Order_by,
                r.DateRequested,
                r.Status
            FROM RIS r
            ORDER BY r.DateRequested DESC
        """)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

        # Convert to list of dicts
        ris_list = []
        for row in rows:
            record = dict(zip(columns, row))
            record["DateRequested"] = (
                record["DateRequested"].strftime("%Y-%m-%d %H:%M:%S")
                if isinstance(record["DateRequested"], datetime)
                else record["DateRequested"]
            )
            ris_list.append(record)

        return {"status": "success", "data": ris_list}

    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        conn.close()
