# Makefile for Astro SSG Docker Management
# https://github.com/JAlcocerT/Docker/tree/main/Web/SSGs/Astro

.PHONY: help dev prod stop clean logs build

# Default target
help:
	@echo "Available commands:"
	@echo "  dev     - Start development server (http://localhost:4321)"
	@echo "  prod    - Start production server (http://localhost:8090)"
	@echo "  stop    - Stop all containers"
	@echo "  clean   - Stop and remove all containers and volumes"
	@echo "  logs    - Show logs for all services"
	@echo "  build   - Build production version"
	@echo "  shell   - Open shell in development container"

# Development environment
dev:
	@echo "Starting Astro development server..."
	docker compose -f docker-compose-ssg.yml up astro-dev

# Production environment
prod:
	@echo "Starting Astro production server..."
	docker compose -f docker-compose-ssg.yml up astro-prod

# Stop all services
stop:
	@echo "Stopping all services..."
	docker compose -f docker-compose-ssg.yml down

# Clean up everything
clean:
	@echo "Cleaning up containers and volumes..."
	docker compose -f docker-compose-ssg.yml down -v --remove-orphans
	docker system prune -f

# Show logs
logs:
	docker compose -f docker-compose-ssg.yml logs -f

# Build production
build:
	@echo "Building production version..."
	docker compose -f docker-compose-ssg.yml run --rm astro-prod sh -c "npm install && npm run build"

# Open shell in development container
shell:
	docker compose -f docker-compose-ssg.yml exec astro-dev sh

# Install dependencies
install:
	@echo "Installing dependencies..."
	docker compose -f docker-compose-ssg.yml run --rm astro-dev npm install

# Run tests (if available)
test:
	@echo "Running tests..."
	docker compose -f docker-compose-ssg.yml run --rm astro-dev npm test

# Lint code (if available)
lint:
	@echo "Running linter..."
	docker compose -f docker-compose-ssg.yml run --rm astro-dev npm run lint

# Format code (if available)
format:
	@echo "Formatting code..."
	docker compose -f docker-compose-ssg.yml run --rm astro-dev npm run format

# Development with live reload
dev-live:
	@echo "Starting development with live reload..."
	docker compose -f docker-compose-ssg.yml up astro-dev --build

# Production build and serve
prod-build:
	@echo "Building and serving production..."
	docker compose -f docker-compose-ssg.yml up astro-prod --build

# Quick development setup
quick-dev:
	@echo "Quick development setup..."
	docker compose -f docker-compose-ssg.yml up astro-dev -d
	@echo "Development server running at http://localhost:4321"
	@echo "Use 'make logs' to see logs or 'make stop' to stop"

# Quick production setup
quick-prod:
	@echo "Quick production setup..."
	docker compose -f docker-compose-ssg.yml up astro-prod -d
	@echo "Production server running at http://localhost:8090"
	@echo "Use 'make logs' to see logs or 'make stop' to stop"
