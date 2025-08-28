const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// Simulated payment processing
const processPayment = async (paymentData) => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate 95% success rate
  const isSuccess = Math.random() > 0.05;
  
  if (isSuccess) {
    return {
      success: true,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'completed',
      message: 'Payment processed successfully'
    };
  } else {
    return {
      success: false,
      status: 'failed',
      message: 'Payment processing failed. Please try again.'
    };
  }
};

// @route   POST /api/payments/process
// @desc    Process payment for an order
// @access  Private
router.post('/process', [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('quantity')
    .isFloat({ min: 0.1 })
    .withMessage('Valid quantity is required'),
  body('paymentMethod')
    .isIn(['bkash', 'nagad', 'cash'])
    .withMessage('Valid payment method is required'),
  body('paymentDetails')
    .isObject()
    .withMessage('Payment details are required')
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

    const { orderId, quantity, paymentMethod, paymentDetails } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if order is active
    if (order.status !== 'active') {
      return res.status(400).json({ error: 'Order is not active' });
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

    // Validate payment details based on method
    if (paymentMethod === 'bkash') {
      if (!paymentDetails.mobileNumber || !paymentDetails.transactionId) {
        return res.status(400).json({ 
          error: 'bKash mobile number and transaction ID are required' 
        });
      }
      // Validate Bangladeshi mobile number format
      if (!/^(\+880|880|0)?1[3-9]\d{8}$/.test(paymentDetails.mobileNumber)) {
        return res.status(400).json({ error: 'Invalid bKash mobile number' });
      }
    } else if (paymentMethod === 'nagad') {
      if (!paymentDetails.mobileNumber || !paymentDetails.transactionId) {
        return res.status(400).json({ 
          error: 'Nagad mobile number and transaction ID are required' 
        });
      }
      // Validate Bangladeshi mobile number format
      if (!/^(\+880|880|0)?1[3-9]\d{8}$/.test(paymentDetails.mobileNumber)) {
        return res.status(400).json({ error: 'Invalid Nagad mobile number' });
      }
    }

    // Process payment
    const paymentResult = await processPayment({
      orderId,
      userId: req.user._id,
      amount: quantity * order.pricePerUnit,
      paymentMethod,
      paymentDetails
    });

    if (!paymentResult.success) {
      return res.status(400).json({ 
        error: 'Payment failed',
        details: paymentResult.message 
      });
    }

    // Add participant to order
    order.addParticipant(req.user._id, quantity);
    
    // Update payment status
    const participant = order.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );
    
    if (participant) {
      participant.paymentStatus = 'paid';
      participant.paymentMethod = paymentMethod;
    }

    await order.save();

    // Check if threshold is reached
    if (order.isThresholdReached && order.status === 'active') {
      order.lockOrder();
      await order.save();
    }

    // Populate user details
    await order.populate('participants.user', 'name email phone');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`order-${order._id}`).emit('order-updated', order);

    res.json({
      message: 'Payment processed successfully',
      paymentResult,
      order
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      error: 'Payment processing failed',
      message: error.message 
    });
  }
});

// @route   GET /api/payments/order/:orderId
// @desc    Get payment status for an order
// @access  Private
router.get('/order/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Find user's participation
    const participation = order.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!participation) {
      return res.status(404).json({ error: 'You are not participating in this order' });
    }

    res.json({
      orderId: order._id,
      itemName: order.itemName,
      quantity: participation.quantity,
      totalPrice: participation.totalPrice,
      paymentStatus: participation.paymentStatus,
      paymentMethod: participation.paymentMethod,
      joinedAt: participation.joinedAt
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ 
      error: 'Could not fetch payment status',
      message: error.message 
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify payment transaction
// @access  Private
router.post('/verify', [
  body('transactionId')
    .notEmpty()
    .withMessage('Transaction ID is required'),
  body('paymentMethod')
    .isIn(['bkash', 'nagad'])
    .withMessage('Valid payment method is required')
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

    const { transactionId, paymentMethod } = req.body;

    // Simulate payment verification
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate 90% verification success rate
    const isVerified = Math.random() > 0.1;
    
    if (isVerified) {
      res.json({
        verified: true,
        transactionId,
        paymentMethod,
        message: 'Payment verified successfully',
        verifiedAt: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        verified: false,
        transactionId,
        paymentMethod,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      error: 'Payment verification failed',
      message: error.message 
    });
  }
});

// @route   GET /api/payments/methods
// @desc    Get available payment methods
// @access  Private
router.get('/methods', (req, res) => {
  res.json({
    methods: [
      {
        id: 'bkash',
        name: 'bKash',
        description: 'Mobile financial service by bKash',
        logo: '/images/bkash-logo.png',
        supported: true
      },
      {
        id: 'nagad',
        name: 'Nagad',
        description: 'Digital financial service by Nagad',
        logo: '/images/nagad-logo.png',
        supported: true
      },
      {
        id: 'cash',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order',
        logo: '/images/cash-logo.png',
        supported: true
      }
    ]
  });
});

module.exports = router;