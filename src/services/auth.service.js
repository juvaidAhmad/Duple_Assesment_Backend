const User = require('../models/User.model');
const { AppError } = require('../utils/errors');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const user = await User.create(userData);
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  }

  async refreshToken(token) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.id).select('+refreshToken');

      if (!user || user.refreshToken !== token) {
        throw new AppError('Invalid refresh token', 401);
      }

      const accessToken = generateAccessToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      user.refreshToken = newRefreshToken;
      await user.save();

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }
}

module.exports = new AuthService();
