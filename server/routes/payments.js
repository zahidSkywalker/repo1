const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const User = require('../models/User');
const router = express.Router();

// Initialize payment for an order
router.post('/initialize', [
  body('orderId').isMongoId().withMessage('Valid order ID required'),
  body('amount').isNumeric().withMessage('Valid amount required'),
  body('paymentMethod').isIn(['bkash', 'nagad', 'rocket']).withMessage('Valid payment method required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, amount, paymentMethod } = req.body;
    const userId = req.user.userId;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is a participant
    const participant = order.participants.find(p => p.user.toString() === userId);
    if (!participant) {
      return res.status(403).json({ error: 'You are not a participant in this order' });
    }

    // Check if order is ready for payment
    if (order.status !== 'threshold_reached') {
      return res.status(400).json({ error: 'Order is not ready for payment' });
    }

    // Calculate user's share
    const userShare = participant.quantity * order.pricePerUnit;
    
    if (Math.abs(amount - userShare) > 0.01) { // Allow small floating point differences
      return res.status(400).json({ 
        error: 'Amount does not match your order share',
        expectedAmount: userShare,
        yourQuantity: participant.quantity,
        pricePerUnit: order.pricePerUnit
      });
    }

    // Generate payment reference
    const paymentRef = generatePaymentReference(orderId, userId, paymentMethod);

    // Create payment record
    const payment = {
      orderId,
      userId,
      amount: userShare,
      paymentMethod,
      paymentRef,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes expiry
    };

    // Store payment in order (you might want to create a separate Payment model)
    if (!order.payments) order.payments = [];
    order.payments.push(payment);
    await order.save();

    // Generate payment instructions based on method
    const paymentInstructions = generatePaymentInstructions(paymentMethod, paymentRef, userShare);

    res.json({
      message: 'Payment initialized successfully',
      payment: {
        id: paymentRef,
        amount: userShare,
        paymentMethod,
        expiresAt: payment.expiresAt,
        instructions: paymentInstructions
      }
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

// Verify payment
router.post('/verify', [
  body('orderId').isMongoId().withMessage('Valid order ID required'),
  body('paymentRef').notEmpty().withMessage('Payment reference required'),
  body('transactionId').notEmpty().withMessage('Transaction ID required'),
  body('paymentMethod').isIn(['bkash', 'nagad', 'rocket']).withMessage('Valid payment method required'),
  body('senderNumber').optional().isMobilePhone('bn-BD').withMessage('Valid sender number required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, paymentRef, transactionId, paymentMethod, senderNumber } = req.body;
    const userId = req.user.userId;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Find the payment
    const payment = order.payments?.find(p => 
      p.paymentRef === paymentRef && 
      p.userId.toString() === userId &&
      p.status === 'pending'
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found or already processed' });
    }

    // Check if payment expired
    if (new Date() > payment.expiresAt) {
      return res.status(400).json({ error: 'Payment has expired' });
    }

    // In a real app, you would verify with the payment gateway here
    // For now, we'll simulate verification
    const isVerified = await simulatePaymentVerification(paymentMethod, transactionId, payment.amount);

    if (!isVerified) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Update payment status
    payment.status = 'completed';
    payment.transactionId = transactionId;
    payment.senderNumber = senderNumber;
    payment.completedAt = new Date();

    // Update participant payment status
    const participant = order.participants.find(p => p.user.toString() === userId);
    if (participant) {
      participant.paymentStatus = 'paid';
      participant.paidAt = new Date();
    }

    // Check if all participants have paid
    const allPaid = order.participants.every(p => p.paymentStatus === 'paid');
    if (allPaid) {
      order.status = 'ready_for_delivery';
      order.allPaidAt = new Date();
    }

    await order.save();

    // Notify other participants via Socket.IO
    const io = req.app.get('io');
    io.to(`order-${orderId}`).emit('payment-completed', {
      orderId,
      userId,
      amount: payment.amount,
      paymentMethod,
      allPaid,
      orderStatus: order.status
    });

    res.json({
      message: 'Payment verified successfully',
      payment: {
        id: paymentRef,
        status: 'completed',
        transactionId,
        completedAt: payment.completedAt
      },
      orderStatus: order.status
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Get payment status
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is a participant
    const participant = order.participants.find(p => p.user.toString() === userId);
    if (!participant) {
      return res.status(403).json({ error: 'You are not a participant in this order' });
    }

    // Find user's payment
    const payment = order.payments?.find(p => p.userId.toString() === userId);

    if (!payment) {
      return res.json({
        status: 'not_initialized',
        message: 'Payment not yet initialized'
      });
    }

    res.json({
      status: payment.status,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentRef: payment.paymentRef,
      createdAt: payment.createdAt,
      expiresAt: payment.expiresAt,
      completedAt: payment.completedAt,
      transactionId: payment.transactionId
    });

  } catch (error) {
    console.error('Payment status fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

// Get payment history for user
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    // Find all orders where user participated
    const orders = await Order.find({
      'participants.user': userId,
      'payments.userId': userId
    }).populate('organizer', 'name email');

    // Extract payments
    let payments = [];
    orders.forEach(order => {
      const userPayments = order.payments?.filter(p => p.userId.toString() === userId) || [];
      userPayments.forEach(payment => {
        payments.push({
          ...payment.toObject(),
          orderTitle: order.title,
          orderId: order._id,
          organizer: order.organizer
        });
      });
    });

    // Filter by status if provided
    if (status) {
      payments = payments.filter(p => p.status === status);
    }

    // Sort by creation date
    payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedPayments = payments.slice(skip, skip + parseInt(limit));

    res.json({
      payments: paginatedPayments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(payments.length / limit),
        totalPayments: payments.length,
        hasNext: page * limit < payments.length,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Payment history fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Helper functions
function generatePaymentReference(orderId, userId, paymentMethod) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${paymentMethod.toUpperCase()}-${orderId.substr(-6)}-${userId.substr(-6)}-${timestamp}-${random}`.toUpperCase();
}

function generatePaymentInstructions(paymentMethod, paymentRef, amount) {
  const instructions = {
    bkash: {
      title: 'bKash Payment Instructions',
      steps: [
        'Open bKash app',
        'Go to Send Money',
        'Enter number: 01XXXXXXXXX (replace with actual number)',
        `Enter amount: ৳${amount}`,
        'Enter reference: ' + paymentRef,
        'Enter your PIN',
        'Confirm payment'
      ],
      note: 'Keep the transaction ID for verification'
    },
    nagad: {
      title: 'Nagad Payment Instructions',
      steps: [
        'Open Nagad app',
        'Go to Send Money',
        'Enter number: 01XXXXXXXXX (replace with actual number)',
        `Enter amount: ৳${amount}`,
        'Enter reference: ' + paymentRef,
        'Enter your PIN',
        'Confirm payment'
      ],
      note: 'Keep the transaction ID for verification'
    },
    rocket: {
      title: 'Rocket Payment Instructions',
      steps: [
        'Open Rocket app',
        'Go to Send Money',
        'Enter number: 01XXXXXXXXX (replace with actual number)',
        `Enter amount: ৳${amount}`,
        'Enter reference: ' + paymentRef,
        'Enter your PIN',
        'Confirm payment'
      ],
      note: 'Keep the transaction ID for verification'
    }
  };

  return instructions[paymentMethod] || instructions.bkash;
}

async function simulatePaymentVerification(paymentMethod, transactionId, amount) {
  // In a real app, this would call the payment gateway's verification API
  // For now, we'll simulate successful verification
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate verification logic
  const isValidTransactionId = transactionId && transactionId.length >= 8;
  const isValidAmount = amount > 0;
  
  return isValidTransactionId && isValidAmount;
}

module.exports = router;