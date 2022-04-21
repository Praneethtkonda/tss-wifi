import os
import time
from datetime import datetime

from celery import Celery
from models import model

REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = os.environ.get("REDIS_PORT", "6379")

celery = Celery(__name__)
celery_url = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
celery.conf.broker_url = celery_url
celery.conf.result_backend = celery_url


@celery.task(name="health_celery_task")
def health_celery_task():
    time.sleep(5)
    print(model.sample())
    return {"Status": "Working"}


@celery.task(name="req_access")
def req_access(name, number):
    print(name, number)
    ts = datetime.today().isoformat()
    try:
        model.req_access(name, number, ts)
    except Exception as e:
        print(e)

    return True
