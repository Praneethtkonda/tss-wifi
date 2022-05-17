from random import randint

def generate_otp(num_digits):
    otp = ''
    for _ in range(num_digits):
        otp += str(randint(0,9))
    return otp