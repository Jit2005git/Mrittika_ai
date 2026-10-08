from dotenv import load_dotenv
import os

load_dotenv()


APP_NAME = os.getenv(
    "APP_NAME",
    "Mrittika AI"
)

ENVIRONMENT = os.getenv(
    "ENVIRONMENT",
    "development"
)

API_VERSION = os.getenv(
    "API_VERSION",
    "v1"
)

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    ""
)


DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

ALLOWED_ORIGINS = list(dict.fromkeys(
    DEFAULT_ORIGINS + [
        url.strip()
        for url in FRONTEND_URL.split(",")
        if url.strip()
    ]
))