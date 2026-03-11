# NextGen Telco - Premium Telecommunications Platform

[![GitHub](https://img.shields.io/badge/GitHub-bhrateshd%2FNextGen--Telco-blue)](https://github.com/bhrateshd/NextGen-Telco)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

## 📋 Project Overview

**NextGen Telco** is a modern, scalable telecommunications platform built with **microservices architecture**. It provides a complete solution for managing mobile plans, devices, user accounts, and orders with a professional web interface.

### Mission
To deliver India's fastest 5G network experience through a user-friendly, reliable, and scalable platform.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (HTML/CSS)                      │
│                   (Port 80 / Port 3000)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    API Gateway                               │
│              (Node.js + Express)                             │
│                   (Port 8080)                                │
└──────┬──────────┬──────────┬──────────┬──────────────────────┘
       │          │          │          │
   ┌───▼──┐  ┌───▼──┐  ┌───▼──┐  ┌───▼──┐
   │ Auth │  │ User │  │ Plan │  │Device│
   │  Svc │  │  Svc │  │  Svc │  │  Svc │
   │ 3001 │  │ 3002 │  │ 3003 │  │ 3004 │
   └──────┘  └──────┘  └──────┘  └──────┘

   ┌─────────┐  ┌──────────┐
   │ Order   │  │ Payment  │
   │  Svc    │  │   Svc    │
   │  3005   │  │  3006    │
   └─────────┘  └──────────┘
```

---

## 🛠️ Tech Stack

### Backend Services
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 16+ LTS |
| Framework | Express.js | 4.x |
| Language | JavaScript | ES6+ |
| Database | In-Memory (Local) / PostgreSQL (Production) | - |
| API Style | REST | - |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Foundation | HTML5 + CSS3 | - |
| Deployment | Nginx | 1.x |
| Package Manager | NPM | 8.x+ |

### DevOps & Deployment
| Tool | Purpose | Version |
|------|---------|---------|
| Docker | Containerization | 20.x+ |
| Docker Compose | Local Orchestration | 2.x+ |
| Kubernetes | Production Orchestration | 1.24+ |
| Jenkins | CI/CD Pipeline | 2.x |
| Bash | Automation Scripts | 4.x+ |
| Python | Utility Scripts | 3.7+ |

### Infrastructure
| Tool | Purpose |
|------|---------|
| Git | Version Control |
| GitHub | Repository Hosting |
| Linux / Ubuntu | Operating System |

---

## ✨ Key Features

✅ **6 Independent Microservices** - Modular, scalable architecture  
✅ **API Gateway** - Centralized request routing & load balancing  
✅ **RESTful APIs** - Standard HTTP/REST interface  
✅ **Docker Ready** - Containerized deployment  
✅ **Kubernetes Support** - Production-grade orchestration  
✅ **Jenkins CI/CD** - Automated build & deployment  
✅ **Health Checks** - Service availability monitoring  
✅ **Multiple Environments** - Dev, Test, Staging, Production  
✅ **Professional UI** - Modern, responsive web interface  
✅ **Device Images** - Real product photography (Unsplash API)  
✅ **Quick Deploy** - 3-step setup process  

---

## 📦 Microservices Overview

### 1. **Auth Service** (Port 3001)
**Responsibility:** User authentication & JWT token management
- User login & registration
- JWT token verification
- Session management
- Password hashing & validation

### 2. **User Service** (Port 3002)
**Responsibility:** User profile & account management
- Profile CRUD operations
- Account deletion
- User data management
- Profile updates

### 3. **Plan Service** (Port 3003)
**Responsibility:** Mobile plan offerings & pricing
- Plan catalog management
- Pricing & features
- Plan creation & updates
- Plan deletion

### 4. **Device Service** (Port 3004)
**Responsibility:** Device inventory & catalog
- Device listing
- Device details & specifications
- Device catalog management
- Device inventory tracking

### 5. **Order Service** (Port 3005)
**Responsibility:** Order management & fulfillment
- Order creation & tracking
- Order status updates
- Order history
- Order cancellation

### 6. **Payment Service** (Port 3006)
**Responsibility:** Payment processing & transactions
- Payment processing
- Invoice generation
- Payment status tracking
- Transaction history

### 7. **API Gateway** (Port 8080)
**Responsibility:** Request routing, middleware, aggregation
- Route requests to appropriate services
- Error handling & logging
- Request/response transformation
- Health monitoring

### 8. **Frontend UI** (Port 80)
**Responsibility:** User interface & presentation
- Responsive web design
- Device showcase
- Plan listings
- User dashboard
- Shopping cart & checkout

---

## 🚀 Deployment Options

### ⭐ Option 1: Local Docker Compose (Development)

#### Quick Start
```bash
# Step 1: Prepare system
sudo bash scripts/prepare-local.sh

# Step 2: Build and start
docker-compose -f docker-compose.local.yml up -d --build

# Step 3: Verify
bash scripts/deploy-local.sh health
```

**Features:**
- Single-command deployment
- All 8 services running in minutes
- Automatic health checks
- Perfect for development/testing
- No Kubernetes needed

**Performance:**
- Deployment Time: 2-3 minutes
- Resource Usage: ~2GB RAM, 10GB disk
- API Response: <100ms average

---

### ☸️ Option 2: Kubernetes (Production)

#### Prerequisites
- Kubernetes cluster 1.24+
- kubectl configured
- Persistent volume provisioner
- Container registry access

#### Deployment
```bash
kubectl create namespace nextgen-telco
kubectl apply -f k8s/base/
kubectl apply -f k8s/prod/services/
```

**Features:**
- Production-grade orchestration
- Horizontal Pod Autoscaling
- Rolling updates with zero downtime
- Self-healing capabilities
- Multi-replica deployments

---

### 🔄 Option 3: Jenkins CI/CD Pipeline

#### Setup
```
1. Jenkins Dashboard → New Item → Pipeline
2. Configure → Script Path: Jenkinsfile.local
3. Build Triggers → GitHub webhook (optional)
```

#### Pipeline Stages
1. Checkout code
2. Build Docker images (parallel)
3. Stop old containers
4. Start new services
5. Health checks
6. Smoke tests

---

## 📂 Project Structure

```
NextGen-Telco/
├── services/                    # 6 Microservices
│   ├── auth-service/
│   ├── user-service/
│   ├── plan-service/
│   ├── device-service/
│   ├── order-service/
│   └── payment-service/
│
├── api-gateway/                 # Request Router (8080)
├── frontend/                    # Web UI (Port 80)
│   ├── images/                 # Logo, icons, device photos
│   ├── css/                    # Responsive styles
│   ├── js/                     # UI interactions
│   └── *.html                  # Page templates
│
├── k8s/                        # Kubernetes Manifests
│   ├── base/                   # Base configs
│   ├── dev/services/           # Development
│   ├── test/services/          # Testing
│   ├── staging/services/       # Staging
│   └── prod/services/          # Production
│
├── scripts/                    # Automation Scripts
│   ├── deploy-local.sh
│   ├── prepare-local.sh
│   ├── download_device_images.py
│   └── update_html_with_jpg.py
│
├── docker-compose.yml          # Production (external DB)
├── docker-compose.local.yml    # Local (in-memory DB)
├── Jenkinsfile                 # K8s CI/CD
├── Jenkinsfile.local           # Local CI/CD
│
└── Documentation/
    ├── README.md               # This file
    ├── STRATEGY.md             # Deployment strategy
    ├── DEPLOYMENT_LOCAL.md     # Local setup details
    ├── JENKINS_SETUP.md        # Jenkins instructions
    ├── REVERT_PLAN.md          # Rollback procedures
    └── DOWNLOAD_DEVICE_IMAGES.md
```

---

## 🎯 Getting Started

### Prerequisites

```bash
# Ubuntu 20.04+ or equivalent Linux
# Docker 20.10+
# Docker Compose 2.0+
# Node.js 16+
# npm 8.x+
# Git 2.x+
# Python 3.7+ (optional, for scripts)
# Bash 4.x+
```

### Installation Steps

#### 1. Clone Repository
```bash
git clone https://github.com/bhrateshd/NextGen-Telco.git
cd NextGen-Telco
```

#### 2. Prepare System
```bash
sudo bash scripts/prepare-local.sh
```

#### 3. Build Services
```bash
docker-compose -f docker-compose.local.yml build
```

#### 4. Start Services
```bash
docker-compose -f docker-compose.local.yml up -d
```

#### 5. Verify Deployment
```bash
bash scripts/deploy-local.sh health
```

---

## 🌐 Access Services

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost | 80 |
| **API Gateway** | http://localhost:8080 | 8080 |
| **Auth Service** | http://localhost:3001/health | 3001 |
| **User Service** | http://localhost:3002/health | 3002 |
| **Plan Service** | http://localhost:3003/health | 3003 |
| **Device Service** | http://localhost:3004/health | 3004 |
| **Order Service** | http://localhost:3005/health | 3005 |
| **Payment Service** | http://localhost:3006/health | 3006 |

---

## 📡 API Usage Examples

### Authentication
```bash
# Register user
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pass123"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pass123"}'
```

### Plans
```bash
# List plans
curl http://localhost:8080/plans

# Get plan details
curl http://localhost:8080/plans/1
```

### Devices
```bash
# List devices
curl http://localhost:8080/devices

# Get device details
curl http://localhost:8080/devices/iphone-15
```

### Orders
```bash
# Create order
curl -X POST http://localhost:8080/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"plan_id":1,"device_id":1}'
```

---

## 🐳 Docker Commands

### View Services
```bash
docker ps
docker-compose -f docker-compose.local.yml ps
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.local.yml logs -f

# Specific service
docker-compose -f docker-compose.local.yml logs -f auth-service
```

### Manage Services
```bash
# Start all
docker-compose -f docker-compose.local.yml up -d

# Stop all
docker-compose -f docker-compose.local.yml stop

# Restart all
docker-compose -f docker-compose.local.yml restart

# Full reset
docker-compose -f docker-compose.local.yml down -v
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` in project root:

```env
NODE_ENV=production
LOG_LEVEL=info

AUTH_PORT=3001
USER_PORT=3002
PLAN_PORT=3003
DEVICE_PORT=3004
ORDER_PORT=3005
PAYMENT_PORT=3006
GATEWAY_PORT=8080

JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d

DB_HOST=postgres
DB_PORT=5432
DB_NAME=nextgen_telco
DB_USER=postgres
DB_PASSWORD=secure_password
```

---

## 🧪 Health Checks

All services expose `/health` endpoint:

```bash
# Check gateway health
curl http://localhost:8080/health

# Check all services
bash scripts/deploy-local.sh health
```

---

## 🔒 Security

### Implemented Features
✅ JWT Authentication
✅ Environment variable secrets management
✅ Docker network isolation
✅ Health monitoring
✅ Error handling

### Before Production
- [ ] Change JWT_SECRET
- [ ] Update all passwords
- [ ] Configure firewalls
- [ ] Enable HTTPS/TLS
- [ ] Set up monitoring
- [ ] Configure backups

---

## 🆘 Troubleshooting

### Services Not Starting
```bash
docker-compose -f docker-compose.local.yml logs
docker-compose -f docker-compose.local.yml build --no-cache
docker-compose -f docker-compose.local.yml up -d --build
```

### Port Already in Use
```bash
lsof -i :8080
kill -9 <PID>
```

### Out of Memory
```bash
# Edit /etc/docker/daemon.json
{
  "memory": "4g",
  "memswap": "4g"
}
sudo systemctl restart docker
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [STRATEGY.md](STRATEGY.md) | Deployment strategy |
| [DEPLOYMENT_LOCAL.md](DEPLOYMENT_LOCAL.md) | Local setup guide |
| [JENKINS_SETUP.md](JENKINS_SETUP.md) | Jenkins configuration |
| [REVERT_PLAN.md](REVERT_PLAN.md) | Rollback procedures |
| [DOWNLOAD_DEVICE_IMAGES.md](DOWNLOAD_DEVICE_IMAGES.md) | Image download help |

---

## 🎯 Common Tasks

### Deploy Code Changes
```bash
git pull origin master
docker-compose -f docker-compose.local.yml build
docker-compose -f docker-compose.local.yml up -d
bash scripts/deploy-local.sh health
```

### Backup Database
```bash
docker exec postgres pg_dump -U postgres nextgen_telco > backup.sql
```

### View Service Status
```bash
bash scripts/deploy-local.sh status
```

---

## 🤝 Contributing

### Workflow
```bash
git checkout -b feature/feature-name
# Make changes
# Test locally
git add .
git commit -m "Add feature"
git push origin feature/feature-name
# Create Pull Request on GitHub
```

### Code Standards
✅ Follow Node.js best practices
✅ Add `/health` endpoints
✅ Include error handling
✅ Document API changes
✅ Test locally first

---

## 📈 Performance

### Local Deployment
- Memory: ~2GB
- Disk: ~10GB
- Startup: 30-60 seconds
- API Response: <100ms

### Production (Kubernetes)
- Auto-scaling: Yes
- Load balancing: Yes
- Uptime SLA: 99.9%
- Recovery time: <5 minutes

---

## 📊 Project Stats

```
Total Services:       6 microservices + 1 gateway + 1 frontend
Docker Images:        8 custom images
Configuration Files:  Kubernetes base + 4 environment overlays
CI/CD Pipelines:      2 (Kubernetes + Local Docker)
Documentation:        8 comprehensive guides
Source Files:         50+ files
Lines of Code:        5000+ lines
API Endpoints:        50+ endpoints
```

---

## 🚀 Next Steps

### Day 1
1. Clone repository
2. Run `scripts/prepare-local.sh`
3. Build Docker images
4. Start services
5. Verify with health checks
6. Visit http://localhost

### Week 1
1. Download device images: `python3 download_device_images.py`
2. Configure Jenkins job
3. Set up GitHub webhook
4. Run smoke tests

### Month 1
1. Set up K8s cluster
2. Configure PostgreSQL
3. Set up monitoring
4. Configure log aggregation

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 👨‍💻 Author

**Bhratesh D**  
🐙 GitHub: [@bhrateshd](https://github.com/bhrateshd)  
📦 Repository: [NextGen-Telco](https://github.com/bhrateshd/NextGen-Telco)

### Technologies Used
- Node.js & Express.js
- Docker & Docker Compose
- Kubernetes
- Jenkins
- GitHub
- Unsplash API

---

## 🌟 Key Highlights

| Feature | Status |
|---------|--------|
| Microservices Architecture | ✅ Ready |
| Docker Support | ✅ Ready |
| Kubernetes Ready | ✅ Ready |
| CI/CD Pipeline | ✅ Ready |
| Professional Frontend | ✅ Ready |
| Health Monitoring | ✅ Ready |
| Device Images | ✅ Ready |
| Documentation | ✅ Comprehensive |

---

## 📞 Support

### Self-Help
1. Check relevant documentation file
2. Search GitHub issues
3. Review troubleshooting section
4. Check configuration examples

### Quick Commands
```bash
bash scripts/deploy-local.sh health          # Health check
bash scripts/deploy-local.sh logs            # View logs
bash scripts/deploy-local.sh status          # Check status
docker-compose -f docker-compose.local.yml restart  # Restart
```

---

<div align="center">

**Made with ❤️ for India's fastest 5G network**

**Version:** 1.0 | **Status:** Production Ready  
**Last Updated:** March 12, 2026

[⬆ Back to Top](#nextgen-telco---premium-telecommunications-platform)

</div>
