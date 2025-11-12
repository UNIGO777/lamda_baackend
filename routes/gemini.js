const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');

// Generate text from a prompt
router.post('/generate', geminiController.generate.bind(geminiController));
router.get('/generate', geminiController.generateGet.bind(geminiController));

// Summarize a URL's content
router.post('/summarize', geminiController.summarizeUrl.bind(geminiController));

// Analyze a URL with a caller-provided prompt
router.post('/analyze', geminiController.analyzeUrl.bind(geminiController));

module.exports = router;