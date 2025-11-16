import pyodbc

def get_connection():
    try:
        conn = pyodbc.connect(
            "DRIVER={ODBC Driver 17 for SQL Server};"
            "SERVER=LAPTOP-VNSR2M10\SQLEXPRESS;"
            "DATABASE=DSIMS;"
            "UID=sa;"
            "PWD=jervin15;"
        )
        print("Connection Successful!")
        return conn
    except Exception as e:
        print("Connection Failed:", e)

if __name__ == "__main__":
    get_connection()
