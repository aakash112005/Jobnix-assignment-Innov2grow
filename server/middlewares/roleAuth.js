const ApiError = require('../utils/ApiError');

/**
 * Restricts a route to the given roles.
 * Usage: router.post('/jobs', protect, authorize('employer', 'admin'), createJob)
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Not authorized');
  }
  if (!roles.includes(req.user.role)) {
    throw ApiError.forbidden(`Role '${req.user.role}' is not allowed to access this resource`);
  }
  next();
};

module.exports = authorize;
