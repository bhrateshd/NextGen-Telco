# User Service

**Port**: 3002  
**Purpose**: User management, profile operations, and account handling

## Overview

The User Service manages all user-related operations including:
- User registration and profile creation
- Profile retrieval and updates
- User account management
- User data persistence

## API Endpoints

### Register User
```bash
POST /register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "userId": "user-123"
}

Response:
{
  "status": "success",
  "data": {
    "userId": "user-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get User Profile
```bash
GET /profile/:userId

Response:
{
  "status": "success",
  "data": {
    "userId": "user-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

### Update User Profile
```bash
PUT /profile/:userId
Content-Type: application/json

{
  "firstName": "Jane",
  "phone": "+0987654321"
}

Response:
{
  "status": "success",
  "data": {
    "userId": "user-123",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+0987654321",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

### Get User Details
```bash
GET /:userId

Response:
{
  "status": "success",
  "data": { ... user object ... }
}
```

## Health Checks

- **GET /health** - Service health status
- **GET /ready** - Service readiness check

## Environment Variables

```env
PORT=3002
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/nextgen_users
```

## Local Development

```bash
cd services/user-service
npm install
npm run dev
```

## Docker

```bash
docker build -t nextgen-telco/user-service .
docker run -p 3002:3002 nextgen-telco/user-service
```

## Kubernetes

```bash
kubectl apply -f k8s/base/user-service.yaml
```
