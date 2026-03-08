const express = require('express');
const User = require('../models/User.model');
const { protect, restrictTo } = require('../middleware/auth');
const { successResponse } = require('../utils/response');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.use(protect);

// Get all users (admin only)
router.get('/all', restrictTo('admin'), async (req, res, next) => {
  try {
    // Get ALL users including inactive ones for admin management
    const users = await User.find()
      .select('name email avatar role isActive')
      .sort({ name: 1 });

    successResponse(res, 200, { users }, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// Create user (admin only)
router.post('/', restrictTo('admin'), [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['user', 'admin']).withMessage('Role must be user or admin'),
  validate
], async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const user = await User.create({ name, email, password, role });
    successResponse(res, 201, { user }, 'User created successfully');
  } catch (error) {
    next(error);
  }
});

// Update user (admin only)
router.put('/:id', restrictTo('admin'), async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    successResponse(res, 200, { user }, 'User updated successfully');
  } catch (error) {
    next(error);
  }
});

// Delete user (admin only)
router.delete('/:id', restrictTo('admin'), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    successResponse(res, 200, null, 'User deactivated successfully');
  } catch (error) {
    next(error);
  }
});

// Search users (admin only)
router.get('/search', restrictTo('admin'), async (req, res, next) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    })
    .select('name email avatar role')
    .limit(10);

    successResponse(res, 200, { users }, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
