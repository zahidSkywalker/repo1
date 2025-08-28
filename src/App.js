import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          GroShare
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Hyperlocal Group-Buy Grocery Application
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-700">
            Welcome to GroShare! 🛒
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Pool orders with neighbors to get wholesale prices
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;