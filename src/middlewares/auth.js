const AuthService = require('../services/authService');
const AppError = require('../utils/AppError');

const bind = async (req, res, next) => {
  try {
    let token = null;

    // 1. Cookie token (WEB priority)
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2. Bearer token (API fallback)
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = AuthService.verifyToken(token);
    req.user = decoded;

    return next();
  } catch (error) {
    // IMPORTANT: do NOT crash request if token invalid
    req.user = null;
    return next();
  }
};

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 1. Cookie token (WEB priority)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to access this resource.', 401));
    }

    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('You are not logged in', 401));
    }

    const userRoles = req.user.roles || [];
    const hasRole = userRoles.some(r => roles.includes(r.role));

    if (!hasRole) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

module.exports = { protect, restrictTo, bind };