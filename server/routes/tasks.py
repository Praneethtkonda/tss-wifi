# from celery.result import AsyncResult
from cryptography.fernet import Fernet
from datetime import datetime
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from helper.fake_data import get_data
from helper.otp import generate_otp, send_otp_sms
from helper.parser import parse_approval_data
from models import model
from pydantic import BaseModel
# from worker import health_celery_task, req_access

class ReqData(BaseModel):
    name: str
    mobilenumber: str

class ReqDataAll(BaseModel):
    status: str

class ReqDataSpecific(BaseModel):
    name: str
    mobilenumber: str
    status: str
    mac_address: str

class Admin(BaseModel):
    name: str
    mobilenumber: str
    mac_address: str

class SSIDData(BaseModel):
    ssid_name: str
    ssid_pass: str

class SSID(BaseModel):
    ssid_name: str
    name: str
    mobilenumber: str
    otp: str

router = APIRouter()


@router.get("/health")
def health_check():
    result = {"Response": "Up and running"}
    return JSONResponse(result)

@router.get("/fake_data_ingest")
def ingest_fake_data():
    result = get_data()
    for entry in result:
        model.req_access(entry['name'], entry['phone'], entry['requested_at'], entry['state'])
    return JSONResponse({"message": f"Inserted {len(result)} records "})

@router.post("/all_approval_details", status_code=200)
def all_approv_details(data: ReqDataAll):
    status = data.status.strip()
    data = model.get_approval_details(status)
    data = parse_approval_data(data)
    return JSONResponse({"data": data})

@router.post("/change_approval_status", status_code=201)
def change_appov_status(data: ReqDataSpecific):
    name = data.name.strip()
    number = data.mobilenumber.strip()
    status = data.status.strip()
    mac_address = data.mac_address.strip()
    ts = datetime.today().isoformat()
    model.change_approval_status(name, number, status, mac_address, ts)
    return JSONResponse({"message": f"Changed status to {status}"})

# Route where user sends data to backend
# TODO: Do data validations in the future
@router.post("/request_for_approval")
def req_for_approval(data: ReqData):
    name = data.name.strip()
    number = data.mobilenumber.strip()
    count = model.get_count(name, number)
    if count > 0:
        return JSONResponse({"warn": "Entry with similar details already present. Please proceed further"})
    # task = req_access.delay(name, number)
    ts = datetime.today().isoformat()
    model.req_access(name, number, ts)
    return JSONResponse({"message": "Entry created"})

@router.post("/load_ssid_details", status_code=201)
# TODO: Add error handling from db
def load_ssid(data: SSIDData):
    ssid_name = data.ssid_name.strip()
    ssid_pass = data.ssid_pass.strip()
    priv_key = model.get_priv_key()
    fernet = Fernet(priv_key.encode())
    final_pass = fernet.encrypt(ssid_pass.encode()).decode()
    model.load_ssid_details(ssid_name, final_pass)
    return JSONResponse({"message": "Entry created"})

@router.post("/get_ssid_details")
# Only return password if otp is there
def get_ssid_pass(data: SSID):
    name = data.name.strip()
    number = data.mobilenumber.strip()
    ssid_name = data.ssid_name.strip()
    otp_input = data.otp.strip()
    otp_db = model.get_otp_details(name, number)
    if not otp_db or otp_db != otp_input:
        return JSONResponse({"error": "OTP expired / Wrong. Generate OTP and try again"})
    priv_key = model.get_priv_key()
    enc_pass_db = model.get_ssid_pass(ssid_name)
    fernet = Fernet(priv_key.encode())
    org_pass = fernet.decrypt(enc_pass_db.encode()).decode()
    return JSONResponse({"p": org_pass})

@router.post("/generate_otp")
def get_otp(data: ReqData):
    name = data.name.strip()
    number = data.mobilenumber.strip()
    approval_status = model.get_approval_status(name, number)
    if not approval_status:
        result = {"error": "Please check your request and post again"}
        return JSONResponse(result)
    status = approval_status[0]
    if status != 'APPROVED':
        result = {"error": "Can't generate otp as you don't have approval rights"}
        return JSONResponse(result)
    otp_db = model.get_otp_details(name, number)
    if otp_db:
        result = {"otp": otp_db}
        result = {"info_message": "Otp already got generated, pls check your mobile"}
        return JSONResponse(result)
    otp = generate_otp(num_digits=5)
    # Sending sms only if otp gets expired
    response = send_otp_sms(otp, number)
    if 'success' not in response:
        result = {"error": "Cannot generate otp. Try generating it again"}
        return JSONResponse(result)
    model.insert_otp(otp, name, number, otp_validity='5 minutes')
    result = {"succ_message": "Successfully generated otp, pls check your mobile"}
    return JSONResponse(result)


@router.post("/check_approval_status")
def ch_approval_status(data: ReqData):
    name = data.name.strip()
    number = data.mobilenumber.strip()
    approval_status = model.get_approval_status(name, number)
    if not approval_status:
        result = {"error": "Please check your request and post again"}
        return JSONResponse(result)
    status = approval_status[0]
    result = {"status": status}
    return JSONResponse(result)

# TODO: Secure this route
@router.post("/register_admin", status_code=201)
def change_appov_status(data: Admin):
    name = data.name.strip()
    number = data.mobilenumber.strip()
    mac_address = data.mac_address.strip()
    model.register_admin(name, number, mac_address)
    return JSONResponse({"message": f"Registered admin successfully"})
