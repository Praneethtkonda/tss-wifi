from models.migration.base import Base

# Migration two
"""
This migration is about setting up schematics related to admin app
"""

QUERIES = [
    """
    CREATE TABLE IF NOT EXISTS admins (
        name TEXT NOT NULL,
        phone VARCHAR(10) NOT NULL,
        mac_address TEXT NOT NULL,
        PRIMARY KEY (mac_address)
    );
    """
]

class Migration(Base):
    def __init__(self):
        super().__init__("Two")

    def migrate(self):
        print("Starting migration for version Two")
        for query in QUERIES:
            cursor = self.db.getCursor()
            cursor.execute(query)