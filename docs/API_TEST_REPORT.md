# Backend QA & API Test Report

**Project:** Mrittika AI  
**Branch:** `testing`  
**Role:** Teammate 2 (QA, API Testing, ML & Weather Validation)  
**Date:** October 8, 2026  
**Status:** In Progress (Baseline ML Health Check Verified)

---

## 1. Test Environment

| Parameter | Configuration | Details |
| :--- | :--- | :--- |
| **Framework** | FastAPI | ASGI Web Framework |
| **ASGI Server** | Uvicorn | `uvicorn main:app --reload --host 127.0.0.1 --port 8000` |
| **Local Base URL** | `http://127.0.0.1:8000` | Localhost testing instance |
| **Interactive Docs (Swagger UI)** | `http://127.0.0.1:8000/docs` | OpenAPI 3.0 specification |
| **Alternative Docs (ReDoc)** | `http://127.0.0.1:8000/redoc` | Redoc interface |
| **Environment Configuration** | Local Session (`$env:DATABASE_URL`) | SQLite fallback `qa_local.db` for zero backend code modification |

---

## 2. ML Health Check Verification (Confirmed Result)

The baseline test against the ML model serving layer was executed and verified against the live local server.

### Confirmed ML Health Result
* **`model_loaded`**: `true`
* **`scaler_loaded`**: `true`
* **`model_features`**: `7`
* **`scaler_features`**: `7`
* **`model_classes`**: `15`

```json
{
  "success": true,
  "message": "ML model health check successful",
  "data": {
    "model_loaded": true,
    "scaler_loaded": true,
    "model_features": 7,
    "scaler_features": 7,
    "model_classes": 15
  }
}
```

---

## 3. Test Cases & Execution Results

### 3.1 Model Health Check

* **Endpoint:** `/api/v1/health/model`
* **HTTP Method:** `GET`
* **Input / Test Data:** None (no query parameters or request body required)
* **Expected Result:**
  * HTTP status 200 OK
  * `success: true`
  * Trained ML Random Forest model loaded (`model_loaded: true`)
  * Feature scaler loaded (`scaler_loaded: true`)
  * Feature input counts matching model expectations (`model_features: 7`, `scaler_features: 7`)
  * Number of target crop classes loaded (`model_classes: 15`)
* **Actual Result:**
  ```json
  {
    "success": true,
    "message": "ML model health check successful",
    "data": {
      "model_loaded": true,
      "scaler_loaded": true,
      "model_features": 7,
      "scaler_features": 7,
      "model_classes": 15
    }
  }
  ```
* **HTTP Status:** `200 OK`
* **Status:** **PASS**

---

### 3.2 Crop Prediction

* **Endpoint:** `/api/v1/crop-predict`
* **HTTP Method:** `POST`
* **Input / Test Data:**
  ```json
  {
    "N": 90.0,
    "P": 42.0,
    "K": 43.0,
    "temperature": 20.87,
    "humidity": 82.00,
    "ph": 6.50,
    "rainfall": 202.93
  }
  ```
* **Expected Result:**
  * HTTP status 200 OK
  * Response returning recommended crop prediction with confidence score or class label
* **Actual Result:** *Execution pending.*
* **HTTP Status:** *N/A*
* **Status:** **NOT TESTED**

---

### 3.3 Smart Crop Prediction (Weather-Augmented)

* **Endpoint:** `/api/v1/smart-crop-predict`
* **HTTP Method:** `POST`
* **Input / Test Data:**
  ```json
  {
    "N": 90.0,
    "P": 42.0,
    "K": 43.0,
    "ph": 6.50,
    "latitude": 22.5726,
    "longitude": 88.3639
  }
  ```
* **Expected Result:**
  * HTTP status 200 OK
  * Weather fetched automatically for given coordinates and merged with soil parameters (N, P, K, pH) to produce prediction
* **Actual Result:** *Execution pending.*
* **HTTP Status:** *N/A*
* **Status:** **NOT TESTED**

---

### 3.4 Weather Endpoints

#### Test 3.4.1: Test Route
* **Endpoint:** `/api/v1/weather/test-weather`
* **HTTP Method:** `GET`
* **Input / Test Data:** None
* **Expected Result:**
  * HTTP status 200 OK
  * Response: `{"message": "Weather route is working!"}`
* **Actual Result:** *Execution pending.*
* **HTTP Status:** *N/A*
* **Status:** **NOT TESTED**

#### Test 3.4.2: Weather Service Retrieval
* **Endpoint:** `/api/v1/weather/weather`
* **HTTP Method:** `GET`
* **Input / Test Data:** `?latitude=22.5726&longitude=88.3639`
* **Expected Result:**
  * HTTP status 200 OK
  * Response containing temperature, humidity, rainfall
* **Actual Result:** *Execution pending.*
* **HTTP Status:** *N/A*
* **Status:** **NOT TESTED**

#### Test 3.4.3: Current Weather (Open-Meteo)
* **Endpoint:** `/api/v1/weather/current`
* **HTTP Method:** `GET`
* **Input / Test Data:** `?latitude=22.5726&longitude=88.3639`
* **Expected Result:**
  * HTTP status 200 OK
  * Response containing real-time temperature, relative humidity, precipitation, and wind speed
* **Actual Result:** *Execution pending.*
* **HTTP Status:** *N/A*
* **Status:** **NOT TESTED**

---

### 3.5 Authentication Endpoints

#### Test 3.5.1: Farmer Signup
* **Endpoint:** `/api/v1/auth/signup`
* **HTTP Method:** `POST`
* **Input / Test Data:**
  ```json
  {
    "name": "Ramesh Kumar",
    "email": "ramesh.kumar@example.com",
    "password": "Password123!",
    "language": "en"
  }
  ```
* **Expected Result:**
  * HTTP status 200 OK
  * Farmer record created, returning farmer ID, name, email, language (password hash omitted)
* **Actual Result:** *Execution pending.*
* **HTTP Status:** *N/A*
* **Status:** **NOT TESTED**

#### Test 3.5.2: Farmer Login
* **Endpoint:** `/api/v1/auth/login`
* **HTTP Method:** `POST`
* **Input / Test Data:**
  ```json
  {
    "email": "ramesh.kumar@example.com",
    "password": "Password123!"
  }
  ```
* **Expected Result:**
  * HTTP status 200 OK
  * Response returning JWT bearer `access_token` and farmer profile summary
* **Actual Result:** *Execution pending.*
* **HTTP Status:** *N/A*
* **Status:** **NOT TESTED**

#### Test 3.5.3: Farmer Profile (`/me`)
* **Endpoint:** `/api/v1/auth/me`
* **HTTP Method:** `GET`
* **Input / Test Data:** Header: `Authorization: Bearer <access_token>`
* **Expected Result:**
  * HTTP status 200 OK
  * Decoded farmer profile retrieved matching authenticated user
* **Actual Result:** *Execution pending.*
* **HTTP Status:** *N/A*
* **Status:** **NOT TESTED**

#### Test 3.5.4: Language Preference Update
* **Endpoint:** `/api/v1/auth/language`
* **HTTP Method:** `PATCH`
* **Input / Test Data:**
  * Header: `Authorization: Bearer <access_token>`
  * Body: `{"language": "hi"}`
* **Expected Result:**
  * HTTP status 200 OK
  * Updated farmer language preference returned
* **Actual Result:** *Execution pending.*
* **HTTP Status:** *N/A*
* **Status:** **NOT TESTED**

---

## 4. Final Summary

| Metric | Count | Details |
| :--- | :--- | :--- |
| **Passed** | 1 | `GET /api/v1/health/model` verified with 200 OK and valid ML artifacts |
| **Failed** | 0 | No active failures in tested endpoints |
| **Not Tested** | 9 | Crop Predict, Smart Crop Predict, 3 Weather routes, 4 Auth routes |
| **Total Test Cases** | 10 | Complete API route surface |

### Bugs & Issues Found During QA Audit

1. **Missing Default Database Configuration & Schema Migration:**
   * **Issue:** Application crashed immediately on start if `DATABASE_URL` environment variable was not explicitly set in the OS environment, because `.env` was missing and `app/database.py` expects a valid connection string.
   * **Impact:** Requires environment variables and table generation before authentication routes can execute.
   * **QA Workaround:** Configured local SQLite path in local test runner without altering code.

2. **Redundant Route Path in Weather Module:**
   * **Issue:** Route in `app/routes/weather.py` is declared with prefix `/weather` and included under `/api/v1`, creating `/api/v1/weather/weather`.
   * **Impact:** Non-standard route naming compared to `/api/v1/weather/current`.

3. **External Network Reliance for Smart Prediction & Weather:**
   * **Issue:** `POST /api/v1/smart-crop-predict` and `GET /api/v1/weather/current` depend synchronously on external HTTP requests to Open-Meteo. If the third-party API is unreachable or rate-limited, requests return 502/503.
   * **Impact:** Robust mock fixtures or fallback data are recommended for offline and resilient testing.

4. **Default Secret Key in Security Utilities:**
   * **Issue:** `JWT_SECRET_KEY` in `app/config.py` defaults to `"mrittika_secret_key_12345"` if not provided via environment.
   * **Impact:** High security vulnerability if deployed without mandatory environment enforcement.
