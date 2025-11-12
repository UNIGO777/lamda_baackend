const express = require('express');
const router = express.Router();
const linksController = require('../controllers/linksController');
const { authenticate } = require('../middleware/auth');

/**
 * Links Routes
 * Base path: /api/links
 * All routes are user-specific (no public links)
 */

// ==================== CRUD Operations ====================

/**
 * @route   POST /api/links
 * @desc    Create a new link for the user
 * @access  Private
 * @body    { url, linkType, title, description, images, metadata, tags, notes }
 */
router.post('/', authenticate, linksController.createLink);

/**
 * @route   GET /api/links
 * @desc    Get all links for a user with filtering and pagination
 * @access  Private
 * @query   { linkType, tags, search, page, limit, sortBy, sortOrder }
 */
router.get('/', authenticate, linksController.getUserLinks);

/**
 * @route   GET /api/links/:id
 * @desc    Get a single link by ID (user-specific)
 * @access  Private
 */
router.get('/:id', authenticate, linksController.getLinkById);

/**
 * @route   PUT /api/links/:id
 * @desc    Update a link (user-specific)
 * @access  Private
 * @body    { linkType, title, description, images, metadata, tags, notes }
 */
router.put('/:id', authenticate, linksController.updateLink);

/**
 * @route   DELETE /api/links/:id
 * @desc    Delete a link (soft delete, user-specific)
 * @access  Private
 */
router.delete('/:id', authenticate, linksController.deleteLink);

// ==================== Specialized Queries ====================

/**
 * @route   GET /api/links/type/:type
 * @desc    Get links by type for a user
 * @access  Private
 * @params  { type } - One of: social, product, news, video, portfolio, blog, education, forum, other
 * @query   { limit, page }
 */
router.get('/type/:type', authenticate, linksController.getLinksByType);



module.exports = router;