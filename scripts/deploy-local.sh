#!/bin/bash

# NextGen Telco - Local Deployment Script
# Usage: ./scripts/deploy-local.sh [start|stop|restart|logs|status]

set -e

COMPOSE_FILE="docker-compose.local.yml"
PROJECT_NAME="nextgen-telco"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if docker and docker-compose are installed
check_dependencies() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker Desktop."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "docker-compose is not installed. Please install Docker Compose."
        exit 1
    fi

    log_success "Docker and docker-compose are installed"
}

# Start services
start_services() {
    log_info "Starting NextGen Telco services..."
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "File not found: $COMPOSE_FILE"
        exit 1
    fi

    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d

    log_success "Services started successfully"
    log_info "Waiting for services to become healthy..."
    sleep 15

    check_health
}

# Stop services
stop_services() {
    log_info "Stopping NextGen Telco services..."
    
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down

    log_success "Services stopped successfully"
}

# Restart services
restart_services() {
    log_info "Restarting NextGen Telco services..."
    
    stop_services
    sleep 2
    start_services
}

# Check health of services
check_health() {
    log_info "Checking service health..."
    
    local services=(
        "http://localhost:3001/health:Auth Service"
        "http://localhost:3002/health:User Service"
        "http://localhost:3003/health:Plan Service"
        "http://localhost:3004/health:Device Service"
        "http://localhost:3005/health:Order Service"
        "http://localhost:3006/health:Payment Service"
        "http://localhost:8080/health:API Gateway"
    )

    for service in "${services[@]}"; do
        IFS=':' read -r url name <<< "$service"
        if curl -s -f "$url" > /dev/null; then
            log_success "$name is running"
        else
            log_warning "$name is not responding yet"
        fi
    done

    echo ""
    log_info "Frontend health check: http://localhost/index.html"
}

# Show logs
show_logs() {
    local service="${1:-}"
    
    if [ -z "$service" ]; then
        log_info "Showing logs for all services (Ctrl+C to exit)..."
        docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" logs -f
    else
        log_info "Showing logs for $service (Ctrl+C to exit)..."
        docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" logs -f "$service"
    fi
}

# Show status
show_status() {
    log_info "Service Status:"
    echo ""
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps

    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   Service Endpoints                                ║${NC}"
    echo -e "${BLUE}╠════════════════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║   Auth Service:    http://localhost:3001/health    ║${NC}"
    echo -e "${BLUE}║   User Service:    http://localhost:3002/health    ║${NC}"
    echo -e "${BLUE}║   Plan Service:    http://localhost:3003/health    ║${NC}"
    echo -e "${BLUE}║   Device Service:  http://localhost:3004/health    ║${NC}"
    echo -e "${BLUE}║   Order Service:   http://localhost:3005/health    ║${NC}"
    echo -e "${BLUE}║   Payment Service: http://localhost:3006/health    ║${NC}"
    echo -e "${BLUE}║   API Gateway:     http://localhost:8080/health    ║${NC}"
    echo -e "${BLUE}║   Frontend:        http://localhost/index.html     ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
}

# Build images
build_images() {
    log_info "Building Docker images..."
    
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" build

    log_success "Images built successfully"
}

# Main menu
show_menu() {
    echo ""
    echo -e "${BLUE}NextGen Telco - Local Deployment${NC}"
    echo "=================================="
    echo "1. start    - Start all services"
    echo "2. stop     - Stop all services"
    echo "3. restart  - Restart all services"
    echo "4. status   - Show status of services"
    echo "5. logs     - Show service logs"
    echo "6. build    - Build Docker images"
    echo "7. health   - Check service health"
    echo ""
}

# Main script
main() {
    check_dependencies

    case "${1:-}" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        status|ps)
            show_status
            ;;
        logs)
            show_logs "${2:-}"
            ;;
        build)
            build_images
            ;;
        health)
            check_health
            ;;
        *)
            show_menu
            
            if [ -z "${1:-}" ]; then
                log_info "Usage: ./scripts/deploy-local.sh {start|stop|restart|status|logs|build|health}"
                log_info "Example: ./scripts/deploy-local.sh start"
            else
                log_error "Unknown command: $1"
                exit 1
            fi
            ;;
    esac
}

main "$@"
