import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, ShoppingCart, Users, DollarSign, Clock, MapPin, Star, Heart, TrendingUp, Eye, Share2 } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { API_CONFIG, API_ENDPOINTS, getAuthHeaders, handleApiResponse } from '../config/api';
import { useSocket } from '../contexts/SocketContext';

const Orders = () => {
  const { user, token } = useAuth();
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const fetchOrders = async () => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const base = (API_CONFIG.API_BASE_URL || '').replace(/\/$/, '');
      const res = await fetch(`${base}${API_ENDPOINTS.ORDERS.GET_ALL}`, {
        headers: getAuthHeaders(token)
      });
      const data = await handleApiResponse(res);
      const apiOrders = Array.isArray(data.orders) ? data.orders : [];
      // Map API to UI shape
      const mapped = apiOrders.map((o) => ({
        id: o._id || o.id,
        itemName: o.title,
        organizer: o.organizer?.name || 'Organizer',
        organizerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        totalQuantity: o.totalQuantity,
        currentQuantity: o.currentQuantity || 0,
        minimumThreshold: o.minimumThreshold,
        pricePerUnit: o.pricePerUnit,
        retailPrice: o.retailPrice || o.pricePerUnit,
        unit: o.unit === 'kg' ? 'কেজি' : o.unit,
        status: o.status,
        category: o.category,
        location: o.location?.area?.name || o.location?.district?.english || 'Bangladesh',
        deadline: o.deliveryDate || new Date().toISOString(),
        participants: (o.participants || []).length,
        image: (o.images && o.images[0]) || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
        savings: o.retailPrice ? `৳${Math.max(o.retailPrice - o.pricePerUnit, 0)}/${o.unit}` : '৳0',
        rating: 4.8,
        reviews: 12,
        isPopular: true,
        isVerified: true,
        tags: o.tags || [] ,
        description: o.description || ''
      }));
      setOrders(mapped);
    } catch (e) {
      console.error('Failed to fetch orders', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Load from backend
  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Live updates via socket
  useEffect(() => {
    if (!socket) return;
    const onUpdate = () => fetchOrders();
    socket.on('order-updated', onUpdate);
    socket.on('order-completed', onUpdate);
    socket.on('payment-completed', onUpdate);
    return () => {
      socket.off('order-updated', onUpdate);
      socket.off('order-completed', onUpdate);
      socket.off('payment-completed', onUpdate);
    };
  }, [socket, token]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || order.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'সব ক্যাটাগরি', english: 'All Categories', count: orders.length },
    ...Array.from(new Set(orders.map(o => o.category))).filter(Boolean).map(c => ({
      value: c,
      label: c,
      english: c,
      count: orders.filter(o => o.category === c).length
    }))
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', text: 'সক্রিয়', english: 'Active', icon: '🟢' },
      threshold_reached: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'সীমা পূরণ', english: 'Threshold', icon: '🔔' },
      ready_for_delivery: { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'ডেলিভারি প্রস্তুত', english: 'Ready', icon: '🚚' },
      completed: { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'সম্পন্ন', english: 'Completed', icon: '✅' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', text: 'বাতিল', english: 'Cancelled', icon: '❌' }
    };
    const config = statusConfig[status] || statusConfig.active;
    return (
      <div className="text-center">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
          <span className="mr-1">{config.icon}</span>
          {config.text}
        </span>
        <p className="text-xs text-gray-500 mt-1">{config.english}</p>
      </div>
    );
  };

  const getProgressPercentage = (current, total) => Math.min((current / total) * 100, 100);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="অর্ডার লোড হচ্ছে..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Animation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">দলগত অর্ডার ব্রাউজ করুন</h1>
              <p className="text-gray-600 text-lg">আপনার এলাকায় অর্থ সঞ্চয় করার জন্য দলগত অর্ডার খুঁজুন এবং যোগ দিন</p>
              <p className="text-sm text-gray-500 mt-1">Browse group orders in your area to save money and join</p>
            </div>
            {user && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4 sm:mt-0">
                <Link to="/orders/create" className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200">
                  <Plus className="w-5 h-5 mr-2" />
                  নতুন অর্ডার তৈরি করুন
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Search and Filters with Animation */}
        <motion.div className="bg-white rounded-lg shadow-lg p-6 mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="অর্ডার খুঁজুন... (Search orders...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors" />
            </div>
            {/* Status Filter */}
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors">
              <option value="all">সব স্ট্যাটাস (All Statuses)</option>
              <option value="active">সক্রিয় (Active)</option>
              <option value="threshold_reached">সীমা পূরণ (Threshold)</option>
              <option value="ready_for_delivery">ডেলিভারি প্রস্তুত (Ready)</option>
              <option value="completed">সম্পন্ন (Completed)</option>
              <option value="cancelled">বাতিল (Cancelled)</option>
            </select>
            {/* Category Filter */}
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors">
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label} ({category.english}) - {category.count}</option>
              ))}
            </select>
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Orders Grid with Framer Motion */}
        <motion.div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'} variants={containerVariants} initial="hidden" animate="visible">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div key={order.id} className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`} variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} layout onClick={() => setSelectedOrder(order)}>
                {/* Order Image with Popular Badge */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                  <img src={order.image} alt={order.itemName} className={`${viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'} object-cover group-hover:scale-110 transition-transform duration-300`} />
                  <div className="absolute top-3 right-3 space-y-2">
                    {getStatusBadge(order.status)}
                    {order.isPopular && (
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1" /> জনপ্রিয়
                      </div>
                    )}
                    {order.isVerified && (
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        যাচাইকৃত
                      </div>
                    )}
                  </div>
                  {/* Savings Badge */}
                  <div className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">সঞ্চয়: {order.savings}</div>
                </div>

                {/* Order Details */}
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Organizer Info */}
                  <div className="flex items-center mb-3">
                    <img src={order.organizerAvatar} alt={order.organizer} className="w-8 h-8 rounded-full mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.organizer}</p>
                      <p className="text-xs text-gray-500">{order.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{order.itemName}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-600">{order.rating}</span>
                      <span className="text-xs text-gray-500">({order.reviews})</span>
                    </div>
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {order.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{order.description}</p>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>অগ্রগতি (Progress)</span>
                      <span>{order.currentQuantity}/{order.totalQuantity} {order.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div className="bg-green-600 h-3 rounded-full transition-all duration-300" initial={{ width: 0 }} animate={{ width: `${getProgressPercentage(order.currentQuantity, order.totalQuantity)}%` }} transition={{ duration: 1, delay: 0.5 }} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.currentQuantity >= order.minimumThreshold ? 'সীমা পূরণ হয়েছে! (Threshold reached!)' : `${order.minimumThreshold - order.currentQuantity} ${order.unit} প্রয়োজন (needed)`}
                    </div>
                  </div>
                  {/* Order Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">দাম:</span>
                      <span className="ml-1 font-medium">৳{order.pricePerUnit}/{order.unit}</span>
                      <span className="ml-2 text-xs text-gray-400 line-through">৳{order.retailPrice}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">শেষ তারিখ:</span>
                      <span className="ml-1 font-medium">{new Date(order.deadline).toLocaleDateString('bn-BD')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">আয়োজক:</span>
                      <span className="ml-1 font-medium">{order.organizer}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">অংশগ্রহণকারী:</span>
                      <span className="ml-1 font-medium">{order.participants} জন</span>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {order.status === 'active' && (
                      <motion.button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        যোগ দিন (Join)
                      </motion.button>
                    )}
                    <motion.button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      বিস্তারিত দেখুন (Details)
                    </motion.button>
                  </div>
                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center text-xs text-gray-500 hover:text-green-600 transition-colors"><Eye className="w-3 h-3 mr-1" /> দেখুন</button>
                    <button className="flex items-center text-xs text-gray-500 hover:text-green-600 transition-colors"><Share2 className="w-3 h-3 mr-1" /> শেয়ার করুন</button>
                    <button className="flex items-center text-xs text-gray-500 hover:text-red-600 transition-colors"><Heart className="w-3 h-3 mr-1" /> পছন্দ</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <motion.div className="text-center py-12" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">কোন অর্ডার পাওয়া যায়নি</h3>
            <p className="mt-1 text-sm text-gray-500">আপনার অনুসন্ধান বা ফিল্টার সামঞ্জস্য করে আরও অর্ডার খুঁজুন।</p>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div className="mt-12 bg-white rounded-lg shadow-lg p-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">আজকের পরিসংখ্যান (Today's Statistics)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{orders.length}</div>
              <div className="text-sm text-gray-600">মোট অর্ডার (Total Orders)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'active').length}</div>
              <div className="text-sm text-gray-600">সক্রিয় (Active)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'locked' || o.status === 'threshold_reached').length}</div>
              <div className="text-sm text-gray-600">লক/সীমা (Locked/Threshold)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{orders.reduce((sum, o) => sum + (o.participants || 0), 0)}</div>
              <div className="text-sm text-gray-600">অংশগ্রহণকারী (Participants)</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Orders;