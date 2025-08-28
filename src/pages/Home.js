import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Users, DollarSign, Truck, CheckCircle, Star } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'Pool Orders',
      description: 'Join group orders with neighbors to reach wholesale quantities and unlock better prices.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Build Community',
      description: 'Connect with neighbors and build stronger local relationships through shared shopping.'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Save Money',
      description: 'Get wholesale prices on groceries by pooling orders and reaching minimum thresholds.'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Convenient Delivery',
      description: 'Organize delivery times that work for everyone in your group.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Create or Join',
      description: 'Start a new group order or join an existing one in your neighborhood.'
    },
    {
      number: '2',
      title: 'Reach Threshold',
      description: 'Work together to reach the minimum quantity needed for wholesale pricing.'
    },
    {
      number: '3',
      title: 'Order & Pay',
      description: 'Once threshold is met, the order is locked and payments are processed.'
    },
    {
      number: '4',
      title: 'Enjoy Savings',
      description: 'Pick up your groceries at the agreed time and enjoy your savings!'
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Users' },
    { number: '50+', label: 'Neighborhoods' },
    { number: '$15K+', label: 'Money Saved' },
    { number: '200+', label: 'Orders Completed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow">
              Save Money, Build Community
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Pool grocery orders with your neighbors to get wholesale prices. 
              Connect, collaborate, and save together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Create New Order
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
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
              We make group buying simple, social, and savings-focused
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
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
              Simple steps to start saving with your neighbors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 transform -translate-y-1/2 z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Growing Together
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              See how our community is making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of neighbors who are already saving money and building community
          </p>
          {user ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Get Started Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;