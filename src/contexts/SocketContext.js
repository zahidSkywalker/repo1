import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
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

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      // Connect to Socket.IO server
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          token
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        
        // Join user-specific room
        newSocket.emit('join-user-room', { userId: user._id });
        
        // Join order rooms if user has active orders
        if (user.activeOrders && user.activeOrders.length > 0) {
          user.activeOrders.forEach(orderId => {
            newSocket.emit('join-order-room', { orderId });
          });
        }
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
      });

      // Listen for real-time events
      newSocket.on('new-order', (data) => {
        toast.success(`New group order: ${data.itemName}`, {
          duration: 5000,
          position: 'top-right'
        });
      });

      newSocket.on('order-updated', (data) => {
        toast.success(`Order updated: ${data.itemName}`, {
          duration: 3000,
          position: 'top-right'
        });
      });

      newSocket.on('order-locked', (data) => {
        toast.success(`Order locked: ${data.itemName} - Minimum threshold reached!`, {
          duration: 6000,
          position: 'top-right'
        });
      });

      newSocket.on('order-completed', (data) => {
        toast.success(`Order completed: ${data.itemName} - Ready for pickup!`, {
          duration: 6000,
          position: 'top-right'
        });
      });

      newSocket.on('order-cancelled', (data) => {
        toast.error(`Order cancelled: ${data.itemName}`, {
          duration: 5000,
          position: 'top-right'
        });
      });

      newSocket.on('payment-received', (data) => {
        toast.success(`Payment received for order: ${data.itemName}`, {
          duration: 4000,
          position: 'top-right'
        });
      });

      newSocket.on('threshold-alert', (data) => {
        toast.success(`Order almost complete: ${data.itemName} - ${data.currentQuantity}/${data.totalQuantity}`, {
          duration: 5000,
          position: 'top-right'
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  const joinOrderRoom = (orderId) => {
    if (socket) {
      socket.emit('join-order-room', { orderId });
    }
  };

  const leaveOrderRoom = (orderId) => {
    if (socket) {
      socket.emit('leave-order-room', { orderId });
    }
  };

  const emitOrderUpdate = (event, data) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  const value = {
    socket,
    joinOrderRoom,
    leaveOrderRoom,
    emitOrderUpdate
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};