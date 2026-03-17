const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const oauthController = require('../controllers/oauthController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter')

router.get('/google', oauthController.googleAuth);
router.get('/google/callback', oauthController.googleCallback);

router.post('/register', authLimiter, authController.register)

router.post('/login', authLimiter, authController.login)

router.get('/me', protect, authController.getCurrentUser)

router.delete('/me', protect, authController.deleteUser)

router.patch('/change-password', protect, authLimiter, authController.changePassword)

router.patch('/setting', protect, authController.updateSetting)

module.exports = router;