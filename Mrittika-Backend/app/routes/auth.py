from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.farmer import Farmer

from app.schemas.auth import (
    FarmerSignup,
    FarmerLogin
)
from app.schemas.language import LanguageUpdate

from app.utils.response import success_response
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_farmer_id
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(
    data: FarmerSignup,
    db: Session = Depends(get_db)
):

    existing_farmer = (
        db.query(Farmer)
        .filter(Farmer.email == data.email)
        .first()
    )

    if existing_farmer:
        return {
            "success": False,
            "message": "Email already registered",
            "data": None
        }

    password_hash = hash_password(
        data.password
    )

    farmer = Farmer(
        name=data.name,
        email=data.email,
        password_hash=password_hash,
        language=data.language
    )

    db.add(farmer)
    db.commit()
    db.refresh(farmer)

    return success_response(
        "Farmer signup successful",
        {
            "id": farmer.id,
            "name": farmer.name,
            "email": farmer.email,
            "language": farmer.language
        }
    )


@router.post("/login")
def login(
    data: FarmerLogin,
    db: Session = Depends(get_db)
):

    farmer = (
        db.query(Farmer)
        .filter(Farmer.email == data.email)
        .first()
    )

    if not farmer:
        return {
            "success": False,
            "message": "Invalid email or password",
            "data": None
        }

    password_correct = verify_password(
        data.password,
        farmer.password_hash
    )

    if not password_correct:
        return {
            "success": False,
            "message": "Invalid email or password",
            "data": None
        }

    access_token = create_access_token(
    {
        "sub": str(farmer.id)
    }
)

    return success_response(
         "Login successful",
    {
        "access_token": access_token,
        "token_type": "bearer",
        "farmer": {
            "id": farmer.id,
            "name": farmer.name,
            "email": farmer.email,
            "language": farmer.language
        }
    }
)
@router.get("/me")
def get_my_profile(
    farmer_id: int = Depends(get_current_farmer_id),
    db: Session = Depends(get_db)
):

    farmer = (
        db.query(Farmer)
        .filter(Farmer.id == farmer_id)
        .first()
    )

    if not farmer:
        return {
            "success": False,
            "message": "Farmer not found",
            "data": None
        }

    return success_response(
        "Farmer profile retrieved successfully",
        {
            "id": farmer.id,
            "name": farmer.name,
            "email": farmer.email,
            "language": farmer.language
        }
    )
@router.patch("/language")
def update_language(
    data: LanguageUpdate,
    farmer_id: int = Depends(get_current_farmer_id),
    db: Session = Depends(get_db)
):

    farmer = (
        db.query(Farmer)
        .filter(Farmer.id == farmer_id)
        .first()
    )

    if not farmer:
        return {
            "success": False,
            "message": "Farmer not found",
            "data": None
        }

    farmer.language = data.language

    db.commit()
    db.refresh(farmer)

    return success_response(
        "Language updated successfully",
        {
            "id": farmer.id,
            "language": farmer.language
        }
    )