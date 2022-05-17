from models.migration.base import Base
from cryptography.fernet import Fernet

KEY_NAME = 'enc_key'

# Migration one
"""
This migration is about bringing up the initial schematics
"""

QUERIES = [
    """
    CREATE TYPE REQ_STATUS AS ENUM ('REQUESTED', 'PENDING', 'APPROVED', 'DENIED');
    """,
    """
    CREATE TABLE IF NOT EXISTS approvals (
        id serial,
        name text not null,
        phone VARCHAR(10),
        requested_at timestamp not null,
        status REQ_STATUS default 'REQUESTED'::REQ_STATUS,
        PRIMARY KEY (name, phone)
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS secrets (
        ssid text not null,
        enc_pass text not null,
        PRIMARY KEY (ssid)
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS priv_key (
        key_name text not null,
        key text not null,
        PRIMARY KEY (key_name)
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS otps (
        id serial,
        name text not null,
        phone VARCHAR(10),
        otp VARCHAR(5),
        valid_till timestamp not null,
        PRIMARY KEY (name, phone),
        FOREIGN KEY (name, phone) REFERENCES approvals (name, phone)
    )
    """,
]


class Migration(Base):
    def __init__(self):
        super().__init__("One")

    def _do_magic(self, cursor):
        key = Fernet.generate_key().decode()
        key_name = KEY_NAME
        query = f"INSERT INTO priv_key VALUES('{key_name}', '{key}') ON CONFLICT(key_name) DO NOTHING"
        cursor.execute(query)

    def migrate(self):
        print("Starting migration for version One")
        for query in QUERIES:
            cursor = self.db.getCursor()
            cursor.execute(query)
        self._do_magic(cursor)