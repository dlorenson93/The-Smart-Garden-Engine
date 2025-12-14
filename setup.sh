#!/bin/bash

echo "🌱 Smart Garden Engine - Setup Script"
echo "======================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check for PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL CLI not found. Please ensure PostgreSQL is installed and running."
    echo "   You can still continue if PostgreSQL is running."
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Setting up backend environment..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env file"
    echo "⚠️  Please edit backend/.env with your database credentials"
else
    echo "✅ backend/.env already exists"
fi

echo ""
echo "🗄️  Setting up database..."
echo "   Make sure PostgreSQL is running and you have created the 'smart_garden' database"
echo ""
read -p "Have you created the 'smart_garden' database? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running migrations..."
    cd backend
    npx prisma generate
    npx prisma migrate dev --name init
    
    echo ""
    echo "🌾 Seeding crop database..."
    npm run seed
    cd ..
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 To start the application:"
    echo "   npm run dev"
    echo ""
    echo "   Backend will run on: http://localhost:3000"
    echo "   Frontend will run on: http://localhost:5173"
    echo ""
else
    echo ""
    echo "Please create the database first:"
    echo "   createdb smart_garden"
    echo ""
    echo "Then run this script again, or manually run:"
    echo "   cd backend && npx prisma migrate dev --name init"
    echo "   npm run db:seed"
fi
