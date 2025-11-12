const express = require('express');
const router = express.Router();
const lambdaController = require('../controllers/lambdaController');

// Execute endpoint (supports POST with body and GET with query)
router.post('/', lambdaController.executeRequest.bind(lambdaController));
router.get('/', lambdaController.executeRequest.bind(lambdaController));

// Health check
router.get('/health', lambdaController.healthCheck.bind(lambdaController));

// API info root
router.get('/', lambdaController.getApiInfo.bind(lambdaController));

module.exports = router;