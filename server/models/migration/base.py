import os
import sys
from datetime import datetime

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)
import db

# TODO: Update the migration logic to run only
# versions that are more than the latest version
class Base:
    def __init__(self, name=""):
        self.name = name
        self.db = db.DbConnection()
        self.queries = []

    def migrate(self):
        pass

    def run(self):
        cursor = self.db.getCursor()
        query = f"""SELECT count(*) from migration where version='{self.name}'"""
        cursor.execute(query)
        data = cursor.fetchone()[0]
        if int(data) > 0:
            print(f"Migration is already done for version {self.name}")
        else:
            self.migrate()
            query = f"""INSERT into migration values('{self.name}', '{datetime.today().isoformat()}', 'SUCCESS');"""
            cursor.execute(query)
            print(f"Migration successful for version {self.name}")
        self.db.closeConn()