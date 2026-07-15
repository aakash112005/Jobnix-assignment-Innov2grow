const express = require('express');
const {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/authValidator');
const { authLimiter } = require('../middlewares/rateLimiter');
const { protect } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post('/register', authLimiter, registerValidator, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 */
router.post('/login', authLimiter, loginValidator, login);

router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, resetPassword);

module.exports = router;
