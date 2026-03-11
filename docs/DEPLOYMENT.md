# NextGen Telco - Deployment Guide

## Overview

This guide covers deploying NextGen Telco to various environments using Docker, Kubernetes, and CI/CD pipelines.

## Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [Kubernetes Deployment](#kubernetes-deployment)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Environment Configuration](#environment-configuration)
5. [Monitoring & Logging](#monitoring--logging)

## Docker Deployment

### Building Images

Build all services:
```bash
docker-compose build
```

Build specific service:
```bash
docker build -t nextgen-telco/user-service:1.0.0 services/user-service
```

### Running with Docker Compose

Start all services:
```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f service-name
```

Stop services:
```bash
docker-compose down
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- Docker images pushed to registry

### Deploy to Development

```bash
kubectl apply -k k8s/dev/
```

Verify deployment:
```bash
kubectl get deployments -n development
kubectl get pods -n development
kubectl logs -n development deployment/dev-frontend
```

### Deploy to Staging

```bash
kubectl apply -k k8s/staging/
```

### Deploy to Production

```bash
kubectl apply -k k8s/prod/
```

### Rollback Deployment

```bash
kubectl rollout undo deployment/prod-frontend -n production
```

### Check Rollout Status

```bash
kubectl rollout status deployment/prod-frontend -n production
```

## CI/CD Pipeline

### GitHub Actions / Jenkins

The Jenkinsfile in `jenkins/` contains the complete CI/CD pipeline:

1. **Checkout** - Clone repository
2. **Build** - Build Docker images
3. **Test** - Run automated tests
4. **Push** - Push to registry
5. **Deploy** - Deploy to Kubernetes

### Trigger Deployment

Push to branch:
```bash
git push origin feature/my-feature
```

Jenkins automatically:
- Builds images
- Runs tests
- Pushes to registry
- Deploys based on branch

## Environment Configuration

### Development Environment

Database:
```
DATABASE_URL=postgresql://postgres:password@postgres:5432/nextgen_dev
```

Service URLs:
```
USER_SERVICE_URL=http://user-service:8080
PLAN_SERVICE_URL=http://plan-service:8080
DEVICE_SERVICE_URL=http://device-service:8080
ORDER_SERVICE_URL=http://order-service:8080
PAYMENT_SERVICE_URL=http://payment-service:8080
```

### Production Environment

Secrets management:
```bash
kubectl create secret generic db-credentials \
  --from-literal=username=prod_user \
  --from-literal=password=<secure-password> \
  -n production
```

### Scaling Services

Horizontal Pod Autoscaling:
```bash
kubectl autoscale deployment prod-frontend -n production \
  --min=3 --max=10 --cpu-percent=80
```

## Monitoring & Logging

### Prometheus Metrics

Scrape configuration in `monitoring/prometheus.yml` collects metrics from:
- API Gateway
- All microservices
- Database metrics
- Kubernetes metrics

### Grafana Dashboards

Access Grafana: http://localhost:3000

Default dashboards:
- Service Health
- Request Performance
- Error Rates
- Resource Usage

### Log Aggregation

View logs:
```bash
kubectl logs -f deployment/prod-frontend -n production

# Stream logs from all pods
kubectl logs -f -l app=frontend -n production
```

### Health Checks

Each service exposes health endpoints:
```bash
curl http://localhost:8080/health
```

## Backup & Recovery

### Database Backup

```bash
pg_dump -h postgres -U postgres nextgen_prod > backup.sql
```

### Restore Backup

```bash
psql -h postgres -U postgres nextgen_prod < backup.sql
```

### Kubernetes Backup

Use Velero for Kubernetes resources:
```bash
velero backup create nextgen-backup-$(date +%Y%m%d)
```

## Performance Optimization

### Caching

Redis configuration for plan and device caches:
```
REDIS_URL=redis://cache:6379
CACHE_TTL=3600
```

### Load Balancing

Nginx load balancer configuration in `k8s/base/frontend/service.yaml`

### Database Optimization

- Connection pooling: max 20 connections per service
- Query optimization through indexes
- Regular VACUUM and ANALYZE

## Security

### TLS/SSL

Enable TLS on ingress:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nextgen-ingress
spec:
  tls:
  - hosts:
    - api.nextgentelco.com
    secretName: tls-secret
```

### Network Policies

Restrict traffic between namespaces:
```bash
kubectl apply -f k8s/network-policies.yaml
```

### Secrets Management

Use HashiCorp Vault or Kubernetes Secrets:
```bash
kubectl create secret generic payment-secrets \
  --from-literal=stripe-key=sk_live_... \
  -n production
```

## Troubleshooting

### Pod Not Starting

```bash
kubectl describe pod pod-name -n namespace
kubectl logs pod-name -n namespace
```

### Service Not Responding

```bash
kubectl port-forward service/frontend 8080:80 -n production
curl http://localhost:8080
```

### Database Connection Issues

Check database credentials:
```bash
kubectl exec -it deployment/user-service -n production -- \
  psql -h postgres -U username -d nextgen_prod
```

---

For additional support, see `docs/TROUBLESHOOTING.md`
