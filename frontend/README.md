# Mrittika — Agricultural Intelligence Platform (Frontend)

Modern, responsive React frontend dashboard for **Mrittika**, built with Vite, Tailwind CSS, React Router, Axios, and Lucide React.

## 🌐 1. Multi-Language Support (i18n)

Native Unicode translations across all user-facing screens and components:
1. **English (`en`)** — Default
2. **বাংলা — Bengali (`bn`)**
3. **ଓଡ଼ିଆ — Odia (`or`)**
4. **हिन्दी — Hindi (`hi`)**
5. **తెలుగు — Telugu (`te`)**
6. **मराठी — Marathi (`mr`)**

- Accessible language selector available on both desktop & mobile navigation headers.
- Selection persists in `localStorage` across refreshes and updates the UI immediately without reload.
- Centralized translation dictionary: `src/i18n/translations.js` & `src/i18n/LanguageContext.jsx`.

## 📱 2. Mobile Responsive Design

Optimized for viewports from **320px, 375px, 390px, 414px, 768px** to large desktop displays:
- **Navbar**: Desktop navigation bar + Mobile touch-friendly hamburger drawer with language selector.
- **Sidebar**: Full collapsible drawer on mobile with backdrop overlay and keyboard `Esc` dismiss.
- **Dashboard**: Flexible stacking cards, horizontal scrollable tables, and touch-friendly actions.
- **Crop Prediction**: 1-column responsive input grids on mobile with touch-friendly presets.
- **Zero Horizontal Overflow**: Built with responsive utility classes and overflow safeguards.

## 🤖 3. Mrittika AI Agricultural Assistant

- **Persona**: Friendly AI farming assistant (`src/components/MrittikaAI.jsx` & `src/components/MrittikaAIGreeting.jsx`).
- **Dashboard Greeting**: Welcomes farmers and provides data-backed insights on soil health, microclimate telemetry, crop suitability, and immediate next actions.
- **Conversational Prediction Flow**:
  - `Input → Mrittika analyzes → explains → recommends → suggests next action`
  - Includes: Recommended Crop, Confidence, "Why this crop?", "Important Soil Factors", "Weather Considerations", and "Suggested Next Steps".
  - Transparent "Demo Mode" vs "Live Backend" indicators.
  - Multi-lingual reasoning translated natively into all 6 languages.

## 🚀 Routes

- `/`: Landing page
- `/login`: Farmer sign-in with prefilled demo credentials
- `/signup`: Farmer registration
- `/dashboard`: Agricultural overview, live weather telemetry, soil health, advisories
- `/crop-prediction`: 7-parameter NPK/pH/climate prediction engine with Mrittika AI
- `/weather`: Regional microclimate telemetry & 7-day forecast
- `/profile`: Farmer farm holdings, soil type, language settings, and sign-out

## 📦 How to Run

```bash
cd frontend
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
