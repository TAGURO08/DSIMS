from db import get_connection
import bcrypt

def change_user_password(user_id: int, new_password: str):
    conn = get_connection()
    cursor = conn.cursor()

    # hash the password
    hashed_pw = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    cursor.execute("UPDATE [User] SET password = ? WHERE id = ?", (hashed_pw, user_id))
    conn.commit()
    conn.close()
    return True
