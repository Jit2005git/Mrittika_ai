from pydantic import BaseModel, field_validator


class LanguageUpdate(BaseModel):
    language: str

    @field_validator("language")
    @classmethod
    def validate_language(cls, value):
        value = value.strip().lower()

        allowed_languages = [
            "en",   # English
            "bn",   # Bengali
            "hi",   # Hindi
            "or",   # Odia
            "mr",   # Marathi
            "ml"    # Malayalam
        ]

        if value not in allowed_languages:
            raise ValueError(
                "Unsupported language"
            )

        return value