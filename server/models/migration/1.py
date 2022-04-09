from models.migration.base import Base

# Migration one
"""
This migration is about bringing up the initial schematics
"""

QUERIES = [
    """
    CREATE TYPE REQ_STATUS AS ENUM ('REQUESTED', 'APPROVED', 'DENIED');
    """,
    """
    CREATE TABLE IF NOT EXISTS approvals (
        id serial primary key,
        name text not null,
        phone text,
        requested_at timestamp not null,
        status text
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
