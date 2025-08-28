const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const User = require('../models/User');
const { isOrderOrganizer } = require('../middleware/auth');
const { sendOrderNotification } = require('../utils/notifications');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders with filters
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      status,
      category,
      city,
      area,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (area) filter['location.area'] = new RegExp(area, 'i');

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('organizer', 'name email phone')
      .populate('participants.user', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

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
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Could not fetch orders' });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get current user's orders (organized and participated)
// @access  Private
router.get('/my-orders', async (req, res) => {
  try {
    const organizedOrders = await Order.find({ organizer: req.user._id })
      .populate('participants.user', 'name email phone')
      .sort({ createdAt: -1 });

    const participatedOrders = await Order.find({
      'participants.user': req.user._id,
      organizer: { $ne: req.user._id }
    })
      .populate('organizer', 'name email phone')
      .populate('participants.user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      organized: organizedOrders,
      participated: participatedOrders
    });

  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ error: 'Could not fetch your orders' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('organizer', 'name email phone address')
      .populate('participants.user', 'name email phone address');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Could not fetch order' });
  }
});

// @route   POST /api/orders
// @desc    Create a new group order
// @access  Private
router.post('/', [
  body('itemName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Item name is required and must be less than 100 characters'),
  body('totalQuantity')
    .isFloat({ min: 0.1 })
    .withMessage('Total quantity must be a positive number'),
  body('minimumThreshold')
    .isFloat({ min: 0.1 })
    .withMessage('Minimum threshold must be a positive number'),
  body('pricePerUnit')
    .isFloat({ min: 0 })
    .withMessage('Price per unit must be a non-negative number'),
  body('unit')
    .isIn(['kg', 'g', 'l', 'ml', 'pcs', 'boxes', 'bags'])
    .withMessage('Invalid unit'),
  body('category')
    .isIn(['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'seafood', 'pantry', 'beverages', 'other'])
    .withMessage('Invalid category'),
  body('deadline')
    .isISO8601()
    .withMessage('Valid deadline date is required'),
  body('location.city')
    .notEmpty()
    .withMessage('City is required'),
  body('location.area')
    .notEmpty()
    .withMessage('Area is required')
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

    const {
      itemName,
      description,
      totalQuantity,
      minimumThreshold,
      pricePerUnit,
      unit,
      category,
      deadline,
      location,
      notes,
      tags,
      image
    } = req.body;

    // Validate deadline is in the future
    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({ error: 'Deadline must be in the future' });
    }

    // Validate minimum threshold is less than total quantity
    if (minimumThreshold >= totalQuantity) {
      return res.status(400).json({ 
        error: 'Minimum threshold must be less than total quantity' 
      });
    }

    const order = new Order({
      organizer: req.user._id,
      itemName,
      description,
      totalQuantity,
      minimumThreshold,
      pricePerUnit,
      unit,
      category,
      deadline,
      location,
      notes,
      tags,
      image
    });

    await order.save();

    // Populate organizer details
    await order.populate('organizer', 'name email phone');

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('new-order', order);

    res.status(201).json({
      message: 'Group order created successfully',
      order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      error: 'Could not create order',
      message: error.message 
    });
  }
});

// @route   POST /api/orders/:id/join
// @desc    Join an existing group order
// @access  Private
router.post('/:id/join', [
  body('quantity')
    .isFloat({ min: 0.1 })
    .withMessage('Quantity must be a positive number')
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

    const { quantity } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'active') {
      return res.status(400).json({ error: 'Order is not active' });
    }

    if (order.organizer.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Organizer cannot join their own order' });
    }

    // Check if user is already a participant
    const existingParticipant = order.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (existingParticipant) {
      return res.status(400).json({ error: 'You are already participating in this order' });
    }

    // Check if there's enough remaining quantity
    if (order.currentQuantity + quantity > order.totalQuantity) {
      return res.status(400).json({ 
        error: `Only ${order.remainingQuantity} ${order.unit} remaining` 
      });
    }

    // Add participant
    order.addParticipant(req.user._id, quantity);
    await order.save();

    // Check if threshold is reached
    if (order.isThresholdReached && order.status === 'active') {
      order.lockOrder();
      await order.save();

      // Send notifications
      await sendOrderNotification(order, 'threshold-reached');
    }

    // Populate user details
    await order.populate('participants.user', 'name email phone');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`order-${order._id}`).emit('order-updated', order);

    res.json({
      message: 'Successfully joined the order',
      order
    });

  } catch (error) {
    console.error('Join order error:', error);
    res.status(500).json({ 
      error: 'Could not join order',
      message: error.message 
    });
  }
});

// @route   PUT /api/orders/:id/leave
// @desc    Leave a group order
// @access  Private
router.put('/:id/leave', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'active') {
      return res.status(400).json({ error: 'Cannot leave a locked or completed order' });
    }

    if (order.organizer.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Organizer cannot leave their own order' });
    }

    const participant = order.removeParticipant(req.user._id);
    
    if (!participant) {
      return res.status(400).json({ error: 'You are not participating in this order' });
    }

    await order.save();

    // Populate user details
    await order.populate('participants.user', 'name email phone');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`order-${order._id}`).emit('order-updated', order);

    res.json({
      message: 'Successfully left the order',
      order
    });

  } catch (error) {
    console.error('Leave order error:', error);
    res.status(500).json({ 
      error: 'Could not leave order',
      message: error.message 
    });
  }
});

// @route   PUT /api/orders/:id/lock
// @desc    Lock an order (organizer only)
// @access  Private
router.put('/:id/lock', isOrderOrganizer, async (req, res) => {
  try {
    if (!req.order.canLock()) {
      return res.status(400).json({ 
        error: 'Order cannot be locked. Minimum threshold not reached or order is not active.' 
      });
    }

    req.order.lockOrder();
    await req.order.save();

    // Send notifications
    await sendOrderNotification(req.order, 'order-locked');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`order-${req.order._id}`).emit('order-locked', req.order);

    res.json({
      message: 'Order locked successfully',
      order: req.order
    });

  } catch (error) {
    console.error('Lock order error:', error);
    res.status(500).json({ 
      error: 'Could not lock order',
      message: error.message 
    });
  }
});

// @route   PUT /api/orders/:id/complete
// @desc    Complete an order (organizer only)
// @access  Private
router.put('/:id/complete', [
  isOrderOrganizer,
  body('deliveryTime')
    .isISO8601()
    .withMessage('Valid delivery time is required')
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

    const { deliveryTime } = req.body;

    if (req.order.status !== 'locked') {
      return res.status(400).json({ error: 'Order must be locked before completion' });
    }

    req.order.deliveryTime = deliveryTime;
    req.order.completeOrder();
    await req.order.save();

    // Send notifications
    await sendOrderNotification(req.order, 'order-completed');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`order-${req.order._id}`).emit('order-completed', req.order);

    res.json({
      message: 'Order completed successfully',
      order: req.order
    });

  } catch (error) {
    console.error('Complete order error:', error);
    res.status(500).json({ 
      error: 'Could not complete order',
      message: error.message 
    });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel an order (organizer only)
// @access  Private
router.delete('/:id', isOrderOrganizer, async (req, res) => {
  try {
    if (req.order.status !== 'active') {
      return res.status(400).json({ error: 'Only active orders can be cancelled' });
    }

    if (req.order.participants.length > 0) {
      return res.status(400).json({ error: 'Cannot cancel order with participants' });
    }

    await Order.findByIdAndDelete(req.params.id);

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('order-cancelled', { orderId: req.params.id });

    res.json({ message: 'Order cancelled successfully' });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      error: 'Could not cancel order',
      message: error.message 
    });
  }
});

module.exports = router;