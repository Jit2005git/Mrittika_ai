from fastapi import APIRouter, HTTPException

from app.models.crop_model import (
    predict_crop,
    model_health
)

from app.schemas.crop import (
    CropData,
    SmartCropData
)

from app.schemas.response import APIResponse

from app.services.prediction import (
    smart_crop_prediction
)

from app.utils.response import (
    success_response
)


router = APIRouter(
    tags=["Crop"]
)

@router.post(
    "/crop-predict",
    response_model=APIResponse
)
def crop_predict(data: CropData):

    input_data = [[
        data.N,
        data.P,
        data.K,
        data.temperature,
        data.humidity,
        data.ph,
        data.rainfall
    ]]

    result = predict_crop(input_data)

    return success_response(
    message="Crop prediction successful",
    data=result
)


# =========================================================
# SMART CROP PREDICTION
# =========================================================

@router.post(
    "/smart-crop-predict",
    response_model=APIResponse
)
def smart_crop_predict(data: SmartCropData):

    result = smart_crop_prediction(
        N=data.N,
        P=data.P,
        K=data.K,
        ph=data.ph,
        latitude=data.latitude,
        longitude=data.longitude
    )

    if (
        "success" in result
        and result["success"] is False
    ):

        raise HTTPException(
            status_code=503,
            detail=result["message"]
        )

    return success_response(
        "Smart crop prediction successful",
        result
    )


@router.get("/health/model")
def health_model():

    return success_response(
        "ML model health check successful",
        model_health()
    )