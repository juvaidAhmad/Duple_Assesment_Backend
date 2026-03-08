const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');
const { AppError } = require('../utils/errors');

exports.register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    
    successResponse(res, 201, {
      user,
      accessToken,
      refreshToken
    }, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const { user, accessToken, refreshToken } = await authService.login(email, password);
    
    successResponse(res, 200, {
      user,
      accessToken,
      refreshToken
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return next(new AppError('Refresh token is required', 400));
    }

    const tokens = await authService.refreshToken(refreshToken);
    
    successResponse(res, 200, tokens, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await authService.logout(req.user._id);
    successResponse(res, 200, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    successResponse(res, 200, { user: req.user }, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};
