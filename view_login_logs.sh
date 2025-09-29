#!/bin/bash

# Script to view login logs from the backend container
# Usage: ./view_login_logs.sh

echo "=== UK Power Networks - Login Activity Logs ==="
echo "Timestamp: $(date)"
echo "================================================"
echo

# Check if container is running
if ! docker ps | grep -q uk-power-backend; then
    echo "❌ Backend container is not running!"
    echo "Please start the containers with: docker-compose up -d"
    exit 1
fi

# Check if log file exists
if ! docker exec uk-power-backend test -f /app/logs/login_activities.log; then
    echo "📝 No login logs found yet."
    echo "Login activities will be logged here once users start using the system."
    exit 0
fi

echo "📊 Recent Login Activities:"
echo "---------------------------"
docker exec uk-power-backend tail -20 /app/logs/login_activities.log

echo
echo "📈 Log Statistics:"
echo "------------------"
TOTAL_LOGS=$(docker exec uk-power-backend wc -l /app/logs/login_activities.log | awk '{print $1}')
echo "Total log entries: $TOTAL_LOGS"

SUCCESSFUL_LOGINS=$(docker exec uk-power-backend grep -c "LOGIN_SUCCESS" /app/logs/login_activities.log)
FAILED_ATTEMPTS=$(docker exec uk-power-backend grep -c "FAILED\|BLOCKED" /app/logs/login_activities.log)
OTP_SENT=$(docker exec uk-power-backend grep -c "OTP_SENT" /app/logs/login_activities.log)

echo "Successful logins: $SUCCESSFUL_LOGINS"
echo "Failed attempts: $FAILED_ATTEMPTS"
echo "OTP emails sent: $OTP_SENT"

echo
echo "🔍 To view logs via API: curl http://localhost:5000/api/login-logs"
echo "🗑️  To clear logs: curl -X POST http://localhost:5000/api/login-logs/clear"
