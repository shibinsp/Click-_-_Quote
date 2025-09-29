# Login Logging System

## Overview
A comprehensive login activity logging system has been implemented for the UK Power Networks application. All login-related activities are automatically logged to a separate file with detailed information.

## Features

### 🔍 **Logged Activities**
- **OTP_REQUEST**: When a user requests an OTP
- **OTP_SENT**: When an OTP is successfully sent via email
- **LOGIN_ATTEMPT**: When a user attempts to verify an OTP
- **LOGIN_SUCCESS**: When a user successfully logs in
- **LOGIN_FAILED**: When login attempts fail
- **LOGIN_BLOCKED**: When accounts are blocked due to too many failed attempts

### 📊 **Logged Information**
Each log entry includes:
- **Timestamp**: Exact date and time of the activity
- **Activity Type**: Type of login-related activity
- **Email**: User's email address (normalized to lowercase)
- **IP Address**: Client's IP address
- **User Agent**: Browser/client information
- **Status**: SUCCESS, FAILED, BLOCKED, ERROR
- **Details**: Additional context (error messages, attempt counts, etc.)

## File Locations

### 📁 **Log Files**
- **Container Path**: `/app/logs/login_activities.log`
- **Backup Files**: Automatically created when clearing logs
- **Format**: Standard logging format with timestamps

### 🔧 **Configuration**
- **Log Directory**: `backend/logs/`
- **Log Level**: INFO
- **Rotation**: Manual (via API endpoints)
- **Retention**: Unlimited (manual management)

## API Endpoints

### 📖 **View Logs**
```bash
GET /api/login-logs
```
Returns the last 100 log entries in JSON format.

**Response Example:**
```json
{
  "message": "Found 3 log entries",
  "logs": [
    {
      "timestamp": "2025-09-29 09:17:24,170",
      "level": "INFO",
      "message": "OTP_REQUEST | Email: test@gmail.com | IP: 172.18.0.1 | Status: SUCCESS"
    }
  ],
  "total_lines": 3
}
```

### 🗑️ **Clear Logs**
```bash
POST /api/login-logs/clear
```
Clears current logs and creates a timestamped backup.

**Response Example:**
```json
{
  "message": "Login logs cleared successfully",
  "backup_created": "/app/logs/login_activities.log.backup.20250929_091812"
}
```

## Command Line Tools

### 📋 **View Logs Script**
```bash
./view_login_logs.sh
```
A convenient script that:
- Shows recent login activities
- Displays statistics (successful logins, failed attempts, etc.)
- Provides API endpoint information
- Checks container status

### 🔧 **Manual Commands**
```bash
# View logs directly from container
docker exec uk-power-backend cat /app/logs/login_activities.log

# View logs via API
curl http://localhost:5000/api/login-logs

# Clear logs via API
curl -X POST http://localhost:5000/api/login-logs/clear
```

## Log Examples

### ✅ **Successful Login**
```
2025-09-29 09:17:27,856 - INFO - LOGIN_SUCCESS | Email: user@gmail.com | IP: 192.168.1.100 | Status: SUCCESS | Details: {'token_length': 32}
```

### ❌ **Failed Login Attempt**
```
2025-09-29 09:17:48,312 - INFO - LOGIN_ATTEMPT | Email: user@gmail.com | IP: 192.168.1.100 | Status: FAILED | Details: {'error': 'Invalid OTP', 'attempt': 1}
```

### 📧 **OTP Sent**
```
2025-09-29 09:17:27,856 - INFO - OTP_SENT | Email: user@gmail.com | IP: 192.168.1.100 | Status: SUCCESS | Details: {'otp_length': 6}
```

### 🚫 **Account Blocked**
```
2025-09-29 09:17:48,312 - INFO - LOGIN_ATTEMPT | Email: user@gmail.com | IP: 192.168.1.100 | Status: BLOCKED | Details: {'error': 'Too many failed attempts', 'attempts': 3}
```

## Security Features

### 🔒 **Security Information Logged**
- IP addresses for tracking suspicious activity
- User agents for device fingerprinting
- Failed attempt counts for brute force detection
- Timestamps for pattern analysis

### 🛡️ **Protection Mechanisms**
- Automatic account blocking after 3 failed attempts
- OTP expiration (10 minutes)
- IP-based tracking
- Detailed error logging for security analysis

## Monitoring & Analysis

### 📈 **Key Metrics to Monitor**
- Failed login attempts per IP
- Unusual login patterns
- Account lockout frequency
- OTP generation rates

### 🚨 **Security Alerts**
Monitor logs for:
- Multiple failed attempts from same IP
- Rapid OTP requests
- Unusual user agents
- Login attempts outside business hours

## Maintenance

### 🔄 **Log Management**
- **Backup**: Automatic backups when clearing logs
- **Rotation**: Manual via API endpoints
- **Cleanup**: Remove old backup files as needed
- **Monitoring**: Regular review of security logs

### 📊 **Performance**
- Minimal impact on application performance
- Asynchronous logging
- Efficient file I/O operations
- Container-based storage

## Troubleshooting

### ❓ **Common Issues**

**Logs not appearing:**
- Check container is running: `docker-compose ps`
- Verify log directory exists: `docker exec uk-power-backend ls -la /app/logs/`
- Check container logs: `docker-compose logs backend`

**Permission issues:**
- Logs are created with proper permissions
- Container runs as root for log file access
- No external permission setup required

**API endpoints not working:**
- Verify CORS configuration
- Check backend is accessible on port 5000
- Test with: `curl http://localhost:5000/api/login-logs`

## Future Enhancements

### 🚀 **Potential Improvements**
- Log rotation based on size/time
- Integration with external monitoring systems
- Real-time log streaming
- Advanced analytics and reporting
- Integration with SIEM systems
- Automated security alerting
