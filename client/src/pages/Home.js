import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Truck, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: ShoppingCart,
      title: 'Group Buying',
      description: 'Pool orders with neighbors to get wholesale prices on groceries and household items.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Connect with your local community and build relationships through shared purchases.'
    },
    {
      icon: DollarSign,
      title: 'Save Money',
      description: 'Get better prices by buying in bulk together, reducing individual costs significantly.'
    },
    {
      icon: Truck,
      title: 'Local Delivery',
      description: 'Organize delivery to your neighborhood, making pickup convenient for everyone.'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Pay safely with bKash, Nagad, or cash on delivery options.'
    },
    {
      icon: Smartphone,
      title: 'Real-time Updates',
      description: 'Get instant notifications when orders are updated, locked, or completed.'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Create or Join',
      description: 'Start a group order or join an existing one in your area.'
    },
    {
      step: 2,
      title: 'Reach Threshold',
      description: 'Wait for the minimum quantity to be reached by participants.'
    },
    {
      step: 3,
      title: 'Order Locked',
      description: 'Once threshold is met, the order is locked and processing begins.'
    },
    {
      step: 4,
      title: 'Delivery',
      description: 'Receive your items at the confirmed delivery time and location.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Groceries for Less,{' '}
              <span className="text-primary-600">Together</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join your neighbors in group buying to get wholesale prices on groceries. 
              Create orders, invite friends, and save money while building community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/create-order"
                  className="btn-primary btn-lg inline-flex items-center space-x-2"
                >
                  <span>Create New Order</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary btn-lg inline-flex items-center space-x-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary btn-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose GroShare?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes group buying simple, secure, and social.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with group buying in just 4 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Saving?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of neighbors who are already saving money through group buying.
            </p>
            {user ? (
              <Link
                to="/orders"
                className="btn-secondary btn-lg bg-white text-primary-600 hover:bg-gray-50"
              >
                Browse Orders
              </Link>
            ) : (
              <Link
                to="/register"
                className="btn-secondary btn-lg bg-white text-primary-600 hover:bg-gray-50"
              >
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Orders Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">৳50K+</div>
              <div className="text-gray-600">Money Saved</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;