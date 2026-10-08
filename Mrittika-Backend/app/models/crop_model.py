from pathlib import Path
import joblib


# --------------------------------
# FIND PROJECT ROOT
# --------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]


# --------------------------------
# MODEL PATHS
# --------------------------------

MODEL_PATH = BASE_DIR / "ml_models" / "crop_model.pkl"
SCALER_PATH = BASE_DIR / "ml_models" / "scaler.pkl"


# --------------------------------
# LOAD ML MODEL
# --------------------------------

model = joblib.load(MODEL_PATH)


# --------------------------------
# LOAD SCALER
# --------------------------------

scaler = joblib.load(SCALER_PATH)


# --------------------------------
# CROP PREDICTION
# --------------------------------

def predict_crop(input_data):
    scaled_data = scaler.transform(input_data)

    prediction = model.predict(scaled_data)[0]

    probabilities = model.predict_proba(scaled_data)[0]

    top3_indices = probabilities.argsort()[-3:][::-1]

    top3 = []

    for index in top3_indices:

        top3.append({
            "crop": model.classes_[index],
            "probability": round(
                float(probabilities[index]),
                4
            )
        })

    return {
        "recommended_crop": prediction,
        "top_3": top3
    }

def model_health():

    model_loaded = model is not None
    scaler_loaded = scaler is not None

    model_features = getattr(
        model,
        "n_features_in_",
        None
    )

    scaler_features = getattr(
        scaler,
        "n_features_in_",
        None
    )

    return {
        "model_loaded": model_loaded,
        "scaler_loaded": scaler_loaded,
        "model_features": model_features,
        "scaler_features": scaler_features,
        "model_classes": len(model.classes_)
    }