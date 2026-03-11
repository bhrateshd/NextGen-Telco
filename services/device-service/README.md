# Device Service

**Port**: 3004  
**Purpose**: Device catalog and inventory management

## Overview

The Device Service manages the device catalog including:
- Device listing and search
- Device specifications and details
- Device inventory management
- Price and availability tracking

## API Endpoints

### List All Devices
```bash
GET /

Response:
{
  "status": "success",
  "data": [
    {
      "deviceId": "device-iphone-14",
      "name": "iPhone 14",
      "brand": "Apple",
      "model": "iPhone 14",
      "price": 799.99,
      "specs": {
        "storage": "128GB",
        "ram": "6GB",
        "screen": "6.1\""
      },
      "inStock": true,
      "quantity": 50
    }
  ],
  "count": 3
}
```

### Search Devices
```bash
GET /search?brand=Apple&maxPrice=1000

Response:
{
  "status": "success",
  "data": [ ... filtered devices ... ],
  "count": 2
}
```

### Get Device Details
```bash
GET /:deviceId

Response:
{
  "status": "success",
  "data": {
    "deviceId": "device-iphone-14",
    "name": "iPhone 14",
    "brand": "Apple",
    "model": "iPhone 14",
    "price": 799.99,
    "specs": { ... },
    "inStock": true,
    "quantity": 50
  }
}
```

### Create Device
```bash
POST /
Content-Type: application/json

{
  "name": "Samsung Galaxy S24",
  "brand": "Samsung",
  "model": "Galaxy S24",
  "price": 999.99,
  "specs": {
    "storage": "512GB",
    "ram": "12GB",
    "screen": "6.2\"",
    "processor": "Snapdragon 8 Gen 3"
  }
}

Response:
{
  "status": "success",
  "data": { ... new device ... }
}
```

## Health Checks

- **GET /health** - Service health status
- **GET /ready** - Service readiness check

## Environment Variables

```env
PORT=3004
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/nextgen_devices
```

## Local Development

```bash
cd services/device-service
npm install
npm run dev
```

## Docker

```bash
docker build -t nextgen-telco/device-service .
docker run -p 3004:3004 nextgen-telco/device-service
```

## Kubernetes

```bash
kubectl apply -f k8s/base/device-service.yaml
```
