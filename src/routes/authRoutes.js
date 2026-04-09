const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { registerValidation, loginValidation, changePasswordValidation } = require('../validations/authValidation');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');

// Public routes
router.post('/register', registerValidation, validate, AuthController.register);
router.post('/login', loginValidation, validate, AuthController.login);

// Protected routes
router.get('/profile', protect, AuthController.getProfile);
router.post('/change-password', protect, changePasswordValidation, validate, AuthController.changePassword);

module.exports = router;