# 🌱 Mrittika AI

> **From Soil & Weather Data to Smarter Crop Decisions**

Mrittika AI is an AI-powered agricultural decision-support platform designed to help farmers and agricultural users make better crop decisions using **soil parameters, geographic location, live weather information, machine learning, and conversational AI**. Instead of presenting agricultural information through separate tools, Mrittika brings these technologies together into one platform that follows a simple approach: **Data → Decision → Explanation**.

## 🎯 Problem Statement

Farmers often have access to agricultural information, but that information is distributed across different sources. Soil information may come from one source, weather information from another, crop recommendations from another, and agricultural advice may require expert consultation. The challenge is to combine these different types of information into a **simple, actionable, and understandable agricultural decision-support system**.

> **How can soil, weather, location, and machine-learning insights be combined to help users make smarter agricultural decisions?**

## 💡 Our Solution

Mrittika combines **🌱 Soil Data + 🌦️ Weather Data + 📍 Location Data + 🧠 Machine Learning + 🤖 Generative AI** into a single agricultural platform.

The basic workflow is:

```text
Soil + Location + Weather

The platform collects important agricultural and environmental information, processes it using machine learning, generates crop recommendations, and provides an AI agricultural assistant for further guidance and explanation.
🚀 Key Features
🔐 User Authentication
Mrittika provides secure user authentication with user registration, user login, JWT-based authentication, current-user information, and language preference support.
🌱 Crop Prediction
Users can provide important agricultural parameters such as Nitrogen (N), Phosphorus (P), Potassium (K), temperature, humidity, soil pH, and rainfall. The machine-learning model processes these parameters and predicts suitable crops.
🧠 Smart Crop Prediction
The Smart Crop Prediction system combines soil parameters, geographic location, and live weather information before generating a crop recommendation.
Soil Parameters
       +
Geographic Location
       +
Live Weather
       ↓
Machine Learning
       ↓
Crop Recommendation

For example, the system may generate a ranked recommendation such as:
Rice       → 40%
Maize      → 23%
Coffee     → 20%

The actual recommendation depends on the supplied input data and trained model.
🌦️ Weather Integration
Mrittika can retrieve weather information based on geographic location. Weather information may include temperature, humidity, rainfall, and weather conditions. This information can be used alongside soil information to improve agricultural decision support.
📍 Location Support
The Smart Crop Prediction API supports latitude and longitude, allowing the system to associate environmental and weather information with the user's geographic location.
🤖 AI Agricultural Assistant
Mrittika includes an AI-powered agricultural assistant built using an n8n workflow. The workflow can include Gemini, AI Agent, Conversation Memory, Embeddings, Vector Store, and agricultural knowledge.
Users can ask questions such as:
- Which crop is suitable for this soil?
- Why is nitrogen important?
- How does rainfall affect crops?
- What is the ideal pH for rice?
- Why did you recommend this crop?
🌐 Language Support
The backend supports storing a user's language preference, providing a foundation for future multilingual agricultural assistance.
⭐ What Makes Mrittika Different?
Mrittika is not simply an agricultural dashboard. The main concept is:
DATA
 ↓
DECISION
 ↓
EXPLANATION

A traditional dashboard may show:
Temperature: 30°C
Humidity: 63%
Rainfall: 7.9mm
N: 90
P: 42
K: 43

Mrittika attempts to transform this information into:
Recommended Crop
       ↓
     Why?
       ↓
AI Explanation
            ↓
     Machine Learning
            ↓
     Crop Recommendation
            ↓
       AI Explanation
