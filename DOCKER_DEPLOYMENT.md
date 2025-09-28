# Docker Deployment Guide

This guide explains how to deploy the UK Power Networks Application using Docker containers.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- At least 2GB of available RAM
- At least 1GB of available disk space

## Quick Start

### Development Deployment

1. **Clone and navigate to the project:**
   ```bash
   cd /path/to/Click-_-_Quote
   ```

2. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:4321

### Production Deployment

1. **Run the production deployment script:**
   ```bash
   ./deploy-prod.sh
   ```

2. **Access the application:**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:4321

## Manual Deployment

### Using Docker Compose

1. **Development environment:**
   ```bash
   docker-compose up --build -d
   ```

2. **Production environment:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

### Individual Container Deployment

1. **Build backend:**
   ```bash
   cd backend
   docker build -t uk-power-backend .
   docker run -d -p 4321:4321 --name uk-power-backend uk-power-backend
   ```

2. **Build frontend:**
   ```bash
   cd frontend
   docker build -t uk-power-frontend .
   docker run -d -p 80:80 --name uk-power-frontend uk-power-frontend
   ```

## Container Architecture

### Backend Container
- **Base Image:** Python 3.11-slim
- **Port:** 4321
- **Features:**
  - Flask application server
  - SQLite database
  - CORS enabled
  - Production-ready configuration

### Frontend Container
- **Base Image:** Node.js 18 (build) + Nginx Alpine (runtime)
- **Port:** 80
- **Features:**
  - React application (built)
  - Nginx web server
  - API proxy to backend
  - Static asset caching
  - Security headers

## Environment Variables

### Backend
- `FLASK_ENV`: Set to `production` for production deployment
- `PYTHONUNBUFFERED`: Set to `1` for better logging

### Frontend
- Configured via nginx.conf for API proxying

## Data Persistence

### Development
- Database file: `./backend/applications.db`
- Data directory: `./backend/data`

### Production
- Database: Docker volume `backend_db`
- Data: Docker volume `backend_data`

## Networking

- **Network:** `uk-power-network` (bridge)
- **Backend:** Accessible internally as `backend:4321`
- **Frontend:** Accessible internally as `frontend:80`
- **External Access:** 
  - Frontend: `localhost:80`
  - Backend: `localhost:4321`

## Health Checks

### Production Environment
- **Backend:** HTTP check on `/api/applications/1`
- **Frontend:** HTTP check on `/`
- **Interval:** 30 seconds
- **Timeout:** 10 seconds
- **Retries:** 3

## Monitoring and Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Production logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Container Status
```bash
# Development
docker-compose ps

# Production
docker-compose -f docker-compose.prod.yml ps
```

### Resource Usage
```bash
docker stats
```

## Maintenance

### Update Application
1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Rebuild and restart:**
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

### Database Backup
```bash
# Copy database file
docker cp uk-power-backend:/app/applications.db ./backup-$(date +%Y%m%d).db
```

### Database Restore
```bash
# Stop backend
docker-compose stop backend

# Copy database file
docker cp ./backup-20231201.db uk-power-backend:/app/applications.db

# Start backend
docker-compose start backend
```

## Troubleshooting

### Common Issues

1. **Port Already in Use:**
   ```bash
   # Check what's using the port
   sudo netstat -tulpn | grep :80
   sudo netstat -tulpn | grep :4321
   
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Container Won't Start:**
   ```bash
   # Check logs
   docker-compose logs backend
   docker-compose logs frontend
   
   # Check container status
   docker-compose ps
   ```

3. **Database Issues:**
   ```bash
   # Reset database
   docker-compose down
   rm -f ./backend/applications.db
   docker-compose up -d
   ```

4. **Permission Issues:**
   ```bash
   # Fix script permissions
   chmod +x deploy.sh
   chmod +x deploy-prod.sh
   ```

### Performance Optimization

1. **Increase Memory:**
   ```bash
   # Add to docker-compose.yml
   deploy:
     resources:
       limits:
         memory: 1G
       reservations:
         memory: 512M
   ```

2. **Enable Logging:**
   ```bash
   # Add to docker-compose.yml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

## Security Considerations

### Production Deployment
- Use HTTPS in production (configure SSL certificates)
- Set up firewall rules
- Regular security updates
- Monitor container logs
- Use secrets management for sensitive data

### Network Security
- Containers communicate via internal network
- External access only through defined ports
- API proxy prevents direct backend access

## Scaling

### Horizontal Scaling
```bash
# Scale backend (requires load balancer)
docker-compose up --scale backend=3 -d
```

### Vertical Scaling
- Increase container memory limits
- Use multi-core CPU allocation
- Optimize database queries

## Support

For issues with Docker deployment:
1. Check container logs
2. Verify port availability
3. Ensure sufficient resources
4. Review this documentation

For application-specific issues, refer to the main README.md file.
