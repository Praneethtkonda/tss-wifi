import models.db


def sample():
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""SELECT count(*) from approvals"""
    cursor.execute(query)
    dbConnection.closeConn()
