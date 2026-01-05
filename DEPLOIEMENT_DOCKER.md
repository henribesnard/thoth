# 🐳 Déploiement Docker - THOTH v2.0

## ✅ Configuration Docker Actuelle

Votre projet **THOTH** est déjà configuré avec Docker et prêt à être déployé !

### Services Disponibles

Le `docker-compose.yml` inclut tous les services nécessaires :

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| **postgres** | postgres:15-alpine | 5432 | Base de données PostgreSQL |
| **redis** | redis:7-alpine | 6380→6379 | Cache & Queue |
| **qdrant** | qdrant/qdrant:latest | 6333, 6334 | Vector Database (RAG) |
| **backend** | Custom (Python 3.11) | 8001→8000 | API FastAPI |
| **celery-worker** | Custom (Python 3.11) | - | Worker asynchrone |
| **celery-beat** | Custom (Python 3.11) | - | Scheduler de tâches |
| **frontend** | Custom (Node 20) | 3010→3000 | Application Next.js |
| **nginx** | nginx:alpine | 80 | Reverse proxy (prod) |

---

## 🚀 Déploiement en 3 Étapes

### Étape 1 : Configuration de l'Environnement

```bash
# 1. Copier le fichier d'environnement
cp .env.example .env

# 2. Éditer .env et configurer au minimum :
# - SECRET_KEY (générez-en une avec: python -c "import secrets; print(secrets.token_urlsafe(32))")
# - DEEPSEEK_API_KEY (votre clé API DeepSeek)
# - POSTGRES_PASSWORD (changez le mot de passe par défaut)
```

**Variables OBLIGATOIRES dans `.env`** :
```bash
SECRET_KEY=votre_secret_key_ici                    # À générer
DEEPSEEK_API_KEY=sk-votre_cle_deepseek_ici        # De DeepSeek
POSTGRES_PASSWORD=votre_mot_de_passe_securise     # À changer
```

### Étape 2 : Migration de Base de Données

**IMPORTANT** : La table `chat_messages` doit être créée avant le premier lancement.

**Option A - Avec Docker (Recommandé)** :
```bash
# 1. Démarrer uniquement la base de données
docker-compose up -d postgres

# 2. Attendre que PostgreSQL soit prêt (environ 10 secondes)
sleep 10

# 3. Construire le backend
docker-compose build backend

# 4. Exécuter la migration dans le conteneur backend
docker-compose run --rm backend alembic upgrade head

# 5. Vérifier que la migration a réussi
docker-compose run --rm backend alembic current
```

**Option B - Localement (si Python est installé)** :
```bash
cd backend

# Installer les dépendances
pip install -r requirements.txt

# Créer et appliquer la migration
# Note: Assurez-vous que PostgreSQL est accessible
alembic upgrade head

cd ..
```

### Étape 3 : Démarrer Tous les Services

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps

# Tous les services doivent être "Up" ou "Up (healthy)"
```

**Vérification des services** :
```bash
# Voir les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 🌐 Accéder à l'Application

Une fois tous les services démarrés :

| Interface | URL | Description |
|-----------|-----|-------------|
| **Application** | http://localhost:3010 | Frontend Next.js |
| **Nouveau Dashboard** | http://localhost:3010/dashboard/new | Dashboard moderne |
| **API Documentation** | http://localhost:8001/api/docs | Swagger UI interactive |
| **API Alternative** | http://localhost:8001/api/redoc | ReDoc documentation |
| **Health Check** | http://localhost:8001/health | Vérifier que le backend fonctionne |

---

## 🔧 Commandes Docker Utiles

### Gestion des Services

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Redémarrer tous les services
docker-compose restart

# Redémarrer un service spécifique
docker-compose restart backend

# Voir l'état des services
docker-compose ps

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service
docker-compose logs -f backend
```

### Rebuild et Nettoyage

```bash
# Reconstruire les images (après modification de code)
docker-compose build

# Reconstruire sans cache
docker-compose build --no-cache

# Reconstruire un service spécifique
docker-compose build backend

# Arrêter et supprimer les conteneurs
docker-compose down

# Arrêter et supprimer les conteneurs + volumes (⚠️ PERTE DE DONNÉES)
docker-compose down -v
```

### Accès aux Conteneurs

```bash
# Accéder au shell du backend
docker-compose exec backend bash

# Accéder au shell du frontend
docker-compose exec frontend sh

# Accéder à PostgreSQL
docker-compose exec postgres psql -U thoth -d thoth_db

# Accéder à Redis CLI
docker-compose exec redis redis-cli
```

### Migrations de Base de Données

```bash
# Créer une nouvelle migration (auto-générée)
docker-compose exec backend alembic revision --autogenerate -m "Description"

# Appliquer les migrations
docker-compose exec backend alembic upgrade head

# Voir l'état actuel
docker-compose exec backend alembic current

# Revenir en arrière d'une migration
docker-compose exec backend alembic downgrade -1

# Voir l'historique des migrations
docker-compose exec backend alembic history
```

---

## 📊 Vérification Post-Déploiement

### Checklist de Santé ✅

Exécutez ces vérifications après le déploiement :

```bash
# 1. Tous les services sont actifs
docker-compose ps
# Résultat attendu : Tous "Up" ou "Up (healthy)"

# 2. Backend fonctionne
curl http://localhost:8001/health
# Résultat attendu : {"status":"healthy","version":"2.0.0","environment":"development"}

# 3. Frontend accessible
curl -I http://localhost:3010
# Résultat attendu : HTTP/1.1 200 OK

# 4. Base de données accessible
docker-compose exec postgres pg_isready -U thoth
# Résultat attendu : postgres:5432 - accepting connections

# 5. Redis fonctionne
docker-compose exec redis redis-cli ping
# Résultat attendu : PONG

# 6. Table chat_messages existe
docker-compose exec postgres psql -U thoth -d thoth_db -c "\dt chat_messages"
# Résultat attendu : Table "public.chat_messages" affichée
```

### Test Fonctionnel

1. **Accéder au frontend** : http://localhost:3010
2. **Créer un compte** et se connecter
3. **Accéder au nouveau dashboard** : http://localhost:3010/dashboard/new
4. **Créer un projet** avec le wizard
5. **Tester le chat** : Envoyer un message et recevoir une réponse

---

## 🐛 Dépannage

### Problème : Un service ne démarre pas

```bash
# Voir les logs du service
docker-compose logs nom_du_service

# Redémarrer le service
docker-compose restart nom_du_service

# Reconstruire le service
docker-compose build nom_du_service
docker-compose up -d nom_du_service
```

### Problème : Backend ne peut pas se connecter à la BDD

```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps postgres

# Vérifier les logs de PostgreSQL
docker-compose logs postgres

# Redémarrer PostgreSQL
docker-compose restart postgres

# Attendre que PostgreSQL soit prêt
docker-compose exec postgres pg_isready -U thoth
```

### Problème : Erreur "Table chat_messages does not exist"

```bash
# La migration n'a pas été appliquée
# Exécuter la migration
docker-compose exec backend alembic upgrade head

# Vérifier
docker-compose exec postgres psql -U thoth -d thoth_db -c "\dt"
```

### Problème : Chat ne répond pas

**Vérifications** :
```bash
# 1. Vérifier que DEEPSEEK_API_KEY est configuré
docker-compose exec backend env | grep DEEPSEEK_API_KEY

# 2. Voir les logs du backend
docker-compose logs -f backend

# 3. Tester l'API directement
curl -X POST http://localhost:8001/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{"message":"test"}'
```

### Problème : Frontend ne se connecte pas au backend

**Vérifications** :
```bash
# 1. Vérifier que le backend est accessible depuis le frontend
docker-compose exec frontend wget -O- http://backend:8000/health

# 2. Vérifier les variables d'environnement du frontend
docker-compose exec frontend env | grep NEXT_PUBLIC

# 3. Redémarrer le frontend
docker-compose restart frontend
```

### Problème : Port déjà utilisé

```bash
# Identifier le processus qui utilise le port
# Windows
netstat -ano | findstr :3010
netstat -ano | findstr :8001

# Linux/Mac
lsof -i :3010
lsof -i :8001

# Changer le port dans docker-compose.yml
# Exemple : "3011:3000" au lieu de "3010:3000"
```

### Problème : Volumes corrompus

```bash
# ⚠️ ATTENTION : Cela supprime toutes les données !
docker-compose down -v
docker volume prune
docker-compose up -d

# Refaire la migration
docker-compose exec backend alembic upgrade head
```

---

## 📈 Monitoring et Logs

### Voir les logs en temps réel

```bash
# Tous les services
docker-compose logs -f

# Filtrer par service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Limiter le nombre de lignes
docker-compose logs --tail=100 backend
```

### Statistiques des conteneurs

```bash
# Utilisation CPU/RAM de tous les conteneurs
docker stats

# Info détaillée d'un conteneur
docker inspect thoth-backend
```

---

## 🔐 Sécurité en Production

**⚠️ AVANT DE DÉPLOYER EN PRODUCTION** :

1. **Changer SECRET_KEY** :
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **Changer POSTGRES_PASSWORD** :
   ```bash
   openssl rand -base64 32
   ```

3. **Désactiver DEBUG** :
   ```bash
   DEBUG=false
   APP_ENV=production
   ```

4. **Utiliser HTTPS** :
   - Activer nginx avec SSL
   - Configurer les certificats

5. **Limiter les accès** :
   - Fermer les ports non nécessaires
   - Configurer un firewall

---

## 📦 Volumes de Données

Les données sont persistées dans ces volumes Docker :

| Volume | Contenu | Peut être supprimé ? |
|--------|---------|---------------------|
| `postgres_data` | Base de données | ❌ Non (perte de données) |
| `redis_data` | Cache Redis | ✅ Oui (sera recréé) |
| `qdrant_data` | Vecteurs RAG | ⚠️ Selon utilisation |
| `backend_uploads` | Fichiers uploadés | ❌ Non (perte de fichiers) |

**Backup des données** :
```bash
# Sauvegarder PostgreSQL
docker-compose exec postgres pg_dump -U thoth thoth_db > backup.sql

# Restaurer
docker-compose exec -T postgres psql -U thoth thoth_db < backup.sql
```

---

## 🚀 Déploiement en Production

Pour la production, utilisez le profil nginx :

```bash
# Démarrer avec nginx
docker-compose --profile production up -d

# L'application sera accessible sur http://localhost
```

**Configuration nginx** disponible dans `nginx/nginx.conf`

---

## 📚 Ressources

- **Docker Compose Docs** : https://docs.docker.com/compose/
- **Docker Docs** : https://docs.docker.com/
- **Alembic Docs** : https://alembic.sqlalchemy.org/
- **FastAPI avec Docker** : https://fastapi.tiangolo.com/deployment/docker/
- **Next.js avec Docker** : https://nextjs.org/docs/deployment

---

## ✅ Résumé Rapide

```bash
# Configuration
cp .env.example .env
# Éditer .env et ajouter SECRET_KEY, DEEPSEEK_API_KEY, POSTGRES_PASSWORD

# Migration
docker-compose up -d postgres
sleep 10
docker-compose build backend
docker-compose run --rm backend alembic upgrade head

# Démarrage
docker-compose up -d

# Vérification
docker-compose ps
curl http://localhost:8001/health
curl http://localhost:3010

# Accéder à l'app
# http://localhost:3010/dashboard/new
```

**Temps total** : ~5 minutes

---

**Version** : 2.0.0
**Date** : 2025-01-31
**Statut** : ✅ Production Ready
