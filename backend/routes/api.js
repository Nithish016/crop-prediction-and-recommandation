const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { predictCrop, detectDisease, getMarketPrices, getWeather, chatWithAI } = require('../controllers/farmerController');
const { getDashboardStats, getDiseaseReports, broadcastAlert, getAlerts } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Farmer routes (All protected)
router.post('/crop/predict', protect, predictCrop);
router.post('/disease/detect', protect, detectDisease);
router.get('/market/prices', protect, getMarketPrices);
router.get('/weather', protect, getWeather);
router.get('/alerts', protect, getAlerts); // Farmers can fetch alerts
router.post('/chat', protect, chatWithAI);


// Admin routes (Protected and Authorized for admin only)
router.get('/admin/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/admin/reports', protect, authorize('admin'), getDiseaseReports);
router.post('/admin/alerts', protect, authorize('admin'), broadcastAlert);

module.exports = router;
