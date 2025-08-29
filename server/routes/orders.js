const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const User = require('../models/User');
const router = express.Router();

// Create new group order
router.post('/', [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
  body('category').isIn(['groceries', 'vegetables', 'fruits', 'dairy', 'meat', 'beverages', 'snacks', 'household', 'other']).withMessage('Invalid category'),
  body('totalQuantity').isNumeric().withMessage('Total quantity must be a number'),
  body('unit').isIn(['kg', 'g', 'l', 'ml', 'pcs', 'dozen', 'pack']).withMessage('Invalid unit'),
  body('pricePerUnit').isNumeric().withMessage('Price per unit must be a number'),
  body('minimumThreshold').isNumeric().withMessage('Minimum threshold must be a number'),
  body('retailPrice').optional().isNumeric().withMessage('Retail price must be a number'),
  body('location').isObject().withMessage('Location is required'),
  body('deliveryDate').isISO8601().withMessage('Valid delivery date required'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orderData = {
      ...req.body,
      organizer: req.user.userId,
      participants: [{
        user: req.user.userId,
        quantity: 0,
        joinedAt: new Date()
      }],
      status: 'active',
      createdAt: new Date()
    };

    const order = new Order(orderData);
    await order.save();

    // Populate organizer details
    await order.populate('organizer', 'name email');

    res.status(201).json({
      message: 'Group order created successfully',
      order
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all active orders
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      status, 
      location, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = { status: { $ne: 'completed' } };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (location && location.division) {
      filter['location.division'] = location.division;
      if (location.district) filter['location.district'] = location.district;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate('organizer', 'name email')
      .populate('participants.user', 'name email')
      .sort(sort)
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
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('organizer', 'name email phone')
      .populate('participants.user', 'name email phone');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });

  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Join an order
router.post('/:orderId/join', [
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('quantity').custom((value, { req }) => {
    const order = req.order;
    if (value <= 0) throw new Error('Quantity must be positive');
    if (value > order.totalQuantity - order.currentQuantity) {
      throw new Error('Quantity exceeds available amount');
    }
    return true;
  })
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantity } = req.body;
    const orderId = req.params.orderId;
    const userId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'active') {
      return res.status(400).json({ error: 'Order is not active' });
    }

    // Check if user already joined
    const existingParticipant = order.participants.find(p => p.user.toString() === userId);
    if (existingParticipant) {
      return res.status(400).json({ error: 'You have already joined this order' });
    }

    // Check if quantity is available
    if (order.currentQuantity + quantity > order.totalQuantity) {
      return res.status(400).json({ error: 'Requested quantity not available' });
    }

    // Add participant
    order.participants.push({
      user: userId,
      quantity,
      joinedAt: new Date()
    });

    order.currentQuantity += quantity;

    // Check if threshold reached
    if (order.currentQuantity >= order.minimumThreshold && order.status === 'active') {
      order.status = 'threshold_reached';
      order.lockedAt = new Date();
    }

    await order.save();

    // Notify other participants via Socket.IO
    const io = req.app.get('io');
    io.to(`order-${orderId}`).emit('order-updated', {
      orderId,
      currentQuantity: order.currentQuantity,
      status: order.status,
      newParticipant: {
        user: req.user.userId,
        quantity
      }
    });

    res.json({
      message: 'Successfully joined order',
      order
    });

  } catch (error) {
    console.error('Join order error:', error);
    res.status(500).json({ error: 'Failed to join order' });
  }
});

// Leave an order
router.delete('/:orderId/leave', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'active') {
      return res.status(400).json({ error: 'Cannot leave locked or completed order' });
    }

    // Find and remove participant
    const participantIndex = order.participants.findIndex(p => p.user.toString() === userId);
    if (participantIndex === -1) {
      return res.status(400).json({ error: 'You are not a participant in this order' });
    }

    const participant = order.participants[participantIndex];
    order.currentQuantity -= participant.quantity;
    order.participants.splice(participantIndex, 1);

    // If organizer leaves, transfer ownership or cancel
    if (order.organizer.toString() === userId) {
      if (order.participants.length > 0) {
        // Transfer to first participant
        order.organizer = order.participants[0].user;
      } else {
        // Cancel order if no participants
        order.status = 'cancelled';
      }
    }

    await order.save();

    // Notify other participants
    const io = req.app.get('io');
    io.to(`order-${orderId}`).emit('order-updated', {
      orderId,
      currentQuantity: order.currentQuantity,
      status: order.status,
      participantLeft: userId
    });

    res.json({
      message: 'Successfully left order',
      order
    });

  } catch (error) {
    console.error('Leave order error:', error);
    res.status(500).json({ error: 'Failed to leave order' });
  }
});

// Update order (organizer only)
router.put('/:orderId', [
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
  body('deliveryDate').optional().isISO8601().withMessage('Valid delivery date required'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orderId = req.params.orderId;
    const userId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.organizer.toString() !== userId) {
      return res.status(403).json({ error: 'Only organizer can update order' });
    }

    if (order.status !== 'active') {
      return res.status(400).json({ error: 'Cannot update locked or completed order' });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'deliveryDate', 'tags'];
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');

    // Notify participants
    const io = req.app.get('io');
    io.to(`order-${orderId}`).emit('order-updated', {
      orderId,
      updates,
      order: updatedOrder
    });

    res.json({
      message: 'Order updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Complete order (organizer only)
router.post('/:orderId/complete', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.organizer.toString() !== userId) {
      return res.status(403).json({ error: 'Only organizer can complete order' });
    }

    if (order.status !== 'threshold_reached') {
      return res.status(400).json({ error: 'Order must reach threshold before completion' });
    }

    order.status = 'completed';
    order.completedAt = new Date();
    await order.save();

    // Notify participants
    const io = req.app.get('io');
    io.to(`order-${orderId}`).emit('order-completed', {
      orderId,
      completedAt: order.completedAt
    });

    res.json({
      message: 'Order completed successfully',
      order
    });

  } catch (error) {
    console.error('Order completion error:', error);
    res.status(500).json({ error: 'Failed to complete order' });
  }
});

// Get user's orders (created or joined)
router.get('/user/orders', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

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

module.exports = router;