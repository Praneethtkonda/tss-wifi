import models.db

KEY_NAME = 'enc_key'

def get_count(name='', number=''):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""SELECT count(*) from approvals where phone = '{number}'"""
    cursor.execute(query)
    data = cursor.fetchone()[0]
    dbConnection.closeConn()
    return data

def req_access(name, number, ts, state='REQUESTED'):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""INSERT INTO approvals 
                VALUES (DEFAULT, '{name}', '{number}', '{ts}', '{state}')
                ON CONFLICT DO NOTHING
                """
    cursor.execute(query)
    dbConnection.closeConn()

def get_approval_status(name, number):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""SELECT status FROM approvals WHERE name = '{name}' and phone = '{number}'"""
    cursor.execute(query)
    data = cursor.fetchone()
    dbConnection.closeConn()
    return data

def get_approval_details(status):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""SELECT * FROM approvals WHERE status = '{status}'
                ORDER BY requested_at DESC"""
    cursor.execute(query)
    data = cursor.fetchall()
    dbConnection.closeConn()
    return data

def change_approval_status(name, number, status, mac_address, ts):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""UPDATE approvals
                SET status='{status}', requested_at='{ts}'
                WHERE name = '{name}' AND phone = '{number}'
                AND (SELECT count(*) from admins where mac_address = '{mac_address}') = 1
                """
    cursor.execute(query)
    dbConnection.closeConn()

def get_priv_key():
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""SELECT key FROM priv_key WHERE key_name = '{KEY_NAME}'"""
    cursor.execute(query)
    key = cursor.fetchone()[0]
    dbConnection.closeConn()
    return key

def load_ssid_details(ssid_name, ssid_enc_pass):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""INSERT INTO secrets
                VALUES ('{ssid_name}', '{ssid_enc_pass}')
                ON CONFLICT (ssid) DO UPDATE
                SET enc_pass = '{ssid_enc_pass}'
            """
    cursor.execute(query)
    dbConnection.closeConn()

def get_ssid_pass(ssid_name):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""SELECT enc_pass FROM secrets WHERE ssid = '{ssid_name}'"""
    cursor.execute(query)
    enc_pass = cursor.fetchone()[0]
    dbConnection.closeConn()
    return enc_pass

def get_otp_details(name, phone):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""SELECT otp FROM otps 
                WHERE NOW() <= valid_till
                AND name = '{name}' AND
                phone = '{phone}'
            """
    cursor.execute(query)
    data = cursor.fetchone()
    out = None
    if data:
        out = data[0]
    dbConnection.closeConn()
    return out

def insert_otp(otp, name, phone, otp_validity='5 minutes'):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""INSERT INTO otps
                VALUES (DEFAULT, '{name}', '{phone}', '{otp}', NOW() + INTERVAL '{otp_validity}')
                ON CONFLICT (name, phone) DO UPDATE
                SET otp = '{otp}', valid_till = NOW() + INTERVAL '{otp_validity}'
            """
    cursor.execute(query)
    dbConnection.closeConn()
    return True

def register_admin(name, phone, mac_address):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""INSERT INTO admins
                VALUES ('{name}', '{phone}', '{mac_address}')
                ON CONFLICT (mac_address) DO NOTHING
            """
    cursor.execute(query)
    dbConnection.closeConn()
    return True