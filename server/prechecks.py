import os
import psycopg2
import time

from psycopg2.extras import DictCursor
from psycopg2.pool import SimpleConnectionPool
from models.migration.start import startMigration

DB_HOST = os.environ.get("DB_HOST", "postgresdb")
DB_PORT = os.environ.get("DB_PORT", "5432")
DB_NAME = os.environ.get("DB_NAME", "postgres")
DB_PASS = os.environ.get("DB_PASS", "password")
MAX_NUM_RETRIES = 10

QUERIES = [
    """
    CREATE TABLE IF NOT EXISTS migration (
        version text primary key,
        created_at timestamp not null,
        result text not null
    )"""
]


def _start():
    print("Starting the precheck")
    CONNECTION = f"postgres://postgres:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    conn = psycopg2.connect(CONNECTION)
    cursor = conn.cursor()
    for query in QUERIES:
        print(f"Executing query: {query}")
        cursor.execute(query)
        conn.commit()
    cursor.close()


def start_migration():
    try:
        startMigration()
    except Exception as e:
        print(e)
        print("Failed migration")


def init():
    print("coming to init")
    num_retries = 0
    while num_retries <= MAX_NUM_RETRIES:
        flag = True
        try:
            _start()
        except Exception as e:
            flag = False
            print(e)
            print("Sleeping and will try to reconnect with the db")
            time.sleep(3)
        finally:
            num_retries += 1
            if flag:
                break
    if flag:
        print("Init has finished. Running the migration...")
        start_migration()
    else:
        print("Connection to the database failed")
