# Local Deployment Guide for NextGen Telco

## Prerequisites

- Ubuntu machine with Docker Desktop installed
- Jenkins installed and running
- Git installed

## Overview

This guide explains how to deploy NextGen Telco microservices on your local Ubuntu machine using Jenkins and Docker, without Kubernetes.

## Architecture

```
Jenkins (CI/CD Pipeline)
    ↓
    ├─→ Checkout code from GitHub
    ├─→ Build Docker images for 5 services
    ├─→ Stop existing containers
    ├─→ Start containers with docker-compose
    ├─→ Health check
    └─→ Smoke tests
    
    ↓
Docker Compose
    ├─→ Auth Service (3001)
    ├─→ User Service (3002)
    ├─→ Plan Service (3003)
    ├─→ Device Service (3004)
    ├─→ Order Service (3005)
    ├─→ Payment Service (3006)
    ├─→ API Gateway (8080)
    └─→ Frontend (80)
```

## Setup Instructions

### Step 1: Prepare Jenkins

1. **Log in to Jenkins**: `http://localhost:8080`

2. **Create a New Pipeline Job**:
   - Click "New Item"
   - Enter job name: `NextGen-Telco-Local-Deployment`
   - Select "Pipeline"
   - Click OK

3. **Configure Pipeline**:
   - Under "Pipeline", select "Pipeline script from SCM"
   - SCM: Git
   - Repository URL: `https://github.com/bhrateshd/NextGen-Telco.git`
   - Branch Specifier: `*/master`
   - Script Path: `Jenkinsfile.local` ← Important!
   - Save

### Step 2: Configure Permissions

Jenkins needs Docker access. Run these commands on your Ubuntu machine:

```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins
sudo systemctl restart jenkins

# Verify
docker ps  # Should work without sudo
```

### Step 3: Prepare the Repository

Three new files have been added (no changes to existing files):

1. **`Jenkinsfile.local`** - Local Jenkins pipeline (without Kubernetes)
2. **`docker-compose.local.yml`** - Docker Compose configuration
3. **`scripts/deploy-local.sh`** - Helper script for manual deployment

### Step 4: Build Docker Images Locally (First Time)

```bash
# Navigate to project root
cd ~/NextGen-Telco

# Build all service images
docker-compose -f docker-compose.local.yml build

# Or build individually
cd services/auth-service && docker build -t nextgen-telco/auth-service:latest .
cd ../user-service && docker build -t nextgen-telco/user-service:latest .
# ... repeat for other services
```

### Step 5: Run Jenkins Pipeline

1. **Trigger Build**:
   - Go to Jenkins job: `NextGen-Telco-Local-Deployment`
   - Click "Build Now"
   - Watch the console output

2. **What happens**:
   - Checkout code
   - Build 5 microservice Docker images
   - Stop any running containers
   - Start all services with docker-compose
   - Health check all endpoints
   - Run smoke tests

3. **Check Results**:
   - View console: Watch for green checkmarks
   - Check services running: `docker ps`

## Manual Deployment (Without Jenkins)

If you want to test locally without Jenkins:

```bash
# Start all services
bash scripts/deploy-local.sh start

# Check status
bash scripts/deploy-local.sh status

# View logs
bash scripts/deploy-local.sh logs

# Stop all services
bash scripts/deploy-local.sh stop
```

## Service Endpoints

Once deployed, access services at:

| Service | Port | Health URL |
|---------|------|-----------|
| Auth Service | 3001 | `http://localhost:3001/health` |
| User Service | 3002 | `http://localhost:3002/health` |
| Plan Service | 3003 | `http://localhost:3003/health` |
| Device Service | 3004 | `http://localhost:3004/health` |
| Order Service | 3005 | `http://localhost:3005/health` |
| Payment Service | 3006 | `http://localhost:3006/health` |
| API Gateway | 8080 | `http://localhost:8080/health` |
| Frontend | 80 | `http://localhost/` |

## Testing the Deployment

### Test Auth Service

```bash
curl -X POST http://localhost:3001/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "email": "user@example.com",
    "role": "user"
  }'
```

### Test through API Gateway

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userId": "user-123"
  }'
```

### Test Frontend

```bash
curl http://localhost/index.html
```

## Troubleshooting

### Services Not Starting

```bash
# Check logs
docker-compose -f docker-compose.local.yml logs

# Check specific service
docker logs nextgen-auth-service

# Rebuild images
docker-compose -f docker-compose.local.yml build --no-cache
```

### Port Already in Use

```bash
# Find what's using the port
lsof -i :3001  # or any port number

# Kill the process
kill -9 <PID>
```

### Docker Daemon Not Running

```bash
# On Ubuntu with Docker Desktop
systemctl --user start docker
# or open Docker Desktop app
```

### Jenkins Can't Access Docker

```bash
# Check if jenkins user can access docker
sudo -u jenkins docker ps

# If not, add permissions
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

## Performance Tips

1. **Use `-f` flag in docker-compose**: `docker-compose -f docker-compose.local.yml up -d`

2. **Monitor resource usage**: `docker stats`

3. **Clean up unused images**: `docker image prune`

4. **Use local image cache**: Images are tagged as `latest` so docker-compose reuses them

## Scaling Up to Kubernetes

When you're ready to move to Kubernetes:

1. The original `Jenkinsfile` (with K8s steps) remains untouched
2. Just switch Jenkins to use `Jenkinsfile` instead of `Jenkinsfile.local`
3. All microservices and Kubernetes manifests are ready to use

## Project Files (No Changes)

The following files were **NOT modified** to keep your project clean:

- All existing microservice code
- All existing Kubernetes manifests
- Original Jenkinsfile (for future K8s deployment)
- API Gateway code
- Frontend code

## New Files Added

These files were added **without modifying anything else**:

1. `Jenkinsfile.local` - 120 lines
2. `docker-compose.local.yml` - 140 lines  
3. `scripts/deploy-local.sh` - 160 lines

## What's Different from Original docker-compose.yml

- `docker-compose.yml` - Full development mode with databases
- `docker-compose.local.yml` - Production-like deployment without external databases

The `local` version is optimized for:
- Simpler deployment without PostgreSQL setup
- Service-to-service in-memory state (fine for testing)
- High availability (restart policies, health checks)
- Production-like configuration

## Next Steps

1. ✅ Build Docker images: `docker-compose -f docker-compose.local.yml build`
2. ✅ Deploy via Jenkins: Trigger the `NextGen-Telco-Local-Deployment` job
3. ✅ Verify all services: `docker ps`
4. ✅ Test endpoints: `curl http://localhost:8080/health`
5. 🔄 When ready for K8s: Switch Jenkinsfile to use the original one

## Support Commands

```bash
# View all running services
docker ps

# View all images
docker images | grep nextgen

# Restart a specific service
docker-compose -f docker-compose.local.yml restart auth-service

# Clean up everything
docker-compose -f docker-compose.local.yml down
docker image prune
docker volume prune

# Check resource usage
docker stats

# Inspect network
docker network ls
docker network inspect nextgen-telco_nextgen-network
```

---

**Remember**: All original files remain unchanged. The new files are only for local Docker deployment without Kubernetes. When you're ready to use Kubernetes, just switch back to the original Jenkinsfile!
