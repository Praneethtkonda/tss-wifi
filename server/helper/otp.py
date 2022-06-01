from random import randint

import os
import requests
import json

SMS_UPSTREAM_URL = "https://www.fast2sms.com/dev/bulkV2"

def generate_otp(num_digits):
    otp = ""
    for _ in range(num_digits):
        otp += str(randint(0, 9))
    return otp

def send_otp_sms(otp, mobilenumber):
    api_key = os.environ.get("OTP_KEY", "")
    if api_key == "":
        return 'Failed'
    payload = json.dumps(
        {
            "route": "otp",
            "variables_values": otp,
            "language": "english",
            "numbers": mobilenumber,
        }
    )
    headers = {
        "Authorization": api_key,
        "Content-Type": "application/json",
    }

    response = requests.request("POST", SMS_UPSTREAM_URL, headers=headers, data=payload)
    return response.text
