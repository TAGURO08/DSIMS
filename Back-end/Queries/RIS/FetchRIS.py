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
                (
                    SELECT MAX(sc.DateTransacted)
                    FROM StockCard sc
                    JOIN RIS_Details rd ON sc.RID_details_id = rd.RID_details_id
                    WHERE rd.RIS_id = r.RIS_id
                ) AS DateReceived,
                r.Status
            FROM RIS r
            ORDER BY r.DateRequested DESC
        """)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

        ris_list = []
        for row in rows:
            record = dict(zip(columns, row))
            record["DateRequested"] = (
                record["DateRequested"].strftime("%Y-%m-%d %H:%M:%S")
                if isinstance(record["DateRequested"], datetime)
                else record["DateRequested"]
            )
            record["DateReceived"] = (
                record.get("DateReceived").strftime("%Y-%m-%d %H:%M:%S")
                if isinstance(record.get("DateReceived"), datetime)
                else record.get("DateReceived")
            )
            ris_list.append(record)

        return {"status": "success", "data": ris_list}

    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        conn.close()
