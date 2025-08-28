import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, ShoppingCart, Users, DollarSign, Clock, MapPin, Star, Heart, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Bangladesh-focused mock data
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        itemName: 'বাসমতি চাল (Basmati Rice)',
        organizer: 'সাবরিনা আক্তার',
        totalQuantity: 100,
        currentQuantity: 75,
        minimumThreshold: 50,
        pricePerUnit: 120,
        unit: 'কেজি',
        status: 'active',
        category: 'চাল',
        location: 'ধানমন্ডি, ঢাকা',
        deadline: '2024-01-20',
        participants: 12,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        savings: '৳১৫/কেজি',
        rating: 4.8,
        isPopular: true
      },
      {
        id: 2,
        itemName: 'মুগ ডাল (Moong Dal)',
        organizer: 'রফিক আহমেদ',
        totalQuantity: 50,
        currentQuantity: 50,
        minimumThreshold: 30,
        pricePerUnit: 180,
        unit: 'কেজি',
        status: 'locked',
        category: 'ডাল',
        location: 'গুলশান, ঢাকা',
        deadline: '2024-01-18',
        participants: 18,
        image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?w=400',
        savings: '৳২৫/কেজি',
        rating: 4.9,
        isPopular: true
      },
      {
        id: 3,
        itemName: 'আটা (Flour)',
        organizer: 'ফাতেমা বেগম',
        totalQuantity: 80,
        currentQuantity: 45,
        minimumThreshold: 60,
        pricePerUnit: 65,
        unit: 'কেজি',
        status: 'active',
        category: 'আটা',
        location: 'মোহাম্মদপুর, ঢাকা',
        deadline: '2024-01-25',
        participants: 8,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
        savings: '৳১০/কেজি',
        rating: 4.7,
        isPopular: false
      },
      {
        id: 4,
        itemName: 'চিনি (Sugar)',
        organizer: 'ইমরান হোসেন',
        totalQuantity: 60,
        currentQuantity: 60,
        minimumThreshold: 40,
        pricePerUnit: 95,
        unit: 'কেজি',
        status: 'locked',
        category: 'চিনি',
        location: 'বনানী, ঢাকা',
        deadline: '2024-01-15',
        participants: 15,
        image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400',
        savings: '৳২০/কেজি',
        rating: 4.6,
        isPopular: false
      },
      {
        id: 5,
        itemName: 'তেল (Cooking Oil)',
        organizer: 'নাসরিন সুলতানা',
        totalQuantity: 40,
        currentQuantity: 25,
        minimumThreshold: 25,
        pricePerUnit: 180,
        unit: 'লিটার',
        status: 'active',
        category: 'তেল',
        location: 'মিরপুর, ঢাকা',
        deadline: '2024-01-30',
        participants: 6,
        image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400',
        savings: '৳৩০/লিটার',
        rating: 4.8,
        isPopular: true
      },
      {
        id: 6,
        itemName: 'মসলা (Spices)',
        organizer: 'আব্দুল মালেক',
        totalQuantity: 30,
        currentQuantity: 30,
        minimumThreshold: 20,
        pricePerUnit: 450,
        unit: 'কেজি',
        status: 'locked',
        category: 'মসলা',
        location: 'লালবাগ, ঢাকা',
        deadline: '2024-01-12',
        participants: 22,
        image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400',
        savings: '৳৫০/কেজি',
        rating: 4.9,
        isPopular: true
      }
    ];
    
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || order.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'সব ক্যাটাগরি', english: 'All Categories' },
    { value: 'চাল', label: 'চাল', english: 'Rice' },
    { value: 'ডাল', label: 'ডাল', english: 'Lentils' },
    { value: 'আটা', label: 'আটা', english: 'Flour' },
    { value: 'চিনি', label: 'চিনি', english: 'Sugar' },
    { value: 'তেল', label: 'তেল', english: 'Oil' },
    { value: 'মসলা', label: 'মসলা', english: 'Spices' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'সক্রিয়', english: 'Active' },
      locked: { color: 'bg-blue-100 text-blue-800', text: 'লক', english: 'Locked' },
      completed: { color: 'bg-gray-100 text-gray-800', text: 'সম্পন্ন', english: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'বাতিল', english: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <div className="text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
          {config.text}
        </span>
        <p className="text-xs text-gray-500 mt-1">{config.english}</p>
      </div>
    );
  };

  const getProgressPercentage = (current, total) => {
    return Math.min((current / total) * 100, 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                গোষ্ঠী অর্ডার ব্রাউজ করুন
              </h1>
              <p className="text-gray-600 text-lg">
                আপনার এলাকায় অর্থ সঞ্চয় করার জন্য গোষ্ঠী অর্ডার খুঁজুন এবং যোগ দিন
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Browse group orders in your area to save money and join
              </p>
            </div>
            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 sm:mt-0"
              >
                <Link
                  to="/orders/create"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  নতুন অর্ডার তৈরি করুন
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Search and Filters with Animation */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="অর্ডার খুঁজুন... (Search orders...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              <option value="all">সব স্ট্যাটাস (All Statuses)</option>
              <option value="active">সক্রিয় (Active)</option>
              <option value="locked">লক (Locked)</option>
              <option value="completed">সম্পন্ন (Completed)</option>
              <option value="cancelled">বাতিল (Cancelled)</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label} ({category.english})
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Orders Grid with Framer Motion */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                layout
                onClick={() => setSelectedOrder(order)}
              >
                {/* Order Image with Popular Badge */}
                <div className="relative">
                  <img
                    src={order.image}
                    alt={order.itemName}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 space-y-2">
                    {getStatusBadge(order.status)}
                    {order.isPopular && (
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        জনপ্রিয়
                      </div>
                    )}
                  </div>
                  
                  {/* Savings Badge */}
                  <div className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    সঞ্চয়: {order.savings}
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {order.itemName}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-600">{order.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {order.location}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>অগ্রগতি (Progress)</span>
                      <span>{order.currentQuantity}/{order.totalQuantity} {order.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage(order.currentQuantity, order.totalQuantity)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.currentQuantity >= order.minimumThreshold ? 
                        'সীমা পূরণ হয়েছে! (Threshold reached!)' : 
                        `${order.minimumThreshold - order.currentQuantity} ${order.unit} প্রয়োজন (needed)`
                      }
                    </div>
                  </div>

                  {/* Order Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">দাম:</span>
                      <span className="ml-1 font-medium">৳{order.pricePerUnit}/{order.unit}</span>
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
                      <motion.button 
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        যোগ দিন (Join)
                      </motion.button>
                    )}
                    <motion.button 
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      বিস্তারিত দেখুন (Details)
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">কোন অর্ডার পাওয়া যায়নি</h3>
            <p className="mt-1 text-sm text-gray-500">
              আপনার অনুসন্ধান বা ফিল্টার সামঞ্জস্য করে আরও অর্ডার খুঁজুন।
            </p>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div 
          className="mt-12 bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            আজকের পরিসংখ্যান (Today's Statistics)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{orders.length}</div>
              <div className="text-sm text-gray-600">মোট অর্ডার (Total Orders)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">সক্রিয় (Active)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'locked').length}
              </div>
              <div className="text-sm text-gray-600">লক (Locked)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {orders.reduce((sum, o) => sum + o.participants, 0)}
              </div>
              <div className="text-sm text-gray-600">অংশগ্রহণকারী (Participants)</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Orders;