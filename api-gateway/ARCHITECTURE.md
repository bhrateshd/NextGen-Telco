# API Gateway Architecture & Design Document

## Overview

The API Gateway is the central entry point for all client requests to the NextGen Telco platform. It abstracts the underlying microservices architecture from clients and provides a unified interface for accessing all platform services.

## Key Responsibilities

The API Gateway handles:

1. **Request Routing** - Routes requests to appropriate microservices
2. **Request Validation** - Validates input data before forwarding
3. **Authentication/Authorization** - Verifies user tokens and permissions
4. **Rate Limiting** - Protects services from overload
5. **Error Handling** - Standardizes error responses
6. **Request Logging** - Logs all requests for monitoring
7. **Service Discovery** - Discovers and routes to microservice instances
8. **Resilience** - Handles service failures gracefully

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Application                      │
│              (Web Browser - HTML/CSS/JavaScript)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/HTTPS Requests
                             │ (All API calls routed here)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Port 8080)                     │
├─────────────────────────────────────────────────────────────────┤
│ Middleware Stack:                                               │
│  ├─ Security (Helmet, CORS)                                    │
│  ├─ Request Validation                                         │
│  ├─ Authentication/Authorization                               │
│  ├─ Rate Limiting                                              │
│  ├─ Request Logging                                            │
│  ├─ Error Handling                                             │
│  └─ Response Formatting                                        │
│                                                                 │
│ Route Handler:                                                  │
│  ├─ /api/users      → User Service                             │
│  ├─ /api/plans      → Plan Service                             │
│  ├─ /api/devices    → Device Service                           │
│  ├─ /api/orders     → Order Service                            │
│  └─ /api/payments   → Payment Service                          │
└──┬─────┬──────────┬──────────┬─────────┬──────────────────────┘
   │     │          │          │         │
   ▼     ▼          ▼          ▼         ▼
 ┌─────────┐  ┌───────────┐  ┌────────────┐  ┌───────────┐  ┌──────┐
 │  User   │  │  Plan     │  │  Device    │  │ Order     │  │Payment│
 │ Service │  │ Service   │  │  Service   │  │ Service   │  │Svc    │
 └─────────┘  └───────────┘  └────────────┘  └───────────┘  └──────┘
   :8080        :8080         :8080           :8080           :8080
```

## Request Flow

1. **Client Request** → Sent to API Gateway
2. **CORS Check** → Validate origin
3. **Request Validation** → Validate Content-Type, body size
4. **Rate Limiting** → Check request count
5. **Authentication** → Verify JWT token (if required)
6. **Route Matching** → Determine target microservice
7. **Service Proxy** → Forward to microservice with headers
8. **Response** → Return response with status/data
9. **Logging** → Log request/response details

## Service Routes

### User Service (`/api/users`)
- `POST /register` - Register new user
- `POST /login` - Authenticate user
- `GET /profile/:userId` - Get user profile
- `PUT /profile/:userId` - Update user profile
- `GET /:userId` - Get user details

### Plan Service (`/api/plans`)
- `GET /` - List all plans
- `GET /:planId` - Get plan details
- `POST /` - Create plan (admin)
- `PUT /:planId` - Update plan
- `DELETE /:planId` - Delete plan

### Device Service (`/api/devices`)
- `GET /` - List devices
- `GET /search` - Search devices
- `GET /:deviceId` - Get device details
- `POST /` - Create device (admin)
- `PUT /:deviceId` - Update device

### Order Service (`/api/orders`)
- `POST /` - Create order
- `GET /:orderId` - Get order details
- `GET /user/:userId` - Get user orders
- `PUT /:orderId` - Update order
- `DELETE /:orderId` - Cancel order

### Payment Service (`/api/payments`)
- `POST /` - Create payment intent
- `POST /process` - Process payment
- `GET /:paymentId` - Get payment details
- `POST /:paymentId/refund` - Refund payment

## Middleware Stack

### 1. Security Middleware
- **Helmet**: Sets security HTTP headers
- **CORS**: Validates cross-origin requests
- Input sanitization

### 2. Request Logger
- Logs request method, path, status
- Tracks response time
- Error logging with stack traces

### 3. Rate Limiter
- 100 requests per 15 minutes per IP
- Configurable limits per environment
- Returns 429 status when exceeded

### 4. Request Validator
- Validates Content-Type headers
- Enforces request body size limits (10MB)
- Validates required fields

### 5. Error Handler
- Catches all errors
- Standardizes error responses
- Returns appropriate HTTP status codes

## Environment-Specific Configuration

### Development
```
PORT=8080
NODE_ENV=development
LOG_LEVEL=debug
RATE_LIMIT_MAX=100
Replicas: 1
Resources: 64Mi memory, 50m CPU
Image Pull: Always
```

### Testing
```
PORT=8080
NODE_ENV=test
LOG_LEVEL=info
RATE_LIMIT_MAX=100
Replicas: 1
Resources: 128Mi memory, 100m CPU
Image Pull: Always
```

### Staging
```
PORT=8080
NODE_ENV=staging
LOG_LEVEL=info
RATE_LIMIT_MAX=500
Replicas: 2
Resources: 128Mi memory, 200m CPU
Image Pull: IfNotPresent
```

### Production
```
PORT=8080
NODE_ENV=production
LOG_LEVEL=warn
RATE_LIMIT_MAX=1000
Replicas: 3
Resources: 256Mi memory, 500m CPU
Image Pull: IfNotPresent
Pod Anti-Affinity: Enabled
```

## Resilience Features

### Circuit Breaker
- Detects unavailable services
- Returns 503 SERVICE_UNAVAILABLE
- Prevents cascading failures

### Timeout Handling
- 30-second request timeout
- Graceful error responses
- Prevents resource exhaustion

### Graceful Shutdown
- Handles SIGTERM/SIGINT
- Completes in-flight requests
- Cleanly closes connections

## Monitoring & Observability

### Health Checks
- `GET /health` - Returns gateway health status
- `GET /ready` - Returns readiness with service list

### Logging
- Request/response logging
- Performance metrics (response times)
- Error tracking with request IDs
- Structured logs for analysis

### Metrics
- Request count per endpoint
- Response time percentiles (p50, p90, p99)
- Error rates by service
- Rate limit violations

## Security Considerations

1. **CORS**: Only allows configured origins
2. **Headers**: Security headers set by Helmet
3. **Input Validation**: Validates all requests
4. **Rate Limiting**: Protects from DDoS
5. **Error Messages**: Doesn't leak sensitive info
6. **HTTPS**: Should be enforced in production via Ingress/Load Balancer

## Deployment

### Local Development
```bash
npm install
npm run dev
```

### Docker
```bash
docker build -t nextgen-telco/api-gateway .
docker run -p 8080:8080 nextgen-telco/api-gateway
```

### Kubernetes
```bash
kubectl apply -k k8s/base/api-gateway/  # Base config
kubectl apply -k k8s/prod/api-gateway/  # Production overlay
```

## Performance Targets

- **Response Time**: < 100ms (p99)
- **Throughput**: 1000+ requests/sec
- **Concurrent Connections**: 10,000+
- **Memory**: ~100MB
- **CPU**: < 2% idle
- **Availability**: 99.95% uptime

## Future Enhancements

1. **API Versioning**: Support multiple API versions
2. **GraphQL Support**: Alternative to REST
3. **Caching**: Response caching for read operations
4. **Authentication**: OAuth2/JWT integration
5. **API Analytics**: Request/response analytics
6. **Service Mesh**: Istio/Linkerd integration
7. **WebSocket Support**: Real-time subscriptions
8. **Batch Operations**: Handle multiple requests

## Troubleshooting

### Service Unavailable
- Check service URLs in environment variables
- Verify microservices are running
- Check network connectivity

### High Latency
- Monitor microservice health
- Check database performance
- Review request payload sizes

### Rate Limiting Issues
- Adjust RATE_LIMIT_MAX
- Implement exponential backoff on client
- Use request batching

---

**Last Updated**: March 12, 2026  
**Version**: 1.0.0
