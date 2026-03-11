# Jenkins Local Setup - Quick Reference

## 5-Minute Setup

### 1. Create Jenkins Job

```
Jenkins Dashboard
├── New Item
├── Job Name: NextGen-Telco-Local
├── Select: Pipeline
├── OK
└── Configure:
    ├── Pipeline
    │   ├── Definition: Pipeline script from SCM
    │   ├── SCM: Git
    │   ├── Repository URL: https://github.com/bhrateshd/NextGen-Telco.git
    │   ├── Branch: */master
    │   └── Script Path: Jenkinsfile.local
    └── Save
```

### 2. Grant Docker Permissions

```bash
# On Ubuntu machine
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Verify
sudo -u jenkins docker ps  # Should work
```

### 3. Build First Time

```bash
# Optional: Pre-build images to save time during first Jenkins run
cd ~/NextGen-Telco
docker-compose -f docker-compose.local.yml build
```

### 4. Trigger Jenkins Pipeline

```
Jenkins Dashboard
└── NextGen-Telco-Local
    └── Build Now
    └── Wait 2-3 minutes
    └── Check console output
```

### 5. Verify Deployment

```bash
# Check running containers
docker ps

# Check service health
curl http://localhost:8080/health

# View logs
docker-compose -f docker-compose.local.yml logs -f
```

## Environment Variables

Optional: Create `.env` file in project root:

```bash
# For local deployment
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://localhost/nextgen
```

These override defaults in `docker-compose.local.yml`

## Jenkins Credentials (Optional)

If you need private GitHub repo:

1. Go to Jenkins → Manage Jenkins → Manage Credentials
2. Add credentials: SSH Key or GitHub Token
3. In job config: Choose credentials from dropdown

## Useful Jenkins Commands

```bash
# View Jenkins logs
tail -f /var/log/jenkins/jenkins.log

# Jenkins service
sudo systemctl status jenkins
sudo systemctl restart jenkins
sudo systemctl stop jenkins

# Check Jenkins workspace
ls -la ~/.jenkins/jobs/NextGen-Telco-Local/workspace/
```

## GitHub Webhook (Optional)

Auto-trigger Jenkins when code is pushed:

1. **Jenkins Config**:
   - Job → Configure
   - Build Triggers → GitHub hook trigger
   - Save

2. **GitHub Config**:
   - Repo Settings → Webhooks
   - Add: `http://your-jenkins-ip:8080/github-webhook/`
   - Content type: application/json
   - Let me select... → Just the push event
   - Active ✓

## Customization

### Build Only Specific Service

Edit `docker-compose.local.yml`:
```yaml
# Comment out services you don't want
# auth-service:
#   image: ...
```

### Change Port Numbers

Edit `docker-compose.local.yml`:
```yaml
frontend:
  ports:
    - "3000:80"  # Change from 80 to 3000
```

### Change Log Level

Edit `docker-compose.local.yml`:
```yaml
auth-service:
  environment:
    - LOG_LEVEL=debug  # Changed from info to debug
```

### Increase Resource Limits

Edit `docker-compose.local.yml`:
```yaml
auth-service:
  deploy:
    resources:
      limits:
        cpus: '0.5'
        memory: 512M
```

## Common Issues

| Issue | Solution |
|-------|----------|
| `Permission denied` when running docker | `sudo usermod -aG docker $USER && newgrp docker` |
| `Port already in use` | `lsof -i :3001 && kill -9 <PID>` |
| `Container exits immediately` | `docker logs nextgen-auth-service` |
| `Jenkins can't find docker-compose` | `which docker-compose` - verify path |
| `Services not communicating` | Check network: `docker network inspect nextgen-telco_nextgen-network` |

## Monitoring

```bash
# Real-time logs
docker-compose -f docker-compose.local.yml logs -f

# Resource usage
docker stats

# Container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# Network
docker network ls
docker network inspect nextgen-telco_nextgen-network
```

## Backup & Restore

```bash
# Backup docker images
docker save nextgen-telco/auth-service:latest | gzip > auth-service.tar.gz

# Restore docker images
docker load < auth-service.tar.gz
```

## Performance

- **First build**: 5-10 minutes (builds all images)
- **Subsequent builds**: 2-3 minutes (uses cache)
- **Service startup**: ~15 seconds
- **Health checks**: ~10 seconds

## Folder Structure

```
NextGen-Telco/
├── Jenkinsfile              (for Kubernetes - keep for later)
├── Jenkinsfile.local        (for local Docker - NEW)
├── docker-compose.yml       (dev with databases)
├── docker-compose.local.yml (local deployment - NEW)
├── scripts/
│   └── deploy-local.sh      (manual deployment - NEW)
├── services/
│   ├── auth-service/
│   ├── user-service/
│   ├── plan-service/
│   ├── device-service/
│   ├── order-service/
│   └── payment-service/
├── api-gateway/
├── frontend/
└── DEPLOYMENT_LOCAL.md      (this guide - NEW)
```

## Switching Back to Kubernetes

When ready to use Kubernetes:

1. Edit Jenkins job
2. Change Script Path: `Jenkinsfile.local` → `Jenkinsfile`
3. Save and rebuild

All K8s manifests are already in place!

---

**That's it!** You're ready to deploy NextGen Telco locally with Jenkins and Docker.
