// Realistic agricultural mock datasets for Mrittika AI

export const MOCK_WEATHER = {
  location: "Kolkata, West Bengal (Gangetic Plain)",
  latitude: 22.5726,
  longitude: 88.3639,
  temperature: 28.4,
  feelsLike: 31.0,
  humidity: 78,
  rainfall: 12.5,
  condition: "Partly Cloudy",
  conditionCode: "cloudy",
  windSpeed: 14.2,
  soilMoisture: "Optimal (42%)",
  uvIndex: 6,
  summary: "Favorable conditions for vegetative growth. Moderate humidity with scattered rain showers expected in late afternoon.",
  forecast: [
    { day: "Today", temp: 28, condition: "Partly Cloudy", rainProb: "40%", icon: "cloud-sun" },
    { day: "Tomorrow", temp: 29, condition: "Light Rain", rainProb: "75%", icon: "cloud-rain" },
    { day: "Wednesday", temp: 27, condition: "Thunderstorms", rainProb: "85%", icon: "cloud-lightning" },
    { day: "Thursday", temp: 30, condition: "Sunny", rainProb: "15%", icon: "sun" },
    { day: "Friday", temp: 31, condition: "Clear Sky", rainProb: "10%", icon: "sun" },
    { day: "Saturday", temp: 29, condition: "Scattered Showers", rainProb: "50%", icon: "cloud-rain" },
    { day: "Sunday", temp: 28, condition: "Partly Cloudy", rainProb: "30%", icon: "cloud-sun" },
  ]
};

export const MOCK_SOIL_DATA = {
  texture: "Clay Loam",
  organicCarbon: "0.78% (Healthy)",
  nitrogenStatus: "Medium (85 kg/ha)",
  phosphorusStatus: "Adequate (42 kg/ha)",
  potassiumStatus: "High (210 kg/ha)",
  pHLevel: 6.8,
  pHClassification: "Neutral / Optimal",
  electricalConductivity: "0.35 dS/m (Normal)"
};

export const MOCK_ALERTS = [
  {
    id: 1,
    type: "warning",
    title: "Rainfall Advisory",
    message: "Precipitation expected in 24 hours. Postpone urea top-dressing to prevent leaching.",
    time: "2 hours ago"
  },
  {
    id: 2,
    type: "info",
    title: "Irrigation Schedule",
    message: "Soil moisture is currently at 42%. Next optimal irrigation cycle scheduled for Thursday.",
    time: "5 hours ago"
  },
  {
    id: 3,
    type: "success",
    title: "Soil Health Index",
    message: "Recent soil health test shows optimal pH of 6.8 with adequate micro-nutrient availability.",
    time: "1 day ago"
  }
];

export const MOCK_RECENT_PREDICTIONS = [
  {
    id: "pred-101",
    date: "2026-10-06",
    crop: "Rice (Paddy)",
    confidence: "94.8%",
    suitability: "High",
    params: { N: 90, P: 42, K: 43, temp: 26.5, humidity: 82, ph: 6.5, rainfall: 202 }
  },
  {
    id: "pred-102",
    date: "2026-09-28",
    crop: "Jute",
    confidence: "91.2%",
    suitability: "High",
    params: { N: 78, P: 39, K: 40, temp: 25.1, humidity: 79, ph: 6.7, rainfall: 175 }
  },
  {
    id: "pred-103",
    date: "2026-09-15",
    crop: "Maize",
    confidence: "88.5%",
    suitability: "Moderate",
    params: { N: 65, P: 45, K: 35, temp: 24.0, humidity: 65, ph: 6.2, rainfall: 95 }
  }
];

export const CROP_DETAILS = {
  rice: {
    name: "Rice (Paddy)",
    scientificName: "Oryza sativa",
    category: "Cereal / Kharif Staple",
    idealConditions: "High humidity (80%+), heavy rainfall (150-300mm), clayey loam soil, temperature 22-32°C.",
    growingPeriod: "110 - 150 days",
    waterRequirement: "High (Flooded / Submerged)",
    estimatedYield: "4.2 - 5.5 tonnes / hectare",
    tips: [
      "Maintain 2-5 cm standing water during tillering phase.",
      "Apply nitrogen in 3 split doses: basal, active tillering, and panicle initiation.",
      "Monitor for bacterial leaf blight and stem borers during high humidity."
    ]
  },
  maize: {
    name: "Maize (Corn)",
    scientificName: "Zea mays",
    category: "Cereal / Grain",
    idealConditions: "Warm weather (20-30°C), well-drained fertile loam, moderate rainfall (60-110mm).",
    growingPeriod: "90 - 120 days",
    waterRequirement: "Moderate",
    estimatedYield: "5.0 - 6.8 tonnes / hectare",
    tips: [
      "Avoid waterlogging as roots are sensitive to poor drainage.",
      "Critical moisture periods are tasseling and silking stages.",
      "Apply phosphorus and potassium close to planting for root establishment."
    ]
  },
  jute: {
    name: "Jute",
    scientificName: "Corchorus olitorius",
    category: "Commercial Cash Crop / Fiber",
    idealConditions: "Warm humid climate (24-35°C), rainfall >150mm, alluvial soil with pH 6.0-7.5.",
    growingPeriod: "120 - 140 days",
    waterRequirement: "High",
    estimatedYield: "2.5 - 3.2 tonnes dry fiber / hectare",
    tips: [
      "Needs retting water nearby for processing post-harvest.",
      "Sow during early monsoon to leverage initial rainfall.",
      "Ensure proper weeding in the initial 4-6 weeks."
    ]
  },
  cotton: {
    name: "Cotton",
    scientificName: "Gossypium hirsutum",
    category: "Fiber / Commercial",
    idealConditions: "Warm climate (21-30°C), deep black soil (regur) or alluvial, rainfall 50-100mm.",
    growingPeriod: "150 - 180 days",
    waterRequirement: "Moderate",
    estimatedYield: "1.8 - 2.4 tonnes / hectare",
    tips: [
      "Requires plenty of sunshine and frost-free days.",
      "Dry sunny weather is essential during boll ripening and harvest.",
      "Careful pest management against bollworms."
    ]
  },
  coffee: {
    name: "Coffee",
    scientificName: "Coffea arabica",
    category: "Plantation / Beverage",
    idealConditions: "Cool to warm (15-28°C), rich volcanic/forest loam, shaded canopy, rainfall 150-250mm.",
    growingPeriod: "Perennial",
    waterRequirement: "High with well-drained slope",
    estimatedYield: "800 - 1400 kg clean bean / hectare",
    tips: [
      "Requires two-tier shade trees like Silver Oak and Albizia.",
      "Mulching preserves soil moisture and controls weed growth.",
      "Prune regularly after harvest to stimulate fruiting wood."
    ]
  },
  chickpea: {
    name: "Chickpea (Gram)",
    scientificName: "Cicer arietinum",
    category: "Pulse / Rabi Legume",
    idealConditions: "Cool dry climate (15-25°C), well-drained sandy loam, low rainfall (40-70mm).",
    growingPeriod: "95 - 110 days",
    waterRequirement: "Low to Moderate",
    estimatedYield: "1.6 - 2.2 tonnes / hectare",
    tips: [
      "Fixes atmospheric nitrogen, enriching the soil for subsequent crops.",
      "Susceptible to excessive rainfall and water stagnation.",
      "Nipping branch tips encourages bushy profuse pod setting."
    ]
  },
  banana: {
    name: "Banana",
    scientificName: "Musa acuminata",
    category: "Fruit / Horticulture",
    idealConditions: "Tropical warm humid (20-35°C), deep rich loamy soil, rainfall 100-200mm.",
    growingPeriod: "300 - 365 days",
    waterRequirement: "Very High",
    estimatedYield: "30 - 45 tonnes / hectare",
    tips: [
      "Heavy feeder of potassium; ensure adequate potassic fertilization.",
      "Provide propping support to plants carrying heavy bunches.",
      "Protect against wind damage with shelterbelts."
    ]
  }
};
