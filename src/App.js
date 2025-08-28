import React from 'react';

const App = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#2563eb',
          marginBottom: '1rem'
        }}>
          GroShare
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#4b5563',
          marginBottom: '2rem'
        }}>
          Hyperlocal Group-Buy Grocery Application
        </p>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ color: '#374151' }}>
            Welcome to GroShare! 🛒
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Pool orders with neighbors to get wholesale prices
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;