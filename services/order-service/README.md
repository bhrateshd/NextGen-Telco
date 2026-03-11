# Order Service

**Port**: 3005  
**Purpose**: Order management and fulfillment tracking

## Overview

The Order Service handles all order operations including:
- Order creation and placement
- Order status tracking
- Order retrieval and history
- Order updates and cancellations

## API Endpoints

### Create Order
```bash
POST /
Content-Type: application/json

{
  "userId": "user-123",
  "items": [
    {
      "planId": "plan-premium",
      "deviceId": "device-iphone-14",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}

Response:
{
  "status": "success",
  "data": {
    "orderId": "order-xxx",
    "userId": "user-123",
    "items": [ ... ],
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Order Details
```bash
GET /:orderId

Response:
{
  "status": "success",
  "data": {
    "orderId": "order-xxx",
    "userId": "user-123",
    "items": [ ... ],
    "status": "pending",
    "totalAmount": 999.99,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get User Orders
```bash
GET /user/:userId

Response:
{
  "status": "success",
  "data": [ ... array of user orders ... ],
  "count": 3
}
```

### Update Order
```bash
PUT /:orderId
Content-Type: application/json

{
  "status": "processing",
  "items": [ ... updated items ... ]
}

Response:
{
  "status": "success",
  "data": { ... updated order ... }
}
```

### Cancel Order
```bash
DELETE /:orderId

Response:
{
  "status": "success",
  "message": "Order cancelled"
}
```

## Order Status Flow

- **pending** → **processing** → **shipped** → **delivered**
- **pending** → **cancelled** (anytime)

## Health Checks

- **GET /health** - Service health status
- **GET /ready** - Service readiness check

## Environment Variables

```env
PORT=3005
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/nextgen_orders
```

## Local Development

```bash
cd services/order-service
npm install
npm run dev
```

## Docker

```bash
docker build -t nextgen-telco/order-service .
docker run -p 3005:3005 nextgen-telco/order-service
```

## Kubernetes

```bash
kubectl apply -f k8s/base/order-service.yaml
```
