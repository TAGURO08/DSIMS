import pyodbc

def get_connection():
    try:
        conn = pyodbc.connect(
            "DRIVER={ODBC Driver 17 for SQL Server};"
            "SERVER=EUGENE;"
            "DATABASE=DSIMS;"
            "UID=sa;"
            "PWD=eugene1234;"
        )
        print("Connection Successful!")
        return conn
    except Exception as e:
        print("Connection Failed:", e)

if __name__ == "__main__":
    get_connection()
