from celery.result import AsyncResult
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models import model
from pydantic import BaseModel
from worker import health_celery_task


class MemoryData(BaseModel):
    data: str
    buildid: str
    endtime: str


router = APIRouter()


@router.get("/health")
def get_status():
    result = {"Response": "Up and running"}
    return JSONResponse(result)


@router.get("/health_celery")
def health_celery():
    task = health_celery_task.delay()
    return JSONResponse({"task_id": task.id})
