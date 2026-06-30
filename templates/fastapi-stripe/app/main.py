"""{{PROJECT_NAME}} - Main application"""
from fastapi import FastAPI, Depends
from pydantic import BaseModel

app = FastAPI(title="{{PROJECT_NAME}}", version="1.0.0")

class HealthResponse(BaseModel):
    status: str
    version: str
    service: str

@app.get("/", response_model=HealthResponse)
def home():
    return HealthResponse(status="ok", version="1.0.0", service="{{PROJECT_NAME}}")

@app.get("/api/v1/health")
def health():
    return {"status": "healthy"}
