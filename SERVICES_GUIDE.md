# Microservices Architecture - Getting Started

This guide covers the 5 microservices that power the NextGen Telco platform.

## Services Overview

| Service | Port | Purpose |
|---------|------|---------|
| **auth-service** | 3001 | JWT token generation and validation |
| **user-service** | 3002 | User management and profiles |
| **plan-service** | 3003 | Mobile plan catalog |
| **device-service** | 3004 | Device inventory and catalog |
| **order-service** | 3005 | Order management and tracking |
| **payment-service** | 3006 | Payment processing |

## Quick Start - Docker Compose

Run all services locally with a single command:

```bash
docker-compose up -d
```

This starts:
- All 6 microservices
- API Gateway (reverse proxy)
- Frontend
- PostgreSQL database
- Redis cache

## Health Check All Services

```bash
# Auth Service
curl http://localhost:3001/health

# User Service
curl http://localhost:3002/health

# Plan Service
curl http://localhost:3003/health

# Device Service
curl http://localhost:3004/health

# Order Service
curl http://localhost:3005/health

# Payment Service
curl http://localhost:3006/health

# API Gateway
curl http://localhost:8080/health
```

## Manual Service Startup

### Start Individual Service

```bash
cd services/auth-service
npm install
npm run dev
```

Repeat for each service directory.

## Build Docker Images

```bash
# Build all service images
docker-compose build

# Or build individual service
docker build -t nextgen-telco/auth-service services/auth-service/
```

## Kubernetes Deployment

### Deploy Base Infrastructure

```bash
kubectl apply -f k8s/base/auth-service.yaml
kubectl apply -f k8s/base/user-service.yaml
kubectl apply -f k8s/base/plan-service.yaml
kubectl apply -f k8s/base/device-service.yaml
kubectl apply -f k8s/base/order-service.yaml
kubectl apply -f k8s/base/payment-service.yaml
```

### Deploy with Environment Overlays

**Development:**
```bash
kubectl apply -k k8s/dev/services/
```

**Test:**
```bash
kubectl apply -k k8s/test/services/
```

**Staging:**
```bash
kubectl apply -k k8s/staging/services/
```

**Production:**
```bash
kubectl apply -k k8s/prod/services/
```

## Environment Configuration

Each service has a `.env.example` file. Copy and customize:

```bash
cp services/auth-service/.env.example services/auth-service/.env
```

## Testing

### Test Auth Service API

```bash
# Generate token
curl -X POST http://localhost:3001/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "email": "user@example.com",
    "role": "user"
  }'

# Verify token
curl -X POST http://localhost:3001/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-token-here"
  }'
```

### Test User Service API

```bash
# Register user
curl -X POST http://localhost:3002/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userId": "user-123"
  }'

# Get user profile
curl http://localhost:3002/profile/user-123
```

### Test Plan Service API

```bash
# List plans
curl http://localhost:3003/

# Get plan details
curl http://localhost:3003/plan-basic
```

### Test Device Service API

```bash
# List devices
curl http://localhost:3004/

# Search devices
curl "http://localhost:3004/search?brand=Apple&maxPrice=1000"
```

### Test Order Service API

```bash
# Create order
curl -X POST http://localhost:3005/ \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "items": [{"planId": "plan-basic", "deviceId": "device-iphone-14"}]
  }'

# Get user orders
curl http://localhost:3005/user/user-123
```

### Test Payment Service API

```bash
# Create payment intent
curl -X POST http://localhost:3006/ \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-123",
    "amount": 999.99,
    "currency": "USD"
  }'

# Process payment
curl -X POST http://localhost:3006/process \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay-xxx",
    "cardToken": "tok_visa"
  }'
```

## CI/CD Pipeline

The Jenkins pipeline automatically:

1. **Build** - Compiles and packages each service
2. **Test** - Runs unit tests in parallel
3. **Docker** - Builds Docker images for each service
4. **Push** - Pushes images to registry
5. **Deploy** - Deploys to appropriate environment
   - `master` branch → Development
   - `develop` branch → Test
   - `v*` tags → Staging & Production

## Troubleshooting

### Service Not Responding

```bash
# Check service logs
docker logs auth-service

# Inside Kubernetes
kubectl logs deployment/auth-service -n nextgen-prod
```

### Database Connection Issues

```bash
# Verify PostgreSQL is running
docker exec nextgen-postgres psql -U postgres -c "SELECT 1"

# Check connection from service
docker exec auth-service ping postgres
```

### Port Conflicts

```bash
# Find what's using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Port 80)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               API Gateway (Port 8080)                        │
│          Routing, Auth, Rate Limiting, Logging              │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────┬───────┬───┼────┬──────────┬──────────┐
        │      │       │   │    │          │          │
        ▼      ▼       ▼   ▼    ▼          ▼          ▼
    ┌─────┐┌─────┐┌───────┐┌────────┐┌───────┐┌────────┐
    │Auth ││User ││ Plan  ││Device  ││Order  ││Payment │
    │:3001││:3002││:3003  ││:3004   ││:3005  ││:3006   │
    └─────┘└─────┘└───────┘└────────┘└───────┘└────────┘
        │      │       │       │        │          │
        └──────┴───────┴───────┴────────┴──────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  PostgreSQL  │
                    │   (Port      │
                    │    5432)     │
                    └──────────────┘
```

## Next Steps

1. **Database Migrations** - Set up PostgreSQL schemas
2. **Authentication** - Implement JWT middleware
3. **API Documentation** - Generate OpenAPI specs
4. **Testing** - Write integration tests
5. **Monitoring** - Set up Prometheus/Grafana

Each service has its own README with detailed API documentation.
