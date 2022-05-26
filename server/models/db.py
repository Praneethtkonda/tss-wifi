import os
from psycopg2.extras import DictCursor
from psycopg2.pool import SimpleConnectionPool

# DB_HOST = os.environ.get("DB_HOST", "postgresdb")
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = os.environ.get("DB_PORT", "5432")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_NAME = os.environ.get("DB_NAME", "postgres")
DB_PASS = os.environ.get("DB_PASS", "password")


class DbConnection:
    """Get a cursor from a pool of connections."""

    def __init__(self):
        self.pool = SimpleConnectionPool(
            minconn=2,
            maxconn=20,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            cursor_factory=DictCursor,
        )
        self.connection = None
        self.cursor = None

    def getConn(self):
        self.connection = self.pool.getconn()
        return self.connection

    def getCursor(self):
        if not self.connection:
            self.connection = self.getConn()
        self.cursor = self.connection.cursor()
        return self.cursor

    def closeConn(self):
        self.cursor.close()
        self.connection.commit()
        self.pool.putconn(self.connection)
        self.pool.closeall()

    def executeQuery(self, query):
        cursor = self.getCursor()
        cursor.execute(query)
        self.closeConn()
