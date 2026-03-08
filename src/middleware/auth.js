const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { AppError } = require('../utils/errors');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user || !req.user.isActive) {
        return next(new AppError('User no longer exists or is inactive', 401));
      }
      
      next();
    } catch (error) {
      return next(new AppError('Invalid or expired token', 401));
    }
  } catch (error) {
    next(error);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
