from prechecks import init

init()

from fastapi import APIRouter, FastAPI

from conf.settings import settings
from routes import tasks

# Use openapi_url=None for disabling the openapi spec
app = FastAPI(title=settings.PROJECT_NAME)

api_router = APIRouter()

api_router.include_router(tasks.router, prefix=settings.API_V1_STR, tags=["tasks"])

app.include_router(api_router)