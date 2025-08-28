import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Plus,
  Package,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your group orders today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-900">48</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Money Saved</p>
                  <p className="text-2xl font-bold text-gray-900">৳2,450</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-info-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">৳890</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <Link
                  to="/create-order"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Create New Order</h4>
                    <p className="text-sm text-gray-600">Start a new group buy for groceries</p>
                  </div>
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-success-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Browse Orders</h4>
                    <p className="text-sm text-gray-600">Find orders to join in your area</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Order "Fresh Tomatoes" reached threshold</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New order "Organic Rice" created</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Payment received for "Local Honey"</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="card">
          <div className="card-body text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              More Features Coming Soon!
            </h3>
            <p className="text-gray-600 mb-4">
              We're working on adding more dashboard features including detailed analytics, 
              order history, and community insights.
            </p>
            <div className="flex justify-center space-x-4">
              <span className="badge badge-info">Analytics</span>
              <span className="badge badge-info">Order History</span>
              <span className="badge badge-info">Community</span>
              <span className="badge badge-info">Notifications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;