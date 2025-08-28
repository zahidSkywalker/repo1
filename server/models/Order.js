const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  totalQuantity: {
    type: Number,
    required: [true, 'Total quantity is required'],
    min: [1, 'Total quantity must be at least 1']
  },
  minimumThreshold: {
    type: Number,
    required: [true, 'Minimum threshold is required'],
    min: [1, 'Minimum threshold must be at least 1']
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Price per unit is required'],
    min: [0, 'Price per unit cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'g', 'l', 'ml', 'pcs', 'boxes', 'bags'],
    default: 'kg'
  },
  currentQuantity: {
    type: Number,
    default: 0
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [0.1, 'Quantity must be at least 0.1']
    },
    totalPrice: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['bkash', 'nagad', 'cash'],
      default: 'bkash'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'locked', 'completed', 'cancelled'],
    default: 'active'
  },
  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'seafood', 'pantry', 'beverages', 'other'],
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  location: {
    city: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    }
  },
  deadline: {
    type: Date,
    required: [true, 'Order deadline is required']
  },
  deliveryTime: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ status: 1, deadline: 1 });
orderSchema.index({ organizer: 1 });
orderSchema.index({ 'location.city': 1, 'location.area': 1 });
orderSchema.index({ category: 1 });

// Virtual for progress percentage
orderSchema.virtual('progressPercentage').get(function() {
  if (this.totalQuantity === 0) return 0;
  return Math.min((this.currentQuantity / this.totalQuantity) * 100, 100);
});

// Virtual for is threshold reached
orderSchema.virtual('isThresholdReached').get(function() {
  return this.currentQuantity >= this.minimumThreshold;
});

// Virtual for remaining quantity
orderSchema.virtual('remainingQuantity').get(function() {
  return Math.max(0, this.totalQuantity - this.currentQuantity);
});

// Virtual for total revenue
orderSchema.virtual('totalRevenue').get(function() {
  return this.participants.reduce((total, participant) => {
    return total + (participant.paymentStatus === 'paid' ? participant.totalPrice : 0);
  }, 0);
});

// Method to add participant
orderSchema.methods.addParticipant = function(userId, quantity) {
  const totalPrice = quantity * this.pricePerUnit;
  
  // Check if user is already a participant
  const existingParticipant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (existingParticipant) {
    // Update existing participant
    existingParticipant.quantity += quantity;
    existingParticipant.totalPrice += totalPrice;
  } else {
    // Add new participant
    this.participants.push({
      user: userId,
      quantity: quantity,
      totalPrice: totalPrice
    });
  }
  
  this.currentQuantity += quantity;
  return this;
};

// Method to remove participant
orderSchema.methods.removeParticipant = function(userId) {
  const participantIndex = this.participants.findIndex(
    p => p.user.toString() === userId.toString()
  );
  
  if (participantIndex !== -1) {
    const participant = this.participants[participantIndex];
    this.currentQuantity -= participant.quantity;
    this.participants.splice(participantIndex, 1);
    return participant;
  }
  
  return null;
};

// Method to check if order can be locked
orderSchema.methods.canLock = function() {
  return this.status === 'active' && this.isThresholdReached;
};

// Method to lock order
orderSchema.methods.lockOrder = function() {
  if (this.canLock()) {
    this.status = 'locked';
    return true;
  }
  return false;
};

// Method to complete order
orderSchema.methods.completeOrder = function() {
  if (this.status === 'locked') {
    this.status = 'completed';
    return true;
  }
  return false;
};

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);