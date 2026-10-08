from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import crop, weather, auth
from app.schemas.response import APIResponse
from app.models.crop_model import model_health
from app.config import (
    APP_NAME,
    ENVIRONMENT,
    API_VERSION,
    ALLOWED_ORIGINS,
)
from app.database import engine, Base
from app.models.farmer import Farmer

# Ensure tables are created
Base.metadata.create_all(bind=engine)


# =========================================================
# CREATE FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title=APP_NAME,
    description="Backend API for Mrittika AI agriculture platform",
    version=API_VERSION
)


# =========================================================
# CONNECT API ROUTES
# =========================================================

app.include_router(
    crop.router,
    prefix=f"/api/{API_VERSION}"
)

app.include_router(
    weather.router,
    prefix=f"/api/{API_VERSION}"
)
app.include_router(
    auth.router,
    prefix=f"/api/{API_VERSION}"
)

# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
def home():

    return {
        "success": True,
        "message": "Welcome to Mrittika AI Backend"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get(
    "/health",
    response_model=APIResponse
)
def health():

    ml_status = model_health()

    is_healthy = (
        ml_status["model_loaded"]
        and ml_status["scaler_loaded"]
        and ml_status["model_features"] == 7
        and ml_status["scaler_features"] == 7
    )

    return {
        "success": is_healthy,
        "message": (
            "Mrittika AI Backend is healthy"
            if is_healthy
            else "Mrittika AI Backend has a configuration problem"
        ),
        "data": {
            "service": APP_NAME,
            "environment": ENVIRONMENT,
            "ml_model": ml_status
        }
    }


# =========================================================
# API INFORMATION
# =========================================================

@app.get("/api-info")
def api_info():

    return {
        "success": True,
        "name": APP_NAME,
        "version": API_VERSION,
        "environment": ENVIRONMENT,
        "description": (
            "Backend API for Mrittika AI agriculture platform"
        )
    }