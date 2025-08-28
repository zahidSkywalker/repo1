import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, Plus, ShoppingCart, Users, DollarSign, Clock, MapPin } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        itemName: 'Organic Bananas',
        organizer: 'Sarah Johnson',
        totalQuantity: 50,
        currentQuantity: 35,
        minimumThreshold: 25,
        pricePerUnit: 0.89,
        unit: 'kg',
        status: 'active',
        category: 'Fruits',
        location: 'Downtown',
        deadline: '2024-01-15',
        participants: 8,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'
      },
      {
        id: 2,
        itemName: 'Fresh Milk',
        organizer: 'Mike Chen',
        totalQuantity: 20,
        currentQuantity: 20,
        minimumThreshold: 15,
        pricePerUnit: 2.99,
        unit: 'L',
        status: 'locked',
        category: 'Dairy',
        location: 'Westside',
        deadline: '2024-01-12',
        participants: 12,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'
      },
      {
        id: 3,
        itemName: 'Local Honey',
        organizer: 'Emma Davis',
        totalQuantity: 10,
        currentQuantity: 6,
        minimumThreshold: 8,
        pricePerUnit: 12.99,
        unit: 'kg',
        status: 'active',
        category: 'Pantry',
        location: 'Northside',
        deadline: '2024-01-20',
        participants: 4,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400'
      }
    ];
    
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || order.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      locked: { color: 'bg-blue-100 text-blue-800', text: 'Locked' },
      completed: { color: 'bg-gray-100 text-gray-800', text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getProgressPercentage = (current, total) => {
    return Math.min((current / total) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Group Orders</h1>
              <p className="text-gray-600 mt-2">
                Find and join group orders in your neighborhood to save money
              </p>
            </div>
            {user && (
              <Link
                to="/orders/create"
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Order
              </Link>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="locked">Locked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Dairy">Dairy</option>
              <option value="Pantry">Pantry</option>
              <option value="Meat">Meat</option>
            </select>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              {/* Order Image */}
              <div className="relative">
                <img
                  src={order.image}
                  alt={order.itemName}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {order.itemName}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {order.location}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{order.currentQuantity}/{order.totalQuantity} {order.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(order.currentQuantity, order.totalQuantity)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {order.currentQuantity >= order.minimumThreshold ? 'Threshold reached!' : `${order.minimumThreshold - order.currentQuantity} ${order.unit} needed`}
                  </div>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-1 font-medium">${order.pricePerUnit}/{order.unit}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Deadline:</span>
                    <span className="ml-1 font-medium">{new Date(order.deadline).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Organizer:</span>
                    <span className="ml-1 font-medium">{order.organizer}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Participants:</span>
                    <span className="ml-1 font-medium">{order.participants}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {order.status === 'active' && (
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                      Join Order
                    </button>
                  )}
                  <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters to find more orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;