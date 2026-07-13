const mongoose = require('mongoose');

// Crop Prediction Schema
const CropPredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inputs: {
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    ph: Number,
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    soilType: String
  },

  recommendedCrop: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    default: 0.92
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Disease Report Schema
const DiseaseReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropName: {
    type: String,
    required: true
  },
  diseaseName: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  remedy: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Resolved'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Alerts Schema
const AlertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  targetRole: {
    type: String,
    enum: ['all', 'farmer', 'admin'],
    default: 'all'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Usage Stats Schema
const UsageStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actionType: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  CropPrediction: mongoose.model('CropPrediction', CropPredictionSchema),
  DiseaseReport: mongoose.model('DiseaseReport', DiseaseReportSchema),
  Alert: mongoose.model('Alert', AlertSchema),
  UsageStats: mongoose.model('UsageStats', UsageStatsSchema)
};
