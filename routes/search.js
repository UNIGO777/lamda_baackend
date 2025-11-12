const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');
const { authenticate } = require('../middleware/auth');

// All search routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/search/links
 * @desc    Search through user's links
 * @access  Private
 * @params  query (required), page (optional, default: 1), limit (optional, default: 10)
 */
router.get('/links', SearchController.searchLinks);

/**
 * @route   GET /api/search/favorites
 * @desc    Search through user's favorite links
 * @access  Private
 * @params  query (required), page (optional, default: 1), limit (optional, default: 10)
 */
router.get('/favorites', SearchController.searchFavorites);

/**
 * @route   GET /api/search/all
 * @desc    Search through both links and favorites
 * @access  Private
 * @params  query (required), page (optional, default: 1), limit (optional, default: 10), type (optional: 'all', 'links', 'favorites')
 */
router.get('/all', SearchController.searchAll);

/**
 * @route   GET /api/search/tag
 * @desc    Search by specific tag in links or favorites
 * @access  Private
 * @params  tag (required), page (optional, default: 1), limit (optional, default: 10), type (optional: 'links', 'favorites')
 */
router.get('/tag', SearchController.searchByTag);

module.exports = router;