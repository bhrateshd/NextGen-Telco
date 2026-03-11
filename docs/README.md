# NextGen Telco Platform - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Services](#services)
5. [Development](#development)
6. [Deployment](#deployment)
7. [Contributing](#contributing)

## Project Overview

NextGen Telco is a modern telecommunications platform built with microservices architecture. It provides comprehensive management of mobile plans, devices, orders, and payments.

### Key Features
- **Mobile Plans**: Flexible pricing tiers and customizable plans
- **Device Catalog**: Extensive device inventory and specifications
- **Order Management**: Complete order lifecycle management
- **Payment Processing**: Secure payment handling
- **User Management**: Account management and authentication
- **API Gateway**: Centralized request routing and management

## Architecture

### Microservices
```
┌─────────────┐
│   Frontend  │ (HTML/CSS/JavaScript)
└──────┬──────┘
       │
┌──────▼─────────────┐
│   API Gateway      │ (Express.js)
└──────┬──────────────┘
       │
   ┌───┴────────────────────────────────────────────┐
   │                                                 │
   ▼              ▼              ▼            ▼      ▼
┌────────┐ ┌──────────┐ ┌────────────┐ ┌────────┐ ┌─────────┐
│ User   │ │ Plan     │ │ Device     │ │ Order  │ │Payment  │
│Service │ │ Service  │ │ Service    │ │Service │ │ Service │
└────────┘ └──────────┘ └────────────┘ └────────┘ └─────────┘
   │          │            │              │         │
   └──────────┴────────────┴──────────────┴─────────┘
              │
   ┌──────────▼────────────┐
   │  PostgreSQL Database  │
   └───────────────────────┘
```

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript
- **API Gateway**: Node.js + Express.js
- **Microservices**: Node.js + Express.js
- **Database**: PostgreSQL
- **Message Queue**: Apache Kafka
- **Container**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: Jenkins
- **Monitoring**: Prometheus + Grafana

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Git

### Local Development with Docker Compose
```bash
git clone <repository>
cd nextgen-telco
docker-compose up -d
```

This starts:
- Frontend: http://localhost:80
- API Gateway: http://localhost:8080
- All microservices on individual ports
- PostgreSQL database
- Kafka message broker
- Prometheus + Grafana monitoring

## Services

### 1. User Service
Manages user accounts, authentication, and profiles.

**Port**: 8081  
**Endpoints**:
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile/:userId` - Get user profile

### 2. Plan Service
Manages mobile plans and pricing.

**Port**: 8083  
**Endpoints**:
- `GET /plans` - List all plans
- `GET /plans/:planId` - Get plan details
- `POST /plans` - Create new plan

### 3. Device Service
Manages device inventory and specifications.

**Port**: 8084  
**Endpoints**:
- `GET /devices` - List all devices
- `GET /devices/:deviceId` - Get device details
- `GET /devices/search` - Search devices

### 4. Order Service
Manages customer orders.

**Port**: 8085  
**Endpoints**:
- `POST /orders` - Create order
- `GET /orders/:orderId` - Get order details
- `GET /orders/user/:userId` - Get user orders

### 5. Payment Service
Handles payment processing.

**Port**: 8086  
**Endpoints**:
- `POST /pay` - Process payment
- `POST /payments` - Create payment intent
- `GET /payments/:paymentId` - Get payment details

## Development

### Building Services
```bash
# Build all services
docker-compose build

# Build specific service
docker build -t nextgen-telco/user-service services/user-service
```

### Running Services Locally
```bash
# User Service
cd services/user-service
npm install
npm start

# API Gateway
cd api-gateway
npm install
npm start
```

### Running Tests
```bash
npm test
```

## Deployment

### Kubernetes Deployment
```bash
# Development
kubectl apply -k k8s/dev/

# Staging
kubectl apply -k k8s/staging/

# Production
kubectl apply -k k8s/prod/
```

### Jenkins Pipeline
Trigger the Jenkins pipeline to:
1. Build Docker images
2. Run tests
3. Push images to registry
4. Deploy to Kubernetes

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## API Documentation

### Base URL
```
http://api-gateway:8080/api
```

### Common Headers
```
Content-Type: application/json
Authorization: Bearer {token}
```

### Response Format
```json
{
  "status": "success|error",
  "data": {},
  "message": "Description"
}
```

## Environment Variables

### API Gateway
```
PORT=8080
USER_SERVICE_URL=http://user-service:8080
PLAN_SERVICE_URL=http://plan-service:8080
DEVICE_SERVICE_URL=http://device-service:8080
ORDER_SERVICE_URL=http://order-service:8080
PAYMENT_SERVICE_URL=http://payment-service:8080
```

## Monitoring

### Prometheus
Access at: http://localhost:9090

### Grafana
Access at: http://localhost:3000  
Default credentials: admin/admin

## Support

For issues and support: [Create an issue](https://github.com/bhrateshd/NextGen-Telco/issues)

## License

MIT License - See LICENSE file for details

---

**Last Updated**: March 12, 2026  
**Version**: 1.0.0
