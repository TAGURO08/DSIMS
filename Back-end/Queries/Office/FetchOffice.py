from db import get_connection

def fetch_offices():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT OfficeId, OfficeName, OfficeLocation, Status, DateCreated FROM Office")
    rows = cursor.fetchall()
    conn.close()

    offices = []
    for row in rows:
        offices.append({
            "OfficeId": row[0],
            "OfficeName": row[1],
            "OfficeLocation": row[2],
            "Status": row[3],
            "DateCreated": row[4]
        })
    return offices
