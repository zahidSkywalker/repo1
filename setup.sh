#!/bin/bash

echo "🚀 Welcome to GroShare Setup!"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    echo "Please upgrade Node.js first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "Please install MongoDB and start the service before continuing."
    echo "Visit: https://docs.mongodb.com/manual/installation/"
    echo ""
    read -p "Press Enter to continue anyway..."
else
    echo "✅ MongoDB detected"
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
    echo ""
    echo "Required configuration:"
    echo "- MongoDB connection string"
    echo "- JWT secret key"
    echo "- Email settings (optional)"
    echo ""
    read -p "Press Enter after configuring .env file..."
else
    echo "✅ .env file already exists"
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd client
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
    cd ..
else
    echo "❌ Failed to install frontend dependencies"
    cd ..
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Configure your .env file with proper values"
echo "3. Run the application:"
echo "   - Development mode: npm run dev"
echo "   - Backend only: npm run server"
echo "   - Frontend only: npm run client"
echo ""
echo "Application URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo "- API Health: http://localhost:5000/api/health"
echo ""
echo "Happy coding! 🚀"