# Makefile for Sell Your Ebook - Complete Docker Setup
# Includes Astro SSG + Flask Config Editor
# https://github.com/JAlcocerT/Docker/tree/main/Web/SSGs/Astro

.PHONY: help dev prod stop clean logs build config-editor all dev-stack

# Default target
help:
	@echo "Available commands:"
	@echo "  dev          - Start Astro development server (http://localhost:4321)"
	@echo "  prod         - Start Astro production server (http://localhost:8090)"
	@echo "  config-editor - Start Flask config editor (http://localhost:5000)"
	@echo "  all          - Start all services (dev + config-editor)"
	@echo "  dev-stack    - Start complete dev stack in single container"
	@echo "  stop         - Stop all containers"
	@echo "  clean        - Stop and remove all containers and volumes"
	@echo "  logs         - Show logs for all services"
	@echo "  build        - Build production version"
	@echo "  shell        - Open shell in development container"

# Development environment
dev:
	@echo "Starting Astro development server..."
	docker compose up astro-dev

# Production environment
prod:
	@echo "Starting Astro production server..."
	docker compose up astro-prod

# Config Editor
config-editor:
	@echo "Starting Flask Config Editor..."
	docker compose up config-editor

# Start all services (dev + config-editor)
all:
	@echo "Starting all services (Astro + Config Editor)..."
	docker compose up astro-dev config-editor

# Complete development stack in single container
dev-stack:
	@echo "Starting complete development stack..."
	docker compose up dev-stack

# Stop all services
stop:
	@echo "Stopping all services..."
	docker compose down

# Clean up everything
clean:
	@echo "Cleaning up containers and volumes..."
	docker compose down -v --remove-orphans
	docker system prune -f

# Show logs
logs:
	docker compose logs -f

# Build production
build:
	@echo "Building production version..."
	docker compose run --rm astro-prod sh -c "npm install && npm run build"

# Open shell in development container
shell:
	docker compose exec astro-dev sh

# Install dependencies
install:
	@echo "Installing dependencies..."
	docker compose run --rm astro-dev npm install

# Run tests (if available)
test:
	@echo "Running tests..."
	docker compose run --rm astro-dev npm test

# Lint code (if available)
lint:
	@echo "Running linter..."
	docker compose run --rm astro-dev npm run lint

# Format code (if available)
format:
	@echo "Formatting code..."
	docker compose run --rm astro-dev npm run format

# Development with live reload
dev-live:
	@echo "Starting development with live reload..."
	docker compose up astro-dev --build

# Production build and serve
prod-build:
	@echo "Building and serving production..."
	docker compose up astro-prod --build

# Quick development setup
quick-dev:
	@echo "Quick development setup..."
	docker compose up astro-dev -d
	@echo "Development server running at http://localhost:4321"
	@echo "Use 'make logs' to see logs or 'make stop' to stop"

# Quick production setup
quick-prod:
	@echo "Quick production setup..."
	docker compose up astro-prod -d
	@echo "Production server running at http://localhost:8090"
	@echo "Use 'make logs' to see logs or 'make stop' to stop"

# Quick config editor setup
quick-config:
	@echo "Quick config editor setup..."
	docker compose up config-editor -d
	@echo "Config editor running at http://localhost:5000"
	@echo "Use 'make logs' to see logs or 'make stop' to stop"

# Quick complete setup
quick-all:
	@echo "Quick complete setup..."
	docker compose up astro-dev config-editor -d
	@echo "Astro dev server: http://localhost:4321"
	@echo "Config editor: http://localhost:5000"
	@echo "Use 'make logs' to see logs or 'make stop' to stop"
