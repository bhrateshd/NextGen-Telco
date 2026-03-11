# Auth Service

**Port**: 3001  
**Purpose**: JWT token generation, validation, and refresh

## Overview

The Auth Service is responsible for handling all authentication operations including:
- JWT token generation with custom claims
- Token validation and verification
- Token refresh functionality
- Password hashing using bcryptjs

## API Endpoints

### Generate Token
```bash
POST /auth/token
Content-Type: application/json

{
  "userId": "user-123",
  "email": "user@example.com",
  "role": "user"
}

Response:
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

### Verify Token
```bash
POST /auth/verify
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "status": "success",
  "valid": true,
  "payload": {
    "userId": "user-123",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Refresh Token
```bash
POST /auth/refresh
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

### Hash Password
```bash
POST /auth/hash
Content-Type: application/json

{
  "password": "user-password-123"
}

Response:
{
  "status": "success",
  "hash": "$2a$10$..."
}
```

## Health Checks

- **GET /health** - Service health status
- **GET /ready** - Service readiness check

## Environment Variables

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h
```

## Local Development

```bash
cd services/auth-service
npm install
npm run dev
```

## Docker

```bash
docker build -t nextgen-telco/auth-service .
docker run -p 3001:3001 nextgen-telco/auth-service
```

## Kubernetes

```bash
kubectl apply -f k8s/base/auth-service.yaml
```
