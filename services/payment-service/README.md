# Payment Service

**Port**: 3006  
**Purpose**: Payment processing and transaction management

## Overview

The Payment Service handles all payment operations including:
- Payment intent creation
- Payment processing with card tokens
- Payment status tracking
- Refund management

## API Endpoints

### Create Payment Intent
```bash
POST /
Content-Type: application/json

{
  "orderId": "order-123",
  "amount": 999.99,
  "currency": "USD",
  "userId": "user-123"
}

Response:
{
  "status": "success",
  "data": {
    "paymentId": "pay-xxx",
    "orderId": "order-123",
    "amount": 999.99,
    "currency": "USD",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Process Payment
```bash
POST /process
Content-Type: application/json

{
  "paymentId": "pay-xxx",
  "cardToken": "tok_visa"
}

Response:
{
  "status": "success",
  "data": {
    "paymentId": "pay-xxx",
    "status": "completed",
    "transactionId": "txn-xxx",
    "processedAt": "2024-01-01T00:05:00Z"
  }
}
```

### Get Payment Details
```bash
GET /:paymentId

Response:
{
  "status": "success",
  "data": {
    "paymentId": "pay-xxx",
    "orderId": "order-123",
    "amount": 999.99,
    "currency": "USD",
    "status": "completed",
    "transactionId": "txn-xxx"
  }
}
```

### Request Refund
```bash
POST /:paymentId/refund
Content-Type: application/json

{
  "reason": "Customer requested"
}

Response:
{
  "status": "success",
  "data": {
    "paymentId": "pay-xxx",
    "status": "refunded",
    "refundId": "ref-xxx",
    "refundReason": "Customer requested",
    "refundedAt": "2024-01-01T00:10:00Z"
  }
}
```

## Payment Status Flow

- **pending** → **completed**
- **pending** → **failed**
- **completed** → **refunded**

## Health Checks

- **GET /health** - Service health status
- **GET /ready** - Service readiness check

## Environment Variables

```env
PORT=3006
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/nextgen_payments
STRIPE_API_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

## Local Development

```bash
cd services/payment-service
npm install
npm run dev
```

## Docker

```bash
docker build -t nextgen-telco/payment-service .
docker run -p 3006:3006 nextgen-telco/payment-service
```

## Kubernetes

```bash
kubectl apply -f k8s/base/payment-service.yaml
```

## Integration with Stripe

The Payment Service integrates with Stripe for production payment processing. Configure your Stripe keys in environment variables.
