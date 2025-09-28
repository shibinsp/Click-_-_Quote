#!/bin/bash

# UK Power Networks Application Production Deployment Script
echo "🚀 Starting UK Power Networks Application Production Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p ./backend/data
mkdir -p ./logs

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Remove old images (optional)
echo "🗑️  Removing old images..."
docker-compose -f docker-compose.prod.yml down --rmi all

# Build and start the application
echo "🔨 Building and starting the production application..."
docker-compose -f docker-compose.prod.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Test backend health
echo "🏥 Testing backend health..."
if curl -f http://localhost:4321/api/applications/1 2>/dev/null; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend health check failed (this is normal if no data exists yet)"
fi

# Test frontend
echo "🌐 Testing frontend..."
if curl -f http://localhost:80 2>/dev/null; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
fi

echo ""
echo "🎉 Production deployment completed!"
echo "📱 Frontend: http://localhost:80"
echo "🔧 Backend API: http://localhost:4321"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Stop services: docker-compose -f docker-compose.prod.yml down"
echo "  Restart services: docker-compose -f docker-compose.prod.yml restart"
echo "  View status: docker-compose -f docker-compose.prod.yml ps"
echo "  View health: docker-compose -f docker-compose.prod.yml ps --format 'table {{.Name}}\t{{.Status}}\t{{.Ports}}'"
