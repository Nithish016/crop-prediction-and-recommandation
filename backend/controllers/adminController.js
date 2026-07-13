const { CropPrediction, DiseaseReport, Alert, UsageStats } = require('../models/DataModels');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const { getMockUsersList } = require('./authController');

// In-Memory storage fallbacks for stats & alerts
const mockUsageStats = [
  { actionType: 'Login', timestamp: new Date(Date.now() - 3600000) },
  { actionType: 'Crop Prediction', timestamp: new Date(Date.now() - 7200000) },
  { actionType: 'Disease Detection', timestamp: new Date(Date.now() - 10800000) },
  { actionType: 'Register', timestamp: new Date(Date.now() - 14400000) }
];
const mockAlerts = [
  {
    _id: 'alert_default',
    title: 'High Rainfall Warning',
    message: 'A heavy downpour is expected over the next 48 hours. Please ensure proper drainage in low-lying crop fields.',
    targetRole: 'farmer',
    createdAt: new Date()
  }
];

const getMockAlerts = () => mockAlerts;

// @desc    Get admin dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    let totalFarmers = 0;
    let totalPredictions = 0;
    let totalReports = 0;
    let latestActivity = [];

    if (getIsConnected()) {
      totalFarmers = await User.countDocuments({ role: 'farmer' });
      totalPredictions = await CropPrediction.countDocuments({});
      totalReports = await DiseaseReport.countDocuments({});
      
      const stats = await UsageStats.find({})
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('userId', 'name role');
      
      latestActivity = stats.map(s => ({
        user: s.userId ? s.userId.name : 'System',
        action: s.actionType,
        timestamp: s.timestamp
      }));
    } else {
      // In-memory stats
      const { getMockPredictions, getMockDiseaseReports } = require('./farmerController');
      totalFarmers = getMockUsersList().filter(u => u.role === 'farmer').length;
      totalPredictions = getMockPredictions().length;
      totalReports = getMockDiseaseReports().length;
      latestActivity = mockUsageStats.slice(-10).reverse().map(s => ({
        user: 'Farmer User',
        action: s.actionType,
        timestamp: s.timestamp
      }));
    }

    return res.status(200).json({
      success: true,
      data: {
        totalFarmers,
        totalPredictions,
        totalReports,
        totalAlerts: getIsConnected() ? await Alert.countDocuments({}) : mockAlerts.length,
        latestActivity
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all disease reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
exports.getDiseaseReports = async (req, res) => {
  try {
    if (getIsConnected()) {
      const reports = await DiseaseReport.find({})
        .sort({ createdAt: -1 })
        .populate('userId', 'name email');

      return res.status(200).json({
        success: true,
        data: reports
      });
    } else {
      const { getMockDiseaseReports } = require('./farmerController');
      const reports = getMockDiseaseReports().map(r => ({
        ...r,
        userId: { name: 'Farmer Demo', email: 'farmer@demo.com' }
      }));
      return res.status(200).json({
        success: true,
        data: reports
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Broadcast alert/notification
// @route   POST /api/admin/alerts
// @access  Private (Admin)
exports.broadcastAlert = async (req, res) => {
  const { title, message, targetRole } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, error: 'Please provide title and message' });
  }

  try {
    if (getIsConnected()) {
      const alert = await Alert.create({
        title,
        message,
        targetRole: targetRole || 'farmer',
        createdBy: req.user._id
      });

      return res.status(201).json({
        success: true,
        data: alert
      });
    } else {
      const newAlert = {
        _id: `alert_${Date.now()}`,
        title,
        message,
        targetRole: targetRole || 'farmer',
        createdAt: new Date()
      };
      mockAlerts.push(newAlert);

      return res.status(201).json({
        success: true,
        data: newAlert
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get broadcast alerts for farmers
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res) => {
  try {
    if (getIsConnected()) {
      const alerts = await Alert.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: alerts });
    } else {
      return res.status(200).json({ success: true, data: mockAlerts.slice().reverse() });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.mockUsageStats = mockUsageStats;
exports.getMockAlerts = getMockAlerts;
