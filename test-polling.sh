#!/bin/bash

# 1. Create Job
echo "📝 Creating new report job..."
RESPONSE=$(curl -s -X POST "http://localhost:3001/api/report" \
  -H "Content-Type: application/json" \
  -d '{"targetId": "b2394eb7-fc11-4056-8e99-d4a4cadc436e"}')

echo "Response: $RESPONSE"

# Extract Job ID (using grep/sed because jq might not be available, or just keeping it simple)
JOB_ID=$(echo $RESPONSE | grep -o '"jobId":"[^"]*"' | cut -d'"' -f4)

if [ -z "$JOB_ID" ]; then
  echo "❌ Failed to get Job ID"
  exit 1
fi

echo "✅ Job ID: $JOB_ID"
echo "🔄 Starting polling..."

# 2. Poll Status
while true; do
  STATUS_RES=$(curl -s "http://localhost:3001/api/report/$JOB_ID")
  
  # Extract status
  STATUS=$(echo $STATUS_RES | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  
  echo "📊 Current Status: $STATUS"
  
  if [ "$STATUS" == "completed" ]; then
    echo "✅ Job Completed!"
    echo "Full Response: $STATUS_RES"
    break
  elif [ "$STATUS" == "failed" ]; then
    echo "❌ Job Failed!"
    echo "Full Response: $STATUS_RES"
    break
  fi
  
  sleep 2
done
