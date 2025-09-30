# ==========================
# Makefile for AIOps Platform
# ==========================

# Start services in background
up:
	docker compose up -d --build

# Stop and remove containers, networks, volumes
down:
	docker compose down -v

# Restart containers
restart:
	docker compose down -v && docker compose up -d --build

# Tail logs for all services
logs:
	docker compose logs -f

# Show container status
ps:
	docker compose ps
