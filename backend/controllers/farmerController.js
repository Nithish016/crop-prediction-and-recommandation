const { CropPrediction, DiseaseReport } = require('../models/DataModels');
const { getIsConnected } = require('../config/db');
const { logAction } = require('./authController');

// In-Memory storage fallbacks
const mockPredictions = [];
const mockDiseaseReports = [];

const getMockPredictions = () => mockPredictions;
const getMockDiseaseReports = () => mockDiseaseReports;

// Crop recommendation logic
const recommendCropLogic = (N, P, K, pH, temp, humidity, rainfall, soilType) => {
  const type = (soilType || 'loamy').toLowerCase();
  
  if (type === 'clay') {
    if (rainfall > 180) return 'Rice';
    if (N > 85) return 'Sugarcane';
    return 'Jute';
  }
  
  if (type === 'sandy') {
    if (rainfall < 80) return 'Millets';
    if (pH < 6.0) return 'Potato';
    return 'Cotton';
  }

  // Fallback to loamy/default heuristics
  if (temp > 30 && humidity > 70) {
    if (rainfall > 200) return 'Rice';
    if (N > 80 && K > 40) return 'Banana';
    return 'Sugarcane';
  }
  if (temp < 20 && rainfall < 100) {
    if (pH < 6.0) return 'Potato';
    return 'Wheat';
  }
  if (N > 100 && P > 50 && K > 50) {
    return 'Maize (Corn)';
  }
  if (pH >= 6.0 && pH <= 7.0) {
    if (humidity < 50) return 'Gram (Chickpeas)';
    return 'Cotton';
  }
  if (K > 100 && P > 80) {
    return 'Apple';
  }
  if (rainfall < 50) {
    return 'Millets';
  }
  return 'Wheat';
};

// @desc    Predict crop based on inputs
// @route   POST /api/crop/predict
// @access  Private (Farmer)
exports.predictCrop = async (req, res) => {
  const { nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall, soilType } = req.body;

  if (nitrogen === undefined || phosphorus === undefined || potassium === undefined || ph === undefined) {
    return res.status(400).json({ success: false, error: 'Please provide all N, P, K, and pH values' });
  }

  const N = parseFloat(nitrogen);
  const P = parseFloat(phosphorus);
  const K = parseFloat(potassium);
  const pH_val = parseFloat(ph);
  const temp = parseFloat(temperature || 25);
  const hum = parseFloat(humidity || 60);
  const rain = parseFloat(rainfall || 120);
  const sType = soilType || 'Loamy';

  const recommended = recommendCropLogic(N, P, K, pH_val, temp, hum, rain, sType);

  try {
    if (getIsConnected()) {
      const prediction = await CropPrediction.create({
        userId: req.user._id,
        inputs: {
          nitrogen: N,
          phosphorus: P,
          potassium: K,
          ph: pH_val,
          temperature: temp,
          humidity: hum,
          rainfall: rain,
          soilType: sType
        },
        recommendedCrop: recommended
      });

      await logAction(req.user._id, 'Crop Prediction');

      return res.status(200).json({
        success: true,
        data: prediction
      });
    } else {
      const newPrediction = {
        _id: `pred_${Date.now()}`,
        userId: req.user.id,
        inputs: {
          nitrogen: N,
          phosphorus: P,
          potassium: K,
          ph: pH_val,
          temperature: temp,
          humidity: hum,
          rainfall: rain,
          soilType: sType
        },
        recommendedCrop: recommended,
        confidence: 0.94,
        createdAt: new Date()
      };
      mockPredictions.push(newPrediction);
      await logAction(req.user.id, 'Crop Prediction');

      return res.status(200).json({
        success: true,
        data: newPrediction
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// @desc    Detect leaf disease
// @route   POST /api/disease/detect
// @access  Private (Farmer)
exports.detectDisease = async (req, res) => {
  // Typically handles file upload, here we simulate analysis of the uploaded leaf image
  const { cropName, imageUrl } = req.body;

  if (!cropName) {
    return res.status(400).json({ success: false, error: 'Please specify the crop name' });
  }

  // Predefined diseases and remedies
  const database = {
    Rice: {
      disease: 'Bacterial Leaf Blight',
      confidence: 0.88,
      remedy: 'Apply Copper Hydroxide (2.5 g/l). Avoid excess nitrogen fertilizer. Maintain field sanitation.'
    },
    Wheat: {
      disease: 'Stripe Rust (Yellow Rust)',
      confidence: 0.91,
      remedy: 'Sow resistant varieties. Apply Propiconazole fungicide (1 ml/l) upon early detection.'
    },
    Tomato: {
      disease: 'Early Blight',
      confidence: 0.95,
      remedy: 'Prune lower leaves to enhance airflow. Spray Copper-based fungicide or Chlorothalonil.'
    },
    Potato: {
      disease: 'Late Blight',
      confidence: 0.94,
      remedy: 'Use certified disease-free seeds. Apply Mancozeb or Metalaxyl-based sprays. Remove infected plants.'
    },
    Cotton: {
      disease: 'Leaf Curl Virus',
      confidence: 0.86,
      remedy: 'Control whitefly vector with insecticide (e.g. Imidacloprid). Grow resistant cultivars.'
    },
    Maize: {
      disease: 'Common Rust',
      confidence: 0.89,
      remedy: 'Apply Mancozeb at first sign of pustules. Rotate crops to non-cereal crops.'
    },
    Banana: {
      disease: 'Sigatoka Leaf Spot',
      confidence: 0.92,
      remedy: 'Improve drainage and spacing. Spray mineral oil or systemic fungicides.'
    }
  };

  const selected = database[cropName] || {
    disease: 'Leaf Spot / Healthy',
    confidence: 0.85,
    remedy: 'No severe disease detected. Maintain optimal irrigation and balanced fertilizing.'
  };

  try {
    if (getIsConnected()) {
      const report = await DiseaseReport.create({
        userId: req.user._id,
        cropName,
        diseaseName: selected.disease,
        confidence: selected.confidence,
        remedy: selected.remedy,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400',
        status: 'Active'
      });

      await logAction(req.user._id, 'Disease Detection');

      return res.status(200).json({
        success: true,
        data: report
      });
    } else {
      const newReport = {
        _id: `rep_${Date.now()}`,
        userId: req.user.id,
        cropName,
        diseaseName: selected.disease,
        confidence: selected.confidence,
        remedy: selected.remedy,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400',
        status: 'Active',
        createdAt: new Date()
      };
      mockDiseaseReports.push(newReport);
      await logAction(req.user.id, 'Disease Detection');

      return res.status(200).json({
        success: true,
        data: newReport
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get mock live market prices
// @route   GET /api/market/prices
// @access  Private
exports.getMarketPrices = async (req, res) => {
  const prices = [
    { id: 1, crop: 'Rice (Basmati)', price: '4,200', unit: 'Quintal', change: '+2.5%', status: 'high' },
    { id: 2, crop: 'Wheat', price: '2,275', unit: 'Quintal', change: '+0.8%', status: 'neutral' },
    { id: 3, crop: 'Cotton (Long Staple)', price: '7,100', unit: 'Quintal', change: '-1.2%', status: 'low' },
    { id: 4, crop: 'Potato', price: '1,500', unit: 'Quintal', change: '+4.3%', status: 'high' },
    { id: 5, crop: 'Onion', price: '2,100', unit: 'Quintal', change: '-5.1%', status: 'low' },
    { id: 6, crop: 'Tomato', price: '2,800', unit: 'Quintal', change: '+12.4%', status: 'high' },
    { id: 7, crop: 'Maize', price: '2,090', unit: 'Quintal', change: '+0.2%', status: 'neutral' }
  ];
  return res.status(200).json({ success: true, data: prices });
};

// @desc    Get weather forecast
// @route   GET /api/weather
// @access  Private
exports.getWeather = async (req, res) => {
  const weatherData = {
    current: {
      temp: 29,
      condition: 'Partly Cloudy',
      humidity: 64,
      windSpeed: 14,
      rainfallChance: '15%'
    },
    forecast: [
      { day: 'Mon', temp: 30, condition: 'Partly Cloudy' },
      { day: 'Tue', temp: 32, condition: 'Sunny' },
      { day: 'Wed', temp: 28, condition: 'Rain showers' },
      { day: 'Thu', temp: 27, condition: 'Thunderstorm' },
      { day: 'Fri', temp: 29, condition: 'Mostly Cloudy' }
    ]
  };
  return res.status(200).json({ success: true, data: weatherData });
};

// @desc    Chat with AI (Gemini or Mock fallback)
// @route   POST /api/chat
// @access  Private
exports.chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: 'Please provide a message' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      // Direct HTTP Call to Gemini using native node fetch
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Smart Agro AI, a helpful agronomy assistant. Provide agricultural advice to farmers. Keep responses clear and concise. Question: ${message}`
            }]
          }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        const text = data.candidates[0].content.parts[0].text;
        await logAction(req.user._id || req.user.id, 'Chatbot Query');
        return res.status(200).json({ success: true, reply: text });
      }
    } catch (error) {
      console.error('Gemini API Error:', error.message);
    }
  }

  // Smart rule-based fallback if API key is not present or calls fail
  const query = message.toLowerCase();
  let reply = 'That is an excellent agronomy question. To maximize yield, ensure you test your soil NPK balance. Would you like me to guide you to the Crop Recommendation page?';

  if (query.includes('fertilizer') || query.includes('urea') || query.includes('dap')) {
    reply = 'For grains like Wheat, Di-Ammonium Phosphate (DAP) provides excellent initial phosphorus. For Leaf Blights, avoid excess Nitrogen (Urea) as it promotes succulent leaf growth which is prone to bacterial spread.';
  } else if (query.includes('tomato') || query.includes('blight')) {
    reply = 'Early tomato blight is caused by the fungus Alternaria solani. Treat by removing low hanging leaves, maintaining space for ventilation, and spraying Copper-based fungicides.';
  } else if (query.includes('pm-kisan') || query.includes('scheme') || query.includes('subsidy')) {
    reply = 'The PM-KISAN scheme deposits ₹2,000 every quarter. Ensure your Aadhaar card registration is verified on the PM-Kisan portal to receive the next installment.';
  } else if (query.includes('weather') || query.includes('rain')) {
    reply = 'Our climate tracking alerts indicate light showers on Wednesday and heavy thunderstorms on Thursday. Make sure to clear drainage gates to avoid crop flooding.';
  }

  await logAction(req.user._id || req.user.id, 'Chatbot Query (Mock)');
  return res.status(200).json({ success: true, reply });
};

exports.getMockPredictions = getMockPredictions;
exports.getMockDiseaseReports = getMockDiseaseReports;

