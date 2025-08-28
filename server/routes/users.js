const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Could not fetch profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
router.put('/profile', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^(\+880|880|0)?1[3-9]\d{8}$/)
    .withMessage('Please provide a valid Bangladeshi phone number'),
  body('address.street')
    .optional()
    .notEmpty()
    .withMessage('Street address cannot be empty'),
  body('address.city')
    .optional()
    .notEmpty()
    .withMessage('City cannot be empty'),
  body('address.postalCode')
    .optional()
    .notEmpty()
    .withMessage('Postal code cannot be empty')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const updates = req.body;
    const allowedUpdates = ['name', 'phone', 'address', 'profilePicture', 'preferences'];
    
    // Filter out invalid fields
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    const user = await User.findByIdAndUpdate(
      req.user._id,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      error: 'Could not update profile',
      message: error.message 
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get current user's statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    // Get organized orders count
    const organizedCount = await Order.countDocuments({ organizer: req.user._id });
    
    // Get participated orders count
    const participatedCount = await Order.countDocuments({
      'participants.user': req.user._id,
      organizer: { $ne: req.user._id }
    });

    // Get total spent
    const participatedOrders = await Order.find({
      'participants.user': req.user._id
    });

    const totalSpent = participatedOrders.reduce((total, order) => {
      const participation = order.participants.find(
        p => p.user.toString() === req.user._id.toString()
      );
      return total + (participation ? participation.totalPrice : 0);
    }, 0);

    // Get recent activity
    const recentOrders = await Order.find({
      $or: [
        { organizer: req.user._id },
        { 'participants.user': req.user._id }
      ]
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('organizer', 'name')
      .populate('participants.user', 'name');

    res.json({
      organizedCount,
      participatedCount,
      totalSpent,
      recentOrders
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'Could not fetch statistics',
      message: error.message 
    });
  }
});

// @route   GET /api/users/orders
// @desc    Get current user's orders with pagination
// @access  Private
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, type = 'all' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    let total = 0;

    if (type === 'organized') {
      query = { organizer: req.user._id };
      total = await Order.countDocuments(query);
    } else if (type === 'participated') {
      query = {
        'participants.user': req.user._id,
        organizer: { $ne: req.user._id }
      };
      total = await Order.countDocuments(query);
    } else {
      // All orders
      query = {
        $or: [
          { organizer: req.user._id },
          { 'participants.user': req.user._id }
        ]
      };
      total = await Order.countDocuments(query);
    }

    const orders = await Order.find(query)
      .populate('organizer', 'name email phone')
      .populate('participants.user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
        hasNext: skip + orders.length < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ 
      error: 'Could not fetch orders',
      message: error.message 
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
  body('language')
    .optional()
    .isIn(['en', 'bn'])
    .withMessage('Language must be either "en" or "bn"')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const { notifications, language } = req.body;
    const updates = {};

    if (notifications) {
      updates['preferences.notifications'] = notifications;
    }
    if (language) {
      updates['preferences.language'] = language;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Preferences updated successfully',
      user
    });

  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ 
      error: 'Could not update preferences',
      message: error.message 
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users by name or email (for organizers)
// @access  Private
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ],
      _id: { $ne: req.user._id } // Exclude current user
    })
      .select('name email phone address')
      .limit(parseInt(limit));

    res.json(users);

  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({ 
      error: 'Could not search users',
      message: error.message 
    });
  }
});

module.exports = router;