import models.db


def sample():
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""SELECT count(*) from approvals"""
    cursor.execute(query)
    dbConnection.closeConn()


def req_access(name, number, ts):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""INSERT INTO approvals VALUES (DEFAULT, '{name}', '{number}', '{ts}')"""
    cursor.execute(query)
    dbConnection.closeConn()