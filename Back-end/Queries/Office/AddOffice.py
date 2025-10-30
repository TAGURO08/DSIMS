from fastapi import FastAPI, HTTPException
from db import get_connection
from datetime import date

app = FastAPI()

def add_office(office: dict):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        today = date.today()

        cursor.execute("""
            INSERT INTO [Office] (OfficeName, OfficeLocation, Status, DateCreated)
            VALUES (?, ?, 'Active', ?)
        """, (
            office["officeName"],
            office["location"],
            today
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return {"status": "success", "message": "Office added successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/office/add")
def add_office_route(office: dict):
    result = add_office(office)
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result
