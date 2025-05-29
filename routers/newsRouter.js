const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getNews } = require('../controllers/newsController');

// Get all news based on preferences
router.get('/', auth, getNews);

module.exports = router;