import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, ShoppingCart, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const quickStats = [
    {
      title: 'Active Orders',
      value: '3',
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Participants',
      value: '12',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Money Saved',
      value: '$45.20',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-yellow-500'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Order',
      description: 'Start a new group order for groceries',
      icon: <Plus className="w-8 h-8" />,
      link: '/orders/create',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Browse Orders',
      description: 'Find orders to join in your area',
      icon: <ShoppingCart className="w-8 h-8" />,
      link: '/orders',
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  const recentActivity = [
    {
      type: 'order_joined',
      message: 'You joined "Organic Bananas" order',
      time: '2 hours ago',
      status: 'active'
    },
    {
      type: 'order_created',
      message: 'You created "Fresh Milk" order',
      time: '1 day ago',
      status: 'pending'
    },
    {
      type: 'order_completed',
      message: 'Your "Local Honey" order was completed',
      time: '3 days ago',
      status: 'completed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 text-white`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className={`${action.color} rounded-lg p-3 text-white`}>
                  {action.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'active' ? 'bg-green-400' :
                      activity.status === 'pending' ? 'bg-yellow-400' :
                      'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Getting Started Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            💡 Getting Started Tips
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Create your first group order to start saving money</li>
            <li>• Invite neighbors to join your orders</li>
            <li>• Set realistic minimum thresholds for better success rates</li>
            <li>• Communicate delivery times clearly with participants</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;