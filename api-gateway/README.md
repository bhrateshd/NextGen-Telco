# NextGen Telco API Gateway

Central API Gateway for routing frontend requests to all microservices in the NextGen Telco platform.

## Overview

The API Gateway is the single entry point for all client requests. It provides:

- **Request Routing**: Intelligently routes requests to appropriate microservices
- **Load Balancing**: Distributes requests across service instances
- **Request Validation**: Validates incoming requests before forwarding
- **Error Handling**: Centralized error handling and response formatting
- **Rate Limiting**: Protects services from overload
- **Security**: CORS, security headers, input validation
- **Logging**: Comprehensive request/response logging
- **Service Discovery**: Automatic service endpoint discovery

## Architecture

```
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │ HTTP
       ▼
┌──────────────────────────────┐
│   API Gateway (Port 8080)    │
├──────────────────────────────┤
│ ✓ Request Validation         │
│ ✓ Authentication/Auth Check  │
│ ✓ Rate Limiting              │
│ ✓ Request Logging            │
│ ✓ Error Handling             │
└──────┬──────────────────────┬┬─────────────┬───────────────┐
       │ /api/users           ││ /api/plans  │ /api/devices  │ /api/orders   /api/payments
       ▼                      ▼▼             ▼               ▼               ▼
  ┌──────────────┐      ┌──────────────┐ ┌───────────────┐ ┌───────────────┐ ┌─────────────┐
  │User Service  │      │Plan Service  │ │Device Service │ │Order Service  │ │Payment Svc  │
  │:8080         │      │:8080         │ │:8080          │ │:8080          │ │:8080        │
  └──────────────┘      └──────────────┘ └───────────────┘ └───────────────┘ └─────────────┘
```

## API Endpoints

### Health Checks

#### GET /health
Returns the health status of the API Gateway.

```bash
curl http://localhost:8080/health
```

Response:
```json
{
  "status": "healthy",
  "service": "api-gateway",
  "timestamp": "2026-03-12T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

#### GET /ready
Returns readiness status and connected microservices.

```bash
curl http://localhost:8080/ready
```

### User Service Routes

#### POST /api/users/register
Register a new user.

```bash
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

#### POST /api/users/login
Authenticate user.

```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

#### GET /api/users/profile/:userId
Get user profile.

```bash
curl http://localhost:8080/api/users/profile/user-123
```

### Plan Service Routes

#### GET /api/plans
List all available plans.

```bash
curl http://localhost:8080/api/plans
```

#### GET /api/plans/:planId
Get specific plan details.

```bash
curl http://localhost:8080/api/plans/plan-1
```

#### POST /api/plans
Create new plan (admin only).

```bash
curl -X POST http://localhost:8080/api/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Plan",
    "price": 79.99,
    "data": "Unlimited",
    "features": ["Unlimited Talk", "Unlimited Text"]
  }'
```

### Device Service Routes

#### GET /api/devices
List all devices.

```bash
curl http://localhost:8080/api/devices
```

#### GET /api/devices/search
Search devices with filters.

```bash
curl "http://localhost:8080/api/devices/search?brand=Apple&model=iPhone"
```

#### GET /api/devices/:deviceId
Get device details.

```bash
curl http://localhost:8080/api/devices/device-123
```

### Order Service Routes

#### POST /api/orders
Create new order.

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-456",
    "items": [
      {"type": "plan", "id": "plan-1", "quantity": 1},
      {"type": "device", "id": "device-123", "quantity": 1}
    ]
  }'
```

#### GET /api/orders/:orderId
Get order details.

```bash
curl http://localhost:8080/api/orders/order-789
```

#### GET /api/orders/user/:userId
Get all user orders.

```bash
curl http://localhost:8080/api/orders/user/user-456
```

### Payment Service Routes

#### POST /api/payments
Create payment intent.

```bash
curl -X POST http://localhost:8080/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-789",
    "amount": 899.99,
    "currency": "USD",
    "paymentMethod": "card"
  }'
```

#### POST /api/payments/process
Process payment.

```bash
curl -X POST http://localhost:8080/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "paymentIntentId": "pi-12345",
    "cardToken": "tok_visa"
  }'
```

## Installation

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

1. Clone the repository
```bash
git clone <repo-url>
cd api-gateway
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the gateway
```bash
npm start
```

For development with hot-reload:
```bash
npm run dev
```

## Configuration

Environment variables in `.env`:

```env
# Server
PORT=8080
NODE_ENV=development

# Service URLs
USER_SERVICE_URL=http://user-service:8080
PLAN_SERVICE_URL=http://plan-service:8080
DEVICE_SERVICE_URL=http://device-service:8080
ORDER_SERVICE_URL=http://order-service:8080
PAYMENT_SERVICE_URL=http://payment-service:8080

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

## Features

### Request Validation
- Validates Content-Type for POST/PUT/PATCH requests
- Enforces maximum request body size (10MB)
- Validates required fields for each endpoint

### Rate Limiting
- 100 requests per 15 minutes per IP (configurable)
- Returns 429 status when limit exceeded
- Includes rate limit headers in responses

### Error Handling
- Centralized error handling
- Consistent error response format
- Request IDs for error tracking
- Detailed logs for debugging

### Security
- CORS configuration
- Helmet security headers
- Request body size limits
- Input validation
- Service endpoint verification

### Logging
- Request/response logging
- Performance metrics (response time)
- Error logging with stack traces
- Unique request IDs for tracing

## Request/Response Format

### Successful Response

```json
{
  "status": "success",
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "requestId": "5f3c4cf5-8e2a-4b9c-a0d1-2e3f4g5h6i7j",
  "timestamp": "2026-03-12T10:30:00.000Z"
}
```

### Error Response

```json
{
  "status": "error",
  "code": "INVALID_REQUEST",
  "message": "Missing required field: email",
  "requestId": "5f3c4cf5-8e2a-4b9c-a0d1-2e3f4g5h6i7j",
  "timestamp": "2026-03-12T10:30:00.000Z"
}
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t nextgen-telco/api-gateway:latest .
```

### Run with Docker Compose

```bash
docker-compose up api-gateway
```

### Run in Kubernetes

```bash
kubectl apply -f k8s/base/api-gateway/
```

## Debugging

### View Logs

```bash
# Local development
npm run dev

# Docker container
docker logs <container-id>

# Kubernetes pod
kubectl logs <pod-name>
```

### Health Check

```bash
curl http://localhost:8080/health
curl http://localhost:8080/ready
```

### Test Service Connectivity

```bash
# From inside container
curl http://user-service:8080/health
curl http://plan-service:8080/health
```

## Performance

- Response Time: < 100ms (p99)
- Throughput: 1000+ requests/sec
- Concurrent Connections: 10,000+
- Memory Usage: ~100MB
- CPU Usage: < 2% idle

## Troubleshooting

### Services Unavailable

Error: `Service is unavailable`

**Solution:**
- Verify service URLs in `.env`
- Check if microservices are running
- Verify network connectivity between gateway and services

### Rate Limit Exceeded

Error: `Too many requests`

**Solution:**
- Increase `RATE_LIMIT_MAX` in `.env`
- Implement client-side request batching
- Use exponential backoff in client

### CORS Errors

Error: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
- Add frontend URL to `ALLOWED_ORIGINS` in `.env`
- Verify CORS configuration

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Run tests: `npm test`
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request

## License

MIT License - See LICENSE file

---

**Last Updated**: March 12, 2026  
**Version**: 1.0.0  
**Maintainer**: NextGen Telco Team
