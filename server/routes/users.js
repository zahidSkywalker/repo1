const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user statistics
    const stats = await getUserStats(req.user.userId);

    res.json({
      user,
      stats
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('phone').optional().isMobilePhone('bn-BD').withMessage('Valid Bangladesh phone number required'),
  body('location').optional().isObject().withMessage('Location must be an object'),
  body('preferences').optional().isObject().withMessage('Preferences must be an object')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    delete updates.email; // Prevent email change
    delete updates.password; // Handle password change separately

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getUserStats(req.user.userId);
    res.json({ stats });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get user's order history
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user.userId;

    const filter = {
      $or: [
        { organizer: userId },
        { 'participants.user': userId }
      ]
    };

    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate('organizer', 'name email')
      .populate('participants.user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('User orders fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// Get user's savings
router.get('/savings', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'month' } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case 'week':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case 'month':
        dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
        break;
      case 'year':
        dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
        break;
      default:
        dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
    }

    // Get completed orders where user participated
    const orders = await Order.find({
      ...dateFilter,
      status: 'completed',
      'participants.user': userId
    }).populate('participants.user', 'name');

    let totalSavings = 0;
    let totalSpent = 0;
    let orderCount = 0;

    orders.forEach(order => {
      const participant = order.participants.find(p => p.user._id.toString() === userId);
      if (participant) {
        const retailCost = (order.retailPrice || order.pricePerUnit) * participant.quantity;
        const groupCost = order.pricePerUnit * participant.quantity;
        const savings = retailCost - groupCost;

        totalSavings += savings;
        totalSpent += groupCost;
        orderCount++;
      }
    });

    res.json({
      period,
      totalSavings: Math.round(totalSavings * 100) / 100,
      totalSpent: Math.round(totalSpent * 100) / 100,
      orderCount,
      averageSavings: orderCount > 0 ? Math.round((totalSavings / orderCount) * 100) / 100 : 0
    });

  } catch (error) {
    console.error('Savings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch savings' });
  }
});

// Get user's community stats
router.get('/community', async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get orders organized by user
    const organizedOrders = await Order.find({
      organizer: userId,
      status: { $in: ['active', 'threshold_reached', 'completed'] }
    }).populate('participants.user', 'name email');

    // Get unique participants across all orders
    const uniqueParticipants = new Set();
    let totalParticipants = 0;

    organizedOrders.forEach(order => {
      order.participants.forEach(participant => {
        if (participant.user._id.toString() !== userId) {
          uniqueParticipants.add(participant.user._id.toString());
        }
        totalParticipants += participant.quantity;
      });
    });

    // Get orders user participated in
    const participatedOrders = await Order.find({
      'participants.user': userId,
      status: { $in: ['active', 'threshold_reached', 'completed'] }
    }).populate('organizer', 'name email');

    const uniqueOrganizers = new Set();
    participatedOrders.forEach(order => {
      if (order.organizer._id.toString() !== userId) {
        uniqueOrganizers.add(order.organizer._id.toString());
      }
    });

    res.json({
      organizedOrders: organizedOrders.length,
      participatedOrders: participatedOrders.length,
      uniqueParticipants: uniqueParticipants.size,
      totalParticipants,
      uniqueOrganizers: uniqueOrganizers.size,
      communityImpact: uniqueParticipants.size + uniqueOrganizers.size
    });

  } catch (error) {
    console.error('Community stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch community stats' });
  }
});

// Update user preferences
router.put('/preferences', [
  body('notifications.email').optional().isBoolean().withMessage('Email notifications must be boolean'),
  body('notifications.push').optional().isBoolean().withMessage('Push notifications must be boolean'),
  body('privacy.profileVisibility').optional().isIn(['public', 'friends', 'private']).withMessage('Invalid profile visibility'),
  body('language').optional().isIn(['bangla', 'english']).withMessage('Invalid language'),
  body('currency').optional().isIn(['BDT', 'USD']).withMessage('Invalid currency')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        $set: { 
          preferences: { ...req.body },
          updatedAt: new Date()
        } 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Helper function to get user statistics
async function getUserStats(userId) {
  try {
    // Orders organized
    const organizedOrders = await Order.countDocuments({ organizer: userId });
    const completedOrganizedOrders = await Order.countDocuments({ 
      organizer: userId, 
      status: 'completed' 
    });

    // Orders participated
    const participatedOrders = await Order.countDocuments({ 
      'participants.user': userId 
    });
    const completedParticipatedOrders = await Order.countDocuments({ 
      'participants.user': userId, 
      status: 'completed' 
    });

    // Total savings
    const completedOrders = await Order.find({
      status: 'completed',
      'participants.user': userId
    });

    let totalSavings = 0;
    completedOrders.forEach(order => {
      const participant = order.participants.find(p => p.user.toString() === userId);
      if (participant && order.retailPrice) {
        const retailCost = order.retailPrice * participant.quantity;
        const groupCost = order.pricePerUnit * participant.quantity;
        totalSavings += retailCost - groupCost;
      }
    });

    return {
      organizedOrders,
      completedOrganizedOrders,
      participatedOrders,
      completedParticipatedOrders,
      totalSavings: Math.round(totalSavings * 100) / 100,
      successRate: organizedOrders > 0 ? Math.round((completedOrganizedOrders / organizedOrders) * 100) : 0
    };

  } catch (error) {
    console.error('Error calculating user stats:', error);
    return {
      organizedOrders: 0,
      completedOrganizedOrders: 0,
      participatedOrders: 0,
      completedParticipatedOrders: 0,
      totalSavings: 0,
      successRate: 0
    };
  }
}

module.exports = router;