.PHONY: help build up down logs clean restart backend-shell frontend-shell db-shell

help:
	@echo "THOTH - Commandes disponibles:"
	@echo ""
	@echo "  make build          - Construire les images Docker"
	@echo "  make up             - Démarrer tous les services"
	@echo "  make down           - Arrêter tous les services"
	@echo "  make restart        - Redémarrer tous les services"
	@echo "  make logs           - Afficher les logs"
	@echo "  make clean          - Nettoyer les volumes et images"
	@echo "  make backend-shell  - Ouvrir un shell dans le backend"
	@echo "  make frontend-shell - Ouvrir un shell dans le frontend"
	@echo "  make db-shell       - Ouvrir un shell PostgreSQL"
	@echo ""

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

backend-shell:
	docker-compose exec backend /bin/bash

frontend-shell:
	docker-compose exec frontend /bin/sh

db-shell:
	docker-compose exec postgres psql -U thoth -d thoth_db

# Migrations
migrate:
	docker-compose exec backend alembic upgrade head

migration:
	docker-compose exec backend alembic revision --autogenerate -m "$(message)"

# Tests
test-backend:
	docker-compose exec backend pytest

test-frontend:
	docker-compose exec frontend npm run test
