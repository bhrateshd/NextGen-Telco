# API Gateway - Getting Started Guide

## Quick Start

### 1. Setup

```bash
# Clone repository (if not already done)
git clone https://github.com/bhrateshd/NextGen-Telco.git
cd NextGen-Telco/api-gateway

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Update .env with your service URLs
nano .env
```

### 2. Local Development

```bash
# Start with hot reload
npm run dev

# API Gateway will start at http://localhost:8080
```

### 3. Make a Request

```bash
# Health check
curl http://localhost:8080/health

# Create a new user
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "SecurePassword123"
  }'
```

## Development with Docker

```bash
# Build image
docker build -t nextgen-telco/api-gateway:dev .

# Run container
docker run -p 8080:8080 \
  -e NODE_ENV=development \
  -e USER_SERVICE_URL=http://user-service:8080 \
  -e PLAN_SERVICE_URL=http://plan-service:8080 \
  -e DEVICE_SERVICE_URL=http://device-service:8080 \
  -e ORDER_SERVICE_URL=http://order-service:8080 \
  -e PAYMENT_SERVICE_URL=http://payment-service:8080 \
  nextgen-telco/api-gateway:dev
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/tests/users.test.js

# Run with coverage
npm test -- --coverage
```

## Project Structure

```
api-gateway/
├── src/
│   ├── index.js              # Main application entry
│   ├── middleware/           # Custom middleware
│   │   ├── errorHandler.js   # Error handling
│   │   ├── requestLogger.js  # Request logging
│   │   ├── rateLimiter.js    # Rate limiting
│   │   └── requestValidator.js # Request validation
│   ├── routes/               # API route handlers
│   │   ├── users.js          # User service routes
│   │   ├── plans.js          # Plan service routes
│   │   ├── devices.js        # Device service routes
│   │   ├── orders.js         # Order service routes
│   │   └── payments.js       # Payment service routes
│   ├── utils/                # Utility functions
│   │   └── serviceProxy.js   # Service proxy logic
│   └── config/               # Configuration files
├── .env.example              # Environment template
├── .env                       # Local environment (not in git)
├── package.json              # Dependencies
├── Dockerfile                # Docker configuration
└── README.md                 # Full documentation
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Service URLs (point to your microservices)
USER_SERVICE_URL=http://localhost:8001
PLAN_SERVICE_URL=http://localhost:8002
DEVICE_SERVICE_URL=http://localhost:8003
ORDER_SERVICE_URL=http://localhost:8004
PAYMENT_SERVICE_URL=http://localhost:8005

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# Logging
LOG_LEVEL=debug
```

## Common Commands

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
```

## Testing Endpoints Locally

### 1. User Service

```bash
# Register
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Doe","email":"jane@example.com","phone":"+1234567890","password":"Pass1234"}'

# Login
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"Pass1234"}'

# Get profile
curl http://localhost:8080/api/users/profile/user-123
```

### 2. Plans

```bash
# List plans
curl http://localhost:8080/api/plans

# Get specific plan
curl http://localhost:8080/api/plans/plan-1

# Create plan (admin)
curl -X POST http://localhost:8080/api/plans \
  -H "Content-Type: application/json" \
  -d '{"name":"Premium","price":79.99,"data":"Unlimited","features":["Unlimited Talk"]}'
```

### 3. Devices

```bash
# List devices
curl http://localhost:8080/api/devices

# Search devices
curl "http://localhost:8080/api/devices/search?brand=Apple&model=iPhone"

# Get device details
curl http://localhost:8080/api/devices/device-123
```

### 4. Orders

```bash
# Create order
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-123","items":[{"type":"plan","id":"plan-1","quantity":1}]}'

# Get order
curl http://localhost:8080/api/orders/order-456

# Get user orders
curl http://localhost:8080/api/orders/user/user-123
```

### 5. Payments

```bash
# Create payment
curl -X POST http://localhost:8080/api/payments \
  -H "Content-Type: application/json" \
  -d '{"orderId":"order-456","amount":899.99,"currency":"USD","paymentMethod":"card"}'

# Process payment
curl -X POST http://localhost:8080/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{"paymentIntentId":"pi-12345","cardToken":"tok_visa"}'

# Get payment details
curl http://localhost:8080/api/payments/payment-789
```

## Docker Compose Integration

The API Gateway works with the main `docker-compose.yml`:

```yaml
# In docker-compose.yml
api-gateway:
  build: ./api-gateway
  ports:
    - "8080:8080"
  environment:
    - NODE_ENV=development
    - USER_SERVICE_URL=http://user-service:8080
    - PLAN_SERVICE_URL=http://plan-service:8080
    - DEVICE_SERVICE_URL=http://device-service:8080
    - ORDER_SERVICE_URL=http://order-service:8080
    - PAYMENT_SERVICE_URL=http://payment-service:8080
  depends_on:
    - user-service
    - plan-service
    - device-service
    - order-service
    - payment-service
```

Start all services:
```bash
cd ..  # Go to project root
docker-compose up
```

## Kubernetes Deployment

Deploy to local Kubernetes:

```bash
# Development
kubectl apply -k k8s/dev/

# Production
kubectl apply -k k8s/prod/

# Check status
kubectl get pods -n development
kubectl get services -n development

# View logs
kubectl logs -f deployment/dev-api-gateway -n development

# Port forward to local machine
kubectl port-forward svc/api-gateway 8080:8080 -n development
# Then access at http://localhost:8080
```

## Debugging

### Check health
```bash
curl -v http://localhost:8080/health
```

### View logs
```bash
# Local
npm run dev

# Docker
docker logs <container-id>

# Kubernetes
kubectl logs -f pod/<pod-name> -n <namespace>
```

### Test with verbose curl
```bash
curl -v -X GET http://localhost:8080/api/plans
```

## Troubleshooting

### "Port 8080 already in use"
```bash
# Kill process using port
lsof -ti:8080 | xargs kill -9

# Or use different port
PORT=8081 npm run dev
```

### "Cannot connect to service"
- Verify service URLs in `.env`
- Check if services are running
- Test with: `curl http://service-url/health`

### "CORS error"
- Add frontend URL to `ALLOWED_ORIGINS`
- Frontend must be in the list in `.env`

### "Rate limit exceeded"
- Increase `RATE_LIMIT_MAX` in `.env`
- Wait 15 minutes or restart app

## Next Steps

1. ✅ Setup local development environment
2. ✅ Test all endpoints
3. ✅ Review ARCHITECTURE.md for design details
4. ⏳ Implement authentication middleware
5. ⏳ Add request/response caching
6. ⏳ Setup monitoring with Prometheus
7. ⏳ Deploy to staging environment

## Support

For issues:
1. Check the logs: `npm run dev`
2. Review `.env` configuration
3. Test service connectivity
4. Check [ARCHITECTURE.md](ARCHITECTURE.md) for design details
5. Open an issue on GitHub

---

**Happy Coding!** 🚀
