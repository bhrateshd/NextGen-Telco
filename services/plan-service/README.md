# Plan Service

**Port**: 3003  
**Purpose**: Mobile plan catalog management and CRUD operations

## Overview

The Plan Service manages the mobile plan catalog including:
- Plan listing and search
- Plan details retrieval
- Plan creation and management
- Pricing and feature management

## API Endpoints

### List All Plans
```bash
GET /

Response:
{
  "status": "success",
  "data": [
    {
      "planId": "plan-basic",
      "name": "Basic Plan",
      "price": 29.99,
      "data": "2GB",
      "talk": "500 min",
      "text": "Unlimited",
      "features": ["Caller ID", "Call Waiting"]
    }
  ],
  "count": 3
}
```

### Get Plan Details
```bash
GET /:planId

Response:
{
  "status": "success",
  "data": {
    "planId": "plan-basic",
    "name": "Basic Plan",
    "price": 29.99,
    "data": "2GB",
    "talk": "500 min",
    "text": "Unlimited",
    "features": ["Caller ID", "Call Waiting"]
  }
}
```

### Create Plan
```bash
POST /
Content-Type: application/json

{
  "name": "Executive Plan",
  "price": 99.99,
  "data": "Unlimited",
  "talk": "Unlimited",
  "text": "Unlimited",
  "features": ["Priority Support", "International Calling"]
}

Response:
{
  "status": "success",
  "data": {
    "planId": "plan-xxx",
    "name": "Executive Plan",
    "price": 99.99,
    ...
  }
}
```

## Health Checks

- **GET /health** - Service health status
- **GET /ready** - Service readiness check

## Environment Variables

```env
PORT=3003
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/nextgen_plans
```

## Local Development

```bash
cd services/plan-service
npm install
npm run dev
```

## Docker

```bash
docker build -t nextgen-telco/plan-service .
docker run -p 3003:3003 nextgen-telco/plan-service
```

## Kubernetes

```bash
kubectl apply -f k8s/base/plan-service.yaml
```
