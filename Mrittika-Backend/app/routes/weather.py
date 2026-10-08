from fastapi import APIRouter, HTTPException
from app.services.weather import get_weather
from app.schemas.response import APIResponse
from app.utils.response import success_response
import httpx

from fastapi import APIRouter, Query, HTTPException
router = APIRouter(
    prefix="/weather",
    tags=["Weather"]
)

@router.get("/test-weather")
def test_weather():
    return {
        "message": "Weather route is working!"
    }

@router.get("/weather", response_model=APIResponse)
def weather(latitude: float, longitude: float):

    result = get_weather(
        latitude,
        longitude
    )

    if not result["success"]:

        raise HTTPException(
            status_code=503,
            detail=result["message"]
        )

    return success_response(
    "Weather data retrieved successfully",
    {
        "latitude": latitude,
        "longitude": longitude,
        "temperature": result["temperature"],
        "humidity": result["humidity"],
        "rainfall": result["rainfall"]
    }
)
@router.get("/current")
async def get_current_weather(
    latitude: float = Query(...),
    longitude: float = Query(...)
):
    

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "precipitation,"
            "rain,"
            "wind_speed_10m"
        ),
        "timezone": "auto"
    }

    try:

        async with httpx.AsyncClient() as client:

            response = await client.get(
                url,
                params=params,
                timeout=10
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail="Weather service unavailable"
            )

        weather_data = response.json()
        current = weather_data.get("current", {})
        return {
        "success": True,
        "message": "Weather data fetched successfully",
        "data": {
                "latitude": latitude,
                "longitude": longitude,
                "temperature": current.get("temperature_2m"),
                "humidity": current.get("relative_humidity_2m"),
                "rainfall": current.get("precipitation"),
                "rain": current.get("rain"),
                "wind_speed": current.get("wind_speed_10m")
    }
}

    except httpx.RequestError:

        raise HTTPException(
            status_code=502,
            detail="Unable to connect to weather service"
        )