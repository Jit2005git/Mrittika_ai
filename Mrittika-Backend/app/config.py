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


ALLOWED_ORIGINS = [
    url.strip()
    for url in FRONTEND_URL.split(",")
    if url.strip()
]