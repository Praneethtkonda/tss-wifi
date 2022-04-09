from pydantic import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "TSS Wifi"


settings = Settings()