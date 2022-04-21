from models.migration.base import Base

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
        key text not null,
        value text not null
    );
    """,
]


class Migration(Base):
    def __init__(self):
        super().__init__("One")

    def migrate(self):
        print("Starting migration for version One")
        for query in QUERIES:
            cursor = self.db.getCursor()
            cursor.execute(query)
