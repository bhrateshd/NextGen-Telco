# NextGen Telco - API Documentation

## Authentication

All API requests require authentication via JWT token in the Authorization header.

```
Authorization: Bearer <token>
```

## User Service API

### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123"
}
```

**Response (201)**:
```json
{
  "status": "success",
  "data": {
    "userId": "user-123",
    "email": "john@example.com",
    "token": "eyJhbGc..."
  }
}
```

### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### Get User Profile
```http
GET /api/users/profile/user-123
Authorization: Bearer <token>
```

## Plan Service API

### List All Plans
```http
GET /api/plans
```

**Response (200)**:
```json
{
  "status": "success",
  "data": [
    {
      "planId": "plan-1",
      "name": "Unlimited Basic",
      "price": 45,
      "data": "2GB",
      "features": ["Unlimited Talk", "Unlimited Text"]
    }
  ]
}
```

### Get Plan Details
```http
GET /api/plans/plan-1
```

## Device Service API

### List All Devices
```http
GET /api/devices
```

### Get Device Details
```http
GET /api/devices/device-123
```

### Search Devices
```http
GET /api/devices/search?query=iPhone&brand=Apple
```

## Order Service API

### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-123",
  "items": [
    {
      "type": "plan",
      "id": "plan-1",
      "quantity": 1
    },
    {
      "type": "device",
      "id": "device-123",
      "quantity": 1
    }
  ]
}
```

### Get Order Details
```http
GET /api/orders/order-456
Authorization: Bearer <token>
```

## Payment Service API

### Create Payment Intent
```http
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order-456",
  "amount": 799,
  "currency": "USD",
  "paymentMethod": "card"
}
```

### Process Payment
```http
POST /api/payments/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntentId": "intent-789",
  "cardToken": "tok_visa"
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Description of error",
  "details": {}
}
```

### Common Error Codes
- `INVALID_REQUEST` - Invalid request parameters
- `AUTHENTICATION_FAILED` - Invalid credentials
- `UNAUTHORIZED` - Missing or invalid token
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

## Rate Limiting

API requests are rate-limited to:
- **Unauthenticated**: 100 requests/hour per IP
- **Authenticated**: 1000 requests/hour per user

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

For more details, visit: `/docs/API-REFERENCE.md`
