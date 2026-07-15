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
 *     security: []
 */
router.post('/register', authLimiter, registerValidator, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     security: []
 */
router.post('/login', authLimiter, loginValidator, login);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token using the httpOnly refresh cookie
 *     tags: [Auth]
 *     security: []
 */
router.post('/refresh', refresh);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token using the httpOnly refresh cookie
 *     tags: [Auth]
 *     security: []
 */
router.post('/logout', protect, logout);
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link via email
 *     tags: [Auth]
 *     security: []
 */
router.post('/forgot-password', authLimiter, forgotPasswordValidator, forgotPassword);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using the emailed token
 *     tags: [Auth]
 *     security: []
 */
router.post('/reset-password', authLimiter, resetPasswordValidator, resetPassword);

module.exports = router;
