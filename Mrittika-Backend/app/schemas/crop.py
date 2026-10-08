from pydantic import BaseModel, field_validator


# =========================================================
# NORMAL CROP PREDICTION
# =========================================================

class CropData(BaseModel):

    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

    # -----------------------------------------
    # Validate N, P, K
    # -----------------------------------------

    @field_validator("N", "P", "K")
    @classmethod
    def validate_npk(cls, value):

        if value < 0:
            raise ValueError(
                "N, P and K cannot be negative"
            )

        return value

    # -----------------------------------------
    # Validate pH
    # -----------------------------------------

    @field_validator("ph")
    @classmethod
    def validate_ph(cls, value):

        if value < 0 or value > 14:
            raise ValueError(
                "pH must be between 0 and 14"
            )

        return value

    # -----------------------------------------
    # Validate temperature
    # -----------------------------------------

    @field_validator("temperature")
    @classmethod
    def validate_temperature(cls, value):

        if value < -50 or value > 60:
            raise ValueError(
                "Temperature must be between -50 and 60°C"
            )

        return value

    # -----------------------------------------
    # Validate humidity
    # -----------------------------------------

    @field_validator("humidity")
    @classmethod
    def validate_humidity(cls, value):

        if value < 0 or value > 100:
            raise ValueError(
                "Humidity must be between 0 and 100%"
            )

        return value

    # -----------------------------------------
    # Validate rainfall
    # -----------------------------------------

    @field_validator("rainfall")
    @classmethod
    def validate_rainfall(cls, value):

        if value < 0:
            raise ValueError(
                "Rainfall cannot be negative"
            )

        return value


# =========================================================
# SMART CROP PREDICTION
# =========================================================

class SmartCropData(BaseModel):

    N: float
    P: float
    K: float
    ph: float
    latitude: float
    longitude: float

    # -----------------------------------------
    # Validate N, P, K
    # -----------------------------------------

    @field_validator("N", "P", "K")
    @classmethod
    def validate_npk(cls, value):

      if value < 0:
        raise ValueError(
            "N, P and K cannot be negative"
        )

      if value > 1000:
        raise ValueError(
            "N, P and K must be 1000 or less"
        )

      return value

    # -----------------------------------------
    # Validate pH
    # -----------------------------------------

    @field_validator("ph")
    @classmethod
    def validate_ph(cls, value):

        if value < 0 or value > 14:
            raise ValueError(
                "pH must be between 0 and 14"
            )

        return value

    # -----------------------------------------
    # Validate latitude
    # -----------------------------------------

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, value):

        if value < -90 or value > 90:
            raise ValueError(
                "Latitude must be between -90 and 90"
            )

        return value

    # -----------------------------------------
    # Validate longitude
    # -----------------------------------------

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, value):

        if value < -180 or value > 180:
            raise ValueError(
                "Longitude must be between -180 and 180"
            )

        return value