import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children, socket }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !user) return;

    // Join order rooms for user's orders
    const joinOrderRooms = async () => {
      try {
        // Get user's orders and join their rooms
        const response = await fetch('/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const { organized, participated } = await response.json();
          
          // Join organized orders
          organized.forEach(order => {
            socket.emit('join-order', order._id);
          });
          
          // Join participated orders
          participated.forEach(order => {
            socket.emit('join-order', order._id);
          });
        }
      } catch (error) {
        console.error('Failed to join order rooms:', error);
      }
    };

    joinOrderRooms();

    // Listen for new orders
    socket.on('new-order', (order) => {
      if (order.organizer._id !== user._id) {
        toast.success(`New group order: ${order.itemName} in ${order.location.city}!`);
      }
    });

    // Listen for order updates
    socket.on('order-updated', (order) => {
      // Check if user is involved in this order
      const isInvolved = order.organizer._id === user._id || 
                        order.participants.some(p => p.user._id === user._id);
      
      if (isInvolved) {
        toast.success(`Order "${order.itemName}" has been updated!`);
      }
    });

    // Listen for order locked
    socket.on('order-locked', (order) => {
      const isInvolved = order.organizer._id === user._id || 
                        order.participants.some(p => p.user._id === user._id);
      
      if (isInvolved) {
        toast.success(`🎉 Order "${order.itemName}" has reached threshold and is locked!`);
      }
    });

    // Listen for order completed
    socket.on('order-completed', (order) => {
      const isInvolved = order.organizer._id === user._id || 
                        order.participants.some(p => p.user._id === user._id);
      
      if (isInvolved) {
        toast.success(`✅ Order "${order.itemName}" is completed! Check delivery time.`);
      }
    });

    // Listen for order cancelled
    socket.on('order-cancelled', (data) => {
      toast.error('An order you were following has been cancelled.');
    });

    // Cleanup function
    return () => {
      socket.off('new-order');
      socket.off('order-updated');
      socket.off('order-locked');
      socket.off('order-completed');
      socket.off('order-cancelled');
    };
  }, [socket, user]);

  const value = {
    socket,
    isConnected: socket?.connected || false
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};