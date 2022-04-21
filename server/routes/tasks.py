from celery.result import AsyncResult
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models import model
from pydantic import BaseModel
from worker import health_celery_task, req_access


class ReqData(BaseModel):
    name: str
    mobilenumber: str


router = APIRouter()


@router.get("/health")
def get_status():
    result = {"Response": "Up and running"}
    return JSONResponse(result)


# Route where user sends data to backend
# TODO: Do data validations in the future
@router.post("/ask_for_access")
def get_status(data: ReqData):
    name = data.name.strip()
    number = data.mobilenumber.strip()
    task = req_access.delay(name, number)
    return JSONResponse({"task_id": task.id})


@router.post("/ask_for_info")
def get_status():
    result = {"Response": "Up and running"}
    return JSONResponse(result)


@router.get("/check_for_approval_status")
def get_status():
    result = {"Response": "Up and running"}
    return JSONResponse(result)


@router.get("/health_celery")
def health_celery():
    task = health_celery_task.delay()
    return JSONResponse({"task_id": task.id})
