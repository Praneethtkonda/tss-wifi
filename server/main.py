from prechecks import init

init()

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from conf.settings import settings
from routes import tasks

# Use openapi_url=None for disabling the openapi spec
app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.mount("/site", StaticFiles(directory="site", html = True), name="site")

api_router = APIRouter()

api_router.include_router(tasks.router, prefix=settings.API_V1_STR, tags=["tasks"])

app.include_router(api_router)