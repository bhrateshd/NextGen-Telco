#!/bin/bash

# NextGen Telco - Pre-deployment Script
# Prepares Ubuntu machine for local deployment
# Usage: sudo bash scripts/prepare-local.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   log_error "This script must be run as root (use: sudo bash scripts/prepare-local.sh)"
fi

log_info "Starting NextGen Telco local deployment preparation..."

# Check Docker installation
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install Docker Desktop for Ubuntu."
fi
log_success "Docker is installed: $(docker --version)"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    log_error "docker-compose is not installed. Please install it."
fi
log_success "Docker Compose is installed: $(docker-compose --version)"

# Check Jenkins
if ! command -v jenkins &> /dev/null; then
    log_warning "Jenkins not found in PATH. Make sure Jenkins is installed."
else
    log_success "Jenkins is installed"
fi

# Configure Docker permissions for Jenkins
log_info "Configuring Docker permissions for Jenkins..."

if id "jenkins" &>/dev/null; then
    usermod -aG docker jenkins
    log_success "Added jenkins user to docker group"
else
    log_warning "Jenkins user 'jenkins' not found. Please install Jenkins first."
fi

# Create required directories
log_info "Creating required directories..."
mkdir -p scripts logs data

log_success "Directories created"

# Set permissions
log_info "Setting permissions..."
chmod +x scripts/deploy-local.sh 2>/dev/null || true
chmod +x scripts/prepare-local.sh 2>/dev/null || true

log_success "Permissions set"

# Test Docker connectivity
log_info "Testing Docker connectivity..."
if docker ps > /dev/null 2>&1; then
    log_success "Docker is working"
else
    log_error "Docker is not working. Check installation."
fi

# Display next steps
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Preparation Complete!                           ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║   Next Steps:                                      ║${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}║   1. Build Docker images:                          ║${NC}"
echo -e "${BLUE}║      docker-compose -f docker-compose.local.yml \\ ║${NC}"
echo -e "${BLUE}║        build                                       ║${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}║   2. Restart Jenkins:                              ║${NC}"
echo -e "${BLUE}║      sudo systemctl restart jenkins                ║${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}║   3. Create Jenkins job:                           ║${NC}"
echo -e "${BLUE}║      - Script Path: Jenkinsfile.local              ║${NC}"
echo -e "${BLUE}║      - Build Now                                   ║${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}║   4. Verify deployment:                            ║${NC}"
echo -e "${BLUE}║      curl http://localhost:8080/health             ║${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

log_success "Your Ubuntu machine is ready for NextGen Telco deployment!"
