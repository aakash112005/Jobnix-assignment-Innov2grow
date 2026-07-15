const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  });

// Sends the refresh token as an httpOnly cookie (persistent login support)
// const setRefreshCookie = (res, token) => {
//   res.cookie('refreshToken', token, {
//     httpOnly: true,
//     secure: process.env.COOKIE_SECURE === 'true',
//     sameSite: 'strict',
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     path: '/api/auth',
//   });
// };

const setRefreshCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,                    // must be true when sameSite is 'none'
    sameSite: isProd ? 'none' : 'lax',  // 'none' required for cross-domain (Vercel <-> Render)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth',
  });
};

// const clearRefreshCookie = (res) => {
//   res.clearCookie('refreshToken', { path: '/api/auth' });
// };

const clearRefreshCookie = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/api/auth',
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
};
