from db import get_connection

def update_profile(user_id, data):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        UPDATE [User]
        SET fname = ?, mname = ?, lname = ?, email = ?,
            birthdate = ?, office = ?, role = ?
        WHERE id = ?
    """

    cursor.execute(
    query,
    (
        data.get("fname"),
        data.get("mname"),
        data.get("lname"),
        data.get("email"),
        data.get("birthdate"),
        data.get("office"),
        data.get("role"),
        user_id,
    )
)

    conn.commit()
    affected = cursor.rowcount

    cursor.close()
    conn.close()

    return affected > 0
