#!/bin/bash

# UK Power Networks Application Deployment Script
echo "🚀 Starting UK Power Networks Application Deployment..."

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

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images (optional)
echo "🗑️  Removing old images..."
docker-compose down --rmi all

# Build and start the application
echo "🔨 Building and starting the application..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

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
echo "🎉 Deployment completed!"
echo "📱 Frontend: http://localhost:80"
echo "🔧 Backend API: http://localhost:4321"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"
echo "  View status: docker-compose ps"
