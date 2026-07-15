const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} = require('../utils/generateToken');

// @desc    Register a new user (candidate or employer)
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  // Admin accounts cannot be self-registered
  const safeRole = role === 'admin' ? 'candidate' : role || 'candidate';

  const user = await User.create({ name, email, password, role: safeRole });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens = [refreshToken];
  await user.save();
  setRefreshCookie(res, refreshToken);

  await sendEmail({
    to: user.email,
   subject: 'Welcome to Jobnix 🎉',
html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #2563eb; margin: 0;">Job Nix</h1>
    </div>

    <h2 style="color: #111827;">Welcome , ${user.name}! 👋</h2>

    <p style="font-size: 15px; line-height: 1.6;">
      We're thrilled to have you join <strong>Jobnix</strong>. Your account has been created successfully as a
      <strong style="color: #2563eb; text-transform: capitalize;">${user.role}</strong>.
    </p>

    <p style="font-size: 15px; line-height: 1.6;">
      ${
        user.role === 'employer'
          ? "You're all set to start posting jobs and discovering top talent for your team."
          : "You're all set to start exploring opportunities and applying to jobs that match your skills."
      }
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.CLIENT_URL}/login"
         style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; display: inline-block;">
        Go to Dashboard
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
      If you have any questions or need help getting started, just reply to this email — we're happy to help.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      © ${new Date().getFullYear()} Job Nix. All rights reserved.
    </p>
  </div>
`,
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user: user.toSafeObject(), accessToken },
  });
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshTokens');
  if (!user || !(await user.matchPassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  if (!user.isActive) throw ApiError.forbidden('This account has been deactivated');

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5); // keep last 5 devices
  // user.lastLogin = new Date();
  // await user.save();

  await User.findByIdAndUpdate(user._id, {
  $push: { refreshTokens: { $each: [refreshToken], $slice: -5 } },
  lastLogin: new Date(),
});

  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user: user.toSafeObject(), accessToken },
  });
});

// @desc    Refresh access token using the httpOnly refresh cookie
// @route   POST /api/auth/refresh
// @access  Public (requires refresh cookie)
// const refresh = asyncHandler(async (req, res) => {
//   const token = req.cookies?.refreshToken;
//   if (!token) throw ApiError.unauthorized('No refresh token provided');

//   let decoded;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//   } catch (err) {
//     throw ApiError.unauthorized('Invalid or expired refresh token');
//   }

//   const user = await User.findById(decoded.id).select('+refreshTokens');
//   if (!user || !user.refreshTokens.includes(token)) {
//     throw ApiError.unauthorized('Refresh token not recognized, please login again');
//   }

//   // Rotate refresh token
//   const newRefreshToken = generateRefreshToken(user._id);
//   user.refreshTokens = user.refreshTokens.filter((t) => t !== token).concat(newRefreshToken);
//   await user.save();
//   setRefreshCookie(res, newRefreshToken);

//   const accessToken = generateAccessToken(user._id, user.role);
//   res.status(200).json({ success: true, data: { accessToken, user: user.toSafeObject() } });
// });


const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw ApiError.unauthorized('No refresh token provided');

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user || !user.refreshTokens.includes(token)) {
    throw ApiError.unauthorized('Refresh token not recognized, please login again');
  }

  const newRefreshToken = generateRefreshToken(user._id);

  // Atomic update — remove old token, add new one, no local save() involved
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $pull: { refreshTokens: token },
    },
    { new: true }
  );

  await User.findByIdAndUpdate(user._id, {
    $push: { refreshTokens: { $each: [newRefreshToken], $slice: -5 } },
  });

  setRefreshCookie(res, newRefreshToken);

  const accessToken = generateAccessToken(user._id, user.role);
  res.status(200).json({ success: true, data: { accessToken, user: user.toSafeObject() } });
});


// @desc    Logout - invalidates the current refresh token
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await User.updateOne({ refreshTokens: token }, { $pull: { refreshTokens: token } });
  }
  clearRefreshCookie(res);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc    Forgot password - sends a reset link via email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond 200 to avoid leaking which emails are registered
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If that email is registered, a reset link has been sent',
    });
  }

  const rawToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
  await sendEmail({
    to: user.email,
   subject: 'Reset Your Jobnix Password',
html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #2563eb; margin: 0;">Job Nix</h1>
    </div>

    <h2 style="color: #111827;">Password Reset Request</h2>

    <p style="font-size: 15px; line-height: 1.6;">
      We received a request to reset the password for your Jobnix account. Click the button below to choose a new password.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}"
         style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; display: inline-block;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
      This link will expire in <strong>30 minutes</strong>. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
    </p>

    <p style="font-size: 13px; color: #9ca3af; line-height: 1.6; word-break: break-all;">
      If the button doesn't work, copy and paste this link into your browser:<br />
      ${resetUrl}
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      © ${new Date().getFullYear()} Job Nix. All rights reserved.
    </p>
  </div>
`,
  });

  res.status(200).json({
    success: true,
    message: 'If that email is registered, a reset link has been sent',
  });
});

// @desc    Reset password using the token emailed to the user
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) throw ApiError.badRequest('Reset token is invalid or has expired');

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshTokens = []; // force re-login on all devices
  await user.save();

  res.status(200).json({ success: true, message: 'Password has been reset successfully' });
});

module.exports = { register, login, refresh, logout, forgotPassword, resetPassword };
