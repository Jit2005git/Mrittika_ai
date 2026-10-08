import requests


def get_weather(latitude, longitude):

    weather_url = "https://api.open-meteo.com/v1/forecast"

    weather_params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m",
        "daily": "precipitation_sum",
        "forecast_days": 1,
        "timezone": "auto"
    }

    try:

        weather_response = requests.get(
            weather_url,
            params=weather_params,
            timeout=10
        )

        weather_response.raise_for_status()

        weather_data = weather_response.json()

    except requests.exceptions.RequestException:

        return {
            "success": False,
            "message": "Weather service is currently unavailable. Please try again."
        }

    try:

        temperature = weather_data["current"]["temperature_2m"]
        humidity = weather_data["current"]["relative_humidity_2m"]
        rainfall = weather_data["daily"]["precipitation_sum"][0]

    except (KeyError, TypeError, IndexError):

        return {
            "success": False,
            "message": "Weather data received is incomplete. Please try again."
        }

    return {
        "success": True,
        "temperature": temperature,
        "humidity": humidity,
        "rainfall": rainfall
    }