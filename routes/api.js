const express = require('express');
const router = express.Router();
const lambdaController = require('../controllers/lambdaController');

/**
 * @swagger
 * /execute:
 *   post:
 *     tags: [Lambda API]
 *     summary: Execute HTTP request with Lambda-style functionality
 *     description: Execute HTTP requests to external URLs with retry logic, bot detection avoidance, and metadata extraction for HTML content
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LambdaRequest'
 *           examples:
 *             simple_get:
 *               summary: Simple GET request
 *               value:
 *                 url: "https://api.github.com/users/octocat"
 *                 method: "GET"
 *             post_with_data:
 *               summary: POST request with data
 *               value:
 *                 url: "https://httpbin.org/post"
 *                 method: "POST"
 *                 headers:
 *                   Content-Type: "application/json"
 *                 data:
 *                   key: "value"
 *                   message: "Hello World"
 *             html_extraction:
 *               summary: HTML content extraction
 *               value:
 *                 url: "https://example.com"
 *                 method: "GET"
 *     responses:
 *       200:
 *         description: Request executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LambdaResponse'
 *       400:
 *         description: Bad request - missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Missing required parameter: url"
 *               error: "URL parameter is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     tags: [Lambda API]
 *     summary: Execute HTTP request via query parameters
 *     description: Execute HTTP requests using query parameters instead of request body
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *           format: uri
 *         description: Target URL to execute request against
 *         example: "https://api.github.com/users/octocat"
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *           enum: [GET, POST, PUT, DELETE, PATCH, HEAD]
 *           default: GET
 *         description: HTTP method to use
 *       - in: query
 *         name: headers
 *         schema:
 *           type: string
 *         description: JSON string of headers to include
 *         example: '{"Authorization": "Bearer token123"}'
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *         description: JSON string of request body data
 *         example: '{"key": "value"}'
 *     responses:
 *       200:
 *         description: Request executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LambdaResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/execute', lambdaController.executeRequest.bind(lambdaController));
router.get('/execute', lambdaController.executeRequest.bind(lambdaController));

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Lambda API]
 *     summary: Health check endpoint
 *     description: Check the health status of the Lambda API service
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                 memory:
 *                   type: object
 *                   properties:
 *                     used:
 *                       type: number
 *                       description: Used memory in MB
 *                     total:
 *                       type: number
 *                       description: Total memory in MB
 *       500:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/health', lambdaController.healthCheck.bind(lambdaController));

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Lambda API]
 *     summary: API information and documentation
 *     description: Get general information about the Lambda API service
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Lambda URL Extractor API"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 description:
 *                   type: string
 *                   example: "API for executing HTTP requests with Lambda-style functionality"
 *                 endpoints:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                       method:
 *                         type: string
 *                       description:
 *                         type: string
 *                 documentation:
 *                   type: string
 *                   example: "/api-docs"
 */
router.get('/', lambdaController.getApiInfo.bind(lambdaController));

module.exports = router;