from app.models.crop_model import predict_crop
from app.services.weather import get_weather


def smart_crop_prediction(
    N,
    P,
    K,
    ph,
    latitude,
    longitude
):

    # --------------------------------
    # STEP 1: Get weather
    # --------------------------------

    weather = get_weather(
        latitude,
        longitude
    )

    # --------------------------------
    # STEP 2: Check weather response
    # --------------------------------

    if not weather["success"]:

        return {
            "success": False,
            "message": weather["message"]
        }

    # --------------------------------
    # STEP 3: Extract weather values
    # --------------------------------

    temperature = weather["temperature"]
    humidity = weather["humidity"]
    rainfall = weather["rainfall"]

    # --------------------------------
    # STEP 4: Create 7 ML inputs
    # --------------------------------

    input_data = [[
        N,
        P,
        K,
        temperature,
        humidity,
        ph,
        rainfall
    ]]

    # --------------------------------
    # STEP 5: Get ML prediction
    # --------------------------------

    prediction = predict_crop(input_data)

    # --------------------------------
    # STEP 6: Return result
    # --------------------------------

    return {
    "latitude": latitude,
    "longitude": longitude,

    "weather": {
        "temperature": temperature,
        "humidity": humidity,
        "rainfall": rainfall
    },

    "soil": {
        "N": N,
        "P": P,
        "K": K,
        "pH": ph
    },

    "prediction": prediction
}