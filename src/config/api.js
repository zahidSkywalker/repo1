// Production API Configuration for GroShare
const config = {
  // Development
  development: {
    API_BASE_URL: 'http://localhost:5000/api',
    SOCKET_URL: 'http://localhost:5000',
    ENVIRONMENT: 'development'
  },
  
  // Production (Render.com backend)
  production: {
    API_BASE_URL: 'https://your-backend-name.onrender.com/api',
    SOCKET_URL: 'https://your-backend-name.onrender.com',
    ENVIRONMENT: 'production'
  }
};

// Get current environment
const currentEnv = process.env.NODE_ENV || 'development';

// Export current configuration
export const API_CONFIG = config[currentEnv];

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  
  // Orders
  ORDERS: {
    CREATE: '/orders',
    GET_ALL: '/orders',
    GET_BY_ID: (id) => `/orders/${id}`,
    JOIN: (id) => `/orders/${id}/join`,
    LEAVE: (id) => `/orders/${id}/leave`,
    UPDATE: (id) => `/orders/${id}`,
    COMPLETE: (id) => `/orders/${id}/complete`,
    USER_ORDERS: '/orders/user/orders'
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    STATS: '/users/stats',
    ORDERS: '/users/orders',
    SAVINGS: '/users/savings',
    COMMUNITY: '/users/community',
    PREFERENCES: '/users/preferences'
  },
  
  // Payments
  PAYMENTS: {
    INITIALIZE: '/payments/initialize',
    VERIFY: '/payments/verify',
    STATUS: (orderId) => `/payments/status/${orderId}`,
    HISTORY: '/payments/history'
  },
  
  // Health Check
  HEALTH: '/health'
};

// HTTP Headers
export const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
});

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

// API Response Handler
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API Error Handler
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      error: 'Network Error',
      message: 'Unable to connect to server. Please check your internet connection.'
    };
  }
  
  return {
    error: error.name || 'API Error',
    message: error.message || 'Something went wrong. Please try again.'
  };
};

// Socket.IO Configuration
export const SOCKET_CONFIG = {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
};

// Payment Methods
export const PAYMENT_METHODS = [
  {
    id: 'bkash',
    name: 'bKash',
    icon: '💳',
    description: 'Fast and secure mobile banking',
    instructions: 'Use your bKash app to send money'
  },
  {
    id: 'nagad',
    name: 'Nagad',
    icon: '📱',
    description: 'Digital financial service',
    instructions: 'Use your Nagad app to send money'
  },
  {
    id: 'rocket',
    name: 'Rocket',
    icon: '🚀',
    description: 'DBBL mobile banking',
    instructions: 'Use your Rocket app to send money'
  }
];

// Order Categories
export const ORDER_CATEGORIES = [
  { id: 'groceries', name: 'Groceries', icon: '🛒' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'dairy', name: 'Dairy', icon: '🥛' },
  { id: 'meat', name: 'Meat', icon: '🥩' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'snacks', name: 'Snacks', icon: '🍿' },
  { id: 'household', name: 'Household', icon: '🏠' },
  { id: 'other', name: 'Other', icon: '📦' }
];

// Order Units
export const ORDER_UNITS = [
  { id: 'kg', name: 'Kilogram (কেজি)', short: 'kg' },
  { id: 'g', name: 'Gram (গ্রাম)', short: 'g' },
  { id: 'l', name: 'Liter (লিটার)', short: 'L' },
  { id: 'ml', name: 'Milliliter (মিলিলিটার)', short: 'ml' },
  { id: 'pcs', name: 'Pieces (টুকরা)', short: 'pcs' },
  { id: 'dozen', name: 'Dozen (ডজন)', short: 'dozen' },
  { id: 'pack', name: 'Pack (প্যাক)', short: 'pack' }
];

// Order Status
export const ORDER_STATUS = {
  ACTIVE: 'active',
  THRESHOLD_REACHED: 'threshold_reached',
  READY_FOR_DELIVERY: 'ready_for_delivery',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.ACTIVE]: 'Active',
  [ORDER_STATUS.THRESHOLD_REACHED]: 'Threshold Reached',
  [ORDER_STATUS.READY_FOR_DELIVERY]: 'Ready for Delivery',
  [ORDER_STATUS.COMPLETED]: 'Completed',
  [ORDER_STATUS.CANCELLED]: 'Cancelled'
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.ACTIVE]: 'green',
  [ORDER_STATUS.THRESHOLD_REACHED]: 'yellow',
  [ORDER_STATUS.READY_FOR_DELIVERY]: 'blue',
  [ORDER_STATUS.COMPLETED]: 'gray',
  [ORDER_STATUS.CANCELLED]: 'red'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  EXPIRED: 'expired'
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.COMPLETED]: 'Completed',
  [PAYMENT_STATUS.FAILED]: 'Failed',
  [PAYMENT_STATUS.EXPIRED]: 'Expired'
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PENDING]: 'yellow',
  [PAYMENT_STATUS.COMPLETED]: 'green',
  [PAYMENT_STATUS.FAILED]: 'red',
  [PAYMENT_STATUS.EXPIRED]: 'gray'
};

// Default Configuration
export default {
  API_CONFIG,
  API_ENDPOINTS,
  SOCKET_CONFIG,
  PAYMENT_METHODS,
  ORDER_CATEGORIES,
  ORDER_UNITS,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  getAuthHeaders,
  getHeaders,
  handleApiResponse,
  handleApiError
};