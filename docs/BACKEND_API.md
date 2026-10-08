# Mrittika AI Backend API Documentation & Frontend Integration Contract

**Version:** `v1`  
**Base URL (Local):** `http://127.0.0.1:8000`  
**API Prefix:** `/api/v1`  
**Documentation (Swagger UI):** `http://127.0.0.1:8000/docs`  
**Interactive ReDoc:** `http://127.0.0.1:8000/redoc`  

---

## 1. System & Global Conventions

### 1.1 Standard Response Format
All JSON responses (success and managed error) adhere to the standard envelope schema:

```json
{
  "success": true,
  "message": "Human-readable status message",
  "data": { ... }
}
```

- When `success` is `true`, `data` contains the payload.
- When `success` is `false`, `data` is typically `null` or contains error context.

### 1.2 Authentication Header
For protected endpoints (`/api/v1/auth/me`, `/api/v1/auth/language`), send the JWT Bearer token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

### 1.3 CORS Notice for Frontend
Backend uses `CORSMiddleware`. Allowed origins are loaded from `FRONTEND_URL` in `.env`.
- Ensure your frontend development origin (e.g., `http://localhost:5173` for Vite, `http://localhost:3000` for React/Next, or `http://localhost:5500` for Live Server) is included in `FRONTEND_URL`.

---

## 2. API Endpoints Summary

| Method | Endpoint | Auth Required | Status | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/` | No | Working | Backend welcome ping |
| `GET` | `/health` | No | Working | Overall backend & ML model health |
| `GET` | `/api-info` | No | Working | App name, version, and environment |
| `GET` | `/api/v1/health/model` | No | Working | Machine learning model & scaler status |
| `POST` | `/api/v1/crop-predict` | No | Working | Manual crop recommendation (7 parameters) |
| `POST` | `/api/v1/smart-crop-predict` | No | Working | **Core MVP Endpoint**: GPS + Soil inputs with auto weather |
| `GET` | `/api/v1/weather/test-weather` | No | Working | Weather router health test |
| `GET` | `/api/v1/weather/weather` | No | Working | Fetch temperature, humidity, rainfall (sync) |
| `GET` | `/api/v1/weather/current` | No | Working | Fetch live weather including wind speed & rain (async) |
| `POST` | `/api/v1/auth/signup` | No | Blocked | Register farmer (Requires DB & bcrypt fix) |
| `POST` | `/api/v1/auth/login` | No | Blocked | Farmer login, returns JWT token |
| `GET` | `/api/v1/auth/me` | Yes (Bearer) | Blocked | Get logged-in farmer profile |
| `PATCH` | `/api/v1/auth/language` | Yes (Bearer) | Blocked | Update user preferred language |

---

## 3. Core Working Endpoints (Frontend MVP Priority)

### 3.1 Smart Crop Recommendation (Primary Feature)
Automates weather fetching using farmer's GPS latitude and longitude, combines with soil N-P-K and pH, and invokes the ML recommendation model.

- **Method:** `POST`
- **URL:** `/api/v1/smart-crop-predict`
- **Headers:** `Content-Type: application/json`

#### Request Body
```json
{
  "N": 90.0,
  "P": 42.0,
  "K": 43.0,
  "ph": 6.5,
  "latitude": 22.5726,
  "longitude": 88.3639
}
```

#### Field Constraints
- `N`, `P`, `K`: `float` (`0` to `1000`)
- `ph`: `float` (`0.0` to `14.0`)
- `latitude`: `float` (`-90.0` to `90.0`)
- `longitude`: `float` (`-180.0` to `180.0`)

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "message": "Smart crop prediction successful",
  "data": {
    "latitude": 22.5726,
    "longitude": 88.3639,
    "weather": {
      "temperature": 32.5,
      "humidity": 58,
      "rainfall": 5.4
    },
    "soil": {
      "N": 90.0,
      "P": 42.0,
      "K": 43.0,
      "pH": 6.5
    },
    "prediction": {
      "recommended_crop": "rice",
      "top_3": [
        {
          "crop": "rice",
          "probability": 0.4000
        },
        {
          "crop": "maize",
          "probability": 0.2300
        },
        {
          "crop": "coffee",
          "probability": 0.2000
        }
      ]
    }
  }
}
```

---

### 3.2 Manual Crop Recommendation
Used if the user wants to supply their own weather metrics manually.

- **Method:** `POST`
- **URL:** `/api/v1/crop-predict`
- **Headers:** `Content-Type: application/json`

#### Request Body
```json
{
  "N": 90.0,
  "P": 42.0,
  "K": 43.0,
  "temperature": 25.5,
  "humidity": 80.0,
  "ph": 6.5,
  "rainfall": 200.0
}
```

#### Field Constraints
- `N`, `P`, `K`: `float` (>= 0)
- `temperature`: `float` (`-50.0` to `60.0`)
- `humidity`: `float` (`0.0` to `100.0`)
- `ph`: `float` (`0.0` to `14.0`)
- `rainfall`: `float` (>= 0)

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "message": "Crop prediction successful",
  "data": {
    "recommended_crop": "rice",
    "top_3": [
      {
        "crop": "rice",
        "probability": 1.0
      },
      {
        "crop": "watermelon",
        "probability": 0.0
      },
      {
        "crop": "peas",
        "probability": 0.0
      }
    ]
  }
}
```

---

### 3.3 Live Weather Fetch
Used for dashboard weather widgets or location previews.

- **Method:** `GET`
- **URL:** `/api/v1/weather/current?latitude={lat}&longitude={lon}`
- **Query Parameters:**
  - `latitude` (float, required)
  - `longitude` (float, required)

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "message": "Weather data fetched successfully",
  "data": {
    "latitude": 22.5726,
    "longitude": 88.3639,
    "temperature": 32.5,
    "humidity": 58,
    "rainfall": 0.0,
    "rain": 0.0,
    "wind_speed": 6.7
  }
}
```

---

### 3.4 Health Check & System Status
Used by frontend to verify backend connectivity before form submissions.

- **Method:** `GET`
- **URL:** `/health`

#### Response Body (`200 OK`)
```json
{
  "success": true,
  "message": "Mrittika AI Backend is healthy",
  "data": {
    "service": "Mrittika AI",
    "environment": "development",
    "ml_model": {
      "model_loaded": true,
      "scaler_loaded": true,
      "model_features": 7,
      "scaler_features": 7,
      "model_classes": 15
    }
  }
}
```

---

## 4. Authentication Endpoints (Pending Fixes)

> [!WARNING]
> Auth endpoints require an active PostgreSQL connection and a bcrypt fix (`bcrypt<4.1.0` or custom hash patch) before frontend usage. For MVP flow, guest / direct recommendation mode is fully operational.

### 4.1 Farmer Signup
- **Method:** `POST`
- **URL:** `/api/v1/auth/signup`
- **Body:**
```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "password": "securepassword123",
  "language": "en"
}
```
- **Languages supported:** `"en"`, `"bn"`, `"hi"`, `"or"`, `"mr"`, `"ml"`

### 4.2 Farmer Login
- **Method:** `POST`
- **URL:** `/api/v1/auth/login`
- **Body:**
```json
{
  "email": "ramesh@example.com",
  "password": "securepassword123"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "farmer": {
      "id": 1,
      "name": "Ramesh Kumar",
      "email": "ramesh@example.com",
      "language": "en"
    }
  }
}
```

### 4.3 Farmer Profile
- **Method:** `GET`
- **URL:** `/api/v1/auth/me`
- **Header:** `Authorization: Bearer <token>`

### 4.4 Update Language Preference
- **Method:** `PATCH`
- **URL:** `/api/v1/auth/language`
- **Header:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "language": "bn"
}
```

---

## 5. Frontend Error Handling Guidelines

1. **Validation Errors (`422 Unprocessable Entity`):**
   FastAPI returns detailed validation errors if parameters fall outside ranges:
   ```json
   {
     "detail": [
       {
         "loc": ["body", "ph"],
         "msg": "Value error, pH must be between 0 and 14",
         "type": "value_error"
       }
     ]
   }
   ```
2. **Third-Party Weather Service Outage (`502 / 503`):**
   If Open-Meteo is unreachable or returns invalid data:
   ```json
   {
     "detail": "Weather service is currently unavailable. Please try again."
   }
   ```
   *Frontend Action:* Prompt the farmer to retry or fallback to `/api/v1/crop-predict` for manual temperature/rainfall input.

---

## 6. How to Run for Frontend Integration

### Backend Execution
From directory: `Mrittika-Backend/Mrittika-Backend`
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
API will be live at `http://127.0.0.1:8000`.
Test with Swagger UI at `http://127.0.0.1:8000/docs`.
