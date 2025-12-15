# PDF Worker - Local Setup Guide

## Prerequisites

1. **Docker & Docker Compose** - RabbitMQ aur PostgreSQL ke liye
2. **Node.js** - v18 ya usse zyada
3. **npm** - Node package manager

---

## Step 1: Docker Containers Start Karo

```bash
# Check if Docker is running
docker ps

# If containers are not running, start them:
docker start rabbitmq report-postgres

# OR if containers don't exist, create them:

# RabbitMQ (with management UI)
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management-alpine

# PostgreSQL
docker run -d \
  --name report-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=report_db \
  -p 5432:5432 \
  postgres:16
```

---

## Step 2: Environment Variables Setup

Create `.env` file in pdf-worker root:

```bash
cd /Users/atulkumar/Desktop/pivok/pdf-worker

cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/report_db?schema=public"

# RabbitMQ
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
QUEUE_NAME="pdf_report_queue"

# API Server
API_PORT=3001
APP_URL="http://localhost:3001"
EOF
```

---

## Step 3: Install Dependencies

```bash
cd /Users/atulkumar/Desktop/pivok/pdf-worker

# Install all packages
npm install
```

---

## Step 4: Database Setup (Prisma)

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (create tables)
npx prisma migrate deploy

# OR if migrations don't exist, create them:
npx prisma migrate dev --name init
```

---

## Step 5: Build TypeScript Code

```bash
npm run build
```

---

## Step 6: Run PDF Worker

### Development Mode (with hot reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

---

## Verification

After running, you should see:

```
🔧 pdf-worker index.ts loaded
🌐 Starting API server...
🚀 Worker starting...
🌐 API Server running on http://localhost:3001
👷 PDF worker listening on queue: pdf_report_queue
❤️ worker alive
```

---

## Test API Endpoint

```bash
# Test health check
curl http://localhost:3001/health

# Test PDF data endpoint
curl -X POST http://localhost:3001/api/pdf-data \
  -H "Content-Type: application/json" \
  -d '{"targetId":"test-123"}'

# Test Report Generation & Polling
# 1. Start Job
curl -X POST http://localhost:3001/api/report \
  -H "Content-Type: application/json" \
  -d '{"targetId":"test-123"}'

# 2. Check Status (Replace JOB_ID)
curl http://localhost:3001/api/report/JOB_ID

```

---

## Useful Commands

### Check Docker Containers
```bash
docker ps
```

### View Worker Logs
```bash
# If running in background
docker logs -f pdf-worker

# Or just check the terminal where npm run dev is running
```

### Access RabbitMQ Management UI
```
http://localhost:15672
Username: guest
Password: guest
```

### Stop Worker
Press `Ctrl + C` in the terminal

### Restart Docker Containers
```bash
docker restart rabbitmq report-postgres
```

---

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check database connectivity
docker exec -it report-postgres psql -U postgres -d report_db
```

### RabbitMQ Connection Error
```bash
# Check if RabbitMQ is running
docker ps | grep rabbitmq

# Restart RabbitMQ
docker restart rabbitmq
```

---

## Quick Start (All in One)

```bash
# 1. Go to pdf-worker directory
cd /Users/atulkumar/Desktop/pivok/pdf-worker

# 2. Make sure Docker containers are running
docker start rabbitmq report-postgres

# 3. Install dependencies (first time only)
npm install

# 4. Setup Prisma (first time only)
npx prisma generate

# 5. Run worker
npm run dev
```

---

## Project Structure

```
pdf-worker/
├── src/
│   ├── api/
│   │   └── server.ts        # Express API server
│   ├── middlewares/
│   │   ├── logger.ts        # Logging middleware
│   │   └── errorHandler.ts  # Error handling
│   ├── views/
│   │   └── report.ejs       # PDF template
│   └── index.ts             # Main worker file
├── prisma/
│   └── schema.prisma        # Database schema
├── generated/               # Generated PDFs
├── .env                     # Environment variables
└── package.json
```

---

## Next Steps

1. ✅ Worker is now running independently
2. 📝 Update `src/api/server.ts` to fetch real data from your database
3. 🎨 Customize PDF template in `src/views/report.ejs`
4. 🚀 Deploy to production when ready

---

**Happy Coding! 🎉**
