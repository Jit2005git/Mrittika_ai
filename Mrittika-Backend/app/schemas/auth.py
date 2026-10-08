from pydantic import BaseModel, EmailStr, field_validator


class FarmerSignup(BaseModel):

    name: str
    email: EmailStr
    password: str
    language: str = "en"

    @field_validator("name")
    @classmethod
    def validate_name(cls, value):

        value = value.strip()

        if len(value) < 2:
            raise ValueError(
                "Name must contain at least 2 characters"
            )

        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):

        if len(value) < 6:
            raise ValueError(
                "Password must contain at least 6 characters"
            )

        return value


class FarmerLogin(BaseModel):

    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):

        if len(value) < 6:
            raise ValueError(
                "Password must contain at least 6 characters"
            )

        return value