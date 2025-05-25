const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/authMiddleware');
const {getNews} = require('../controllers/newsController');

router.get('/',auth,getNews);

module.exports = router;