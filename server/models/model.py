import models.db

KEY_NAME = 'enc_key'

def get_count(name='', number=''):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""SELECT count(*) from approvals where name = '{name}' or phone = '{number}'"""
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
    query = f"""SELECT * FROM approvals WHERE status = '{status}'"""
    cursor.execute(query)
    data = cursor.fetchall()
    dbConnection.closeConn()
    return data

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

def insert_otp(otp, name, phone):
    dbConnection = models.db.DbConnection()
    cursor = dbConnection.getCursor()
    query = f"""INSERT INTO otps
                VALUES (DEFAULT, '{name}', '{phone}', '{otp}', NOW() + INTERVAL '5 minutes')
                ON CONFLICT (name, phone) DO UPDATE
                SET otp = '{otp}', valid_till = NOW() + INTERVAL '5 minutes'
            """
    cursor.execute(query)
    dbConnection.closeConn()
    return True