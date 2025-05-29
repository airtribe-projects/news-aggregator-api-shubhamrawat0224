const express = require('express');

const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {signup, login, getPreferences, updatePreferences} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/preferences',[auth],getPreferences)
router.put('/preferences',[auth],updatePreferences)



module.exports = router;