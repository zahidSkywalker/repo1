# 🛒 GroShare - Hyperlocal Group-Buy Grocery Application

GroShare is a full-stack web application that enables neighbors to pool grocery orders together to get wholesale prices. Built with modern technologies and real-time features, it creates a community-driven approach to grocery shopping.

## ✨ Features

### 🔐 Authentication & User Management
- **JWT-based authentication** with secure token management
- **User registration and login** with validation
- **Profile management** with address and preferences
- **Password change** functionality

### 🛍️ Group Order Management
- **Create group orders** with item details, quantities, and pricing
- **Join existing orders** by selecting desired quantities
- **Progress tracking** with visual progress bars
- **Threshold management** - orders lock when minimum quantity is reached
- **Order status tracking** (Active → Locked → Completed)

### 💳 Payment Integration
- **Simulated bKash integration** for mobile payments
- **Simulated Nagad integration** for digital payments
- **Cash on delivery** option
- **Payment verification** and status tracking

### 📱 Real-time Features
- **WebSocket integration** with Socket.IO
- **Live order updates** and notifications
- **Real-time progress tracking**
- **Instant status change notifications**

### 📧 Notifications
- **Email notifications** for order milestones
- **Real-time in-app notifications**
- **Threshold reached alerts**
- **Order completion notifications**

### 📱 Modern UI/UX
- **Responsive design** for all devices
- **Mobile-first approach**
- **Modern component library** with Tailwind CSS
- **Intuitive user interface**

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email notifications
- **Express Validator** for input validation

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time updates
- **React Hook Form** for form management
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd groshare
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
npm run install-all
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

**Required Environment Variables:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/groshare

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 4. Database Setup
```bash
# Start MongoDB (if not running as a service)
mongod

# The application will automatically create the database and collections
```

### 5. Run the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

#### Backend Only
```bash
npm run server
```

#### Frontend Only
```bash
npm run client
```

#### Production Mode
```bash
npm run build
npm start
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Socket.IO**: ws://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Orders
- `GET /api/orders` - Get all orders with filters
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new group order
- `POST /api/orders/:id/join` - Join an order
- `PUT /api/orders/:id/leave` - Leave an order
- `PUT /api/orders/:id/lock` - Lock order (organizer only)
- `PUT /api/orders/:id/complete` - Complete order (organizer only)
- `DELETE /api/orders/:id` - Cancel order (organizer only)

### Payments
- `POST /api/payments/process` - Process payment
- `GET /api/payments/order/:orderId` - Get payment status
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/methods` - Get payment methods

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/orders` - Get user orders
- `PUT /api/users/preferences` - Update preferences

## 🔌 Real-time Events

### Socket.IO Events
- `new-order` - New order created
- `order-updated` - Order updated
- `order-locked` - Order locked (threshold reached)
- `order-completed` - Order completed
- `order-cancelled` - Order cancelled

### Client Events
- `join-order` - Join order room
- `leave-order` - Leave order room

## 📱 Features Walkthrough

### 1. User Registration & Login
- Users can create accounts with full profile information
- Secure authentication with JWT tokens
- Profile management and preferences

### 2. Creating Group Orders
- Set item name, description, and category
- Define total quantity and minimum threshold
- Set price per unit and deadline
- Specify delivery location

### 3. Joining Orders
- Browse available orders in your area
- Select desired quantity
- Choose payment method (bKash, Nagad, Cash)
- Get real-time updates on order progress

### 4. Order Management
- Visual progress bars showing current vs. target quantities
- Automatic locking when threshold is reached
- Organizer can set delivery time and mark as complete
- Real-time notifications for all participants

### 5. Payment Processing
- Simulated payment gateways for bKash and Nagad
- Payment verification and status tracking
- Secure transaction handling

## 🎨 UI Components

### Design System
- **Color Palette**: Primary blues, success greens, warning yellows, danger reds
- **Typography**: Inter font family for modern readability
- **Spacing**: Consistent spacing scale using Tailwind CSS
- **Components**: Reusable button, input, card, and badge components

### Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** interface elements
- **Optimized layouts** for all screen sizes

## 🔒 Security Features

- **JWT token authentication** with expiration
- **Password hashing** using bcryptjs
- **Input validation** and sanitization
- **Rate limiting** to prevent abuse
- **CORS configuration** for secure cross-origin requests
- **Helmet.js** for security headers

## 📧 Email Notifications

### Notification Types
- **Welcome emails** for new users
- **Threshold reached** notifications
- **Order locked** confirmations
- **Order completed** with delivery details

### Email Templates
- **Professional HTML templates** with GroShare branding
- **Responsive design** for all email clients
- **Clear call-to-action** buttons
- **Order details** and status information

## 🚀 Deployment

### Backend Deployment
```bash
# Set NODE_ENV to production
export NODE_ENV=production

# Install production dependencies
npm install --production

# Build and start
npm run build
npm start
```

### Frontend Deployment
```bash
# Build production bundle
npm run build

# Deploy build folder to your hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
EMAIL_HOST=your-production-email-host
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-email-password
CLIENT_URL=https://your-domain.com
```

## 🧪 Testing

### Backend Testing
```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing
```bash
cd client
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📊 Performance Optimization

- **Database indexing** for faster queries
- **Efficient MongoDB queries** with proper aggregation
- **Real-time updates** without page refreshes
- **Optimized bundle size** with React best practices
- **Lazy loading** for better initial load times

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file
   - Verify network connectivity

2. **JWT Token Issues**
   - Check JWT_SECRET in environment variables
   - Verify token expiration settings
   - Clear browser localStorage if needed

3. **Socket.IO Connection Issues**
   - Check CORS configuration
   - Verify frontend and backend URLs
   - Check network firewall settings

4. **Email Notifications Not Working**
   - Verify email credentials in .env
   - Check SMTP server settings
   - Ensure email service allows less secure apps

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check server logs
npm run server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **Express.js Team** for the robust backend framework
- **MongoDB Team** for the flexible database solution
- **Tailwind CSS Team** for the utility-first CSS framework
- **Socket.IO Team** for real-time communication capabilities

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Open an issue on GitHub
4. Contact the development team

---

**Made with ❤️ for the GroShare community**

*Empowering neighbors to save money together through group buying*