# 🚀 Guide de Démarrage Rapide THOTH

Bienvenue dans le projet THOTH ! Ce guide vous permettra de démarrer rapidement.

## ⚡ Démarrage en 5 Minutes

### 1. Prérequis

Vérifiez que vous avez installé :
- ✅ Docker Desktop (Windows/Mac) ou Docker + Docker Compose (Linux)
- ✅ Git

```bash
# Vérifier Docker
docker --version
docker-compose --version
```

### 2. Installation

```bash
# Cloner le projet
git clone <votre-repo-url>
cd Thoth

# Configurer les variables d'environnement
cp .env.example .env

# Éditer .env et ajouter votre clé DeepSeek
# DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxx
```

### 3. Lancer le Projet

```bash
# Construire les images Docker
docker-compose build

# Démarrer tous les services
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps
```

Vous devriez voir tous les services en état "Up" :
- `thoth-postgres` (port 5432)
- `thoth-redis` (port 6379)
- `thoth-qdrant` (port 6333)
- `thoth-backend` (port 8000)
- `thoth-frontend` (port 3000)
- `thoth-celery-worker`
- `thoth-celery-beat`

### 4. Accéder à l'Application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000
- **API Docs** : http://localhost:8000/api/docs
- **Health Check** : http://localhost:8000/health

---

## 📚 Documentation Disponible

### Pour Bien Démarrer
1. **README.md** - Vue d'ensemble du projet
2. **QUICKSTART.md** - Ce fichier (démarrage rapide)
3. **PROJECT_STATUS.md** - État actuel du projet

### Pour Développer
4. **DEVELOPMENT.md** - Guide complet de développement
5. **ARCHITECTURE.md** - Documentation de l'architecture
6. **ROADMAP.md** - Plan de développement

### Ordre de Lecture Recommandé
1. Lisez d'abord **README.md** (5 min)
2. Suivez **QUICKSTART.md** (ce fichier) pour lancer le projet
3. Consultez **PROJECT_STATUS.md** pour voir ce qui est fait
4. Référez-vous à **DEVELOPMENT.md** quand vous codez
5. Consultez **ARCHITECTURE.md** pour comprendre la structure
6. Suivez **ROADMAP.md** pour la planification

---

## 🛠️ Commandes Essentielles

### Via Makefile (Recommandé)

```bash
# Démarrer
make up

# Arrêter
make down

# Voir les logs
make logs

# Redémarrer
make restart

# Nettoyer (⚠️ supprime les données)
make clean

# Accéder au backend
make backend-shell

# Accéder au frontend
make frontend-shell

# Accéder à la base de données
make db-shell

# Appliquer migrations
make migrate

# Créer une migration
make migration message="Description"

# Tests
make test-backend
make test-frontend

# Aide
make help
```

### Via Docker Compose

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend

# Redémarrer un service
docker-compose restart backend

# Rebuild et redémarrer
docker-compose up -d --build backend

# Exécuter une commande dans un service
docker-compose exec backend bash
docker-compose exec frontend npm install
docker-compose exec postgres psql -U thoth -d thoth_db
```

---

## 🏗️ Structure du Projet

```
Thoth/
├── backend/              # API FastAPI (Python)
│   ├── app/
│   │   ├── api/         # Endpoints API
│   │   ├── core/        # Configuration
│   │   ├── models/      # Modèles DB
│   │   ├── services/    # Logique métier
│   │   └── main.py      # Point d'entrée
│   ├── alembic/         # Migrations DB
│   ├── tests/           # Tests
│   └── requirements.txt # Dépendances Python
│
├── frontend/            # Application Next.js (TypeScript)
│   ├── src/
│   │   ├── app/        # Pages
│   │   ├── components/ # Composants React
│   │   ├── lib/        # Utilitaires
│   │   └── stores/     # État global (Zustand)
│   └── package.json    # Dépendances Node
│
├── docker-compose.yml   # Orchestration Docker
├── Makefile            # Commandes pratiques
├── .env                # Variables d'environnement (à créer)
└── docs/               # Documentation
```

---

## 🎯 Prochaines Étapes

### Phase 1 : Backend Core (Semaines 1-2)

**Objectif** : Authentification et CRUD fonctionnels

#### Tâches Prioritaires

1. **Créer les Schémas Pydantic**
   ```python
   # backend/app/schemas/user.py
   # backend/app/schemas/project.py
   # backend/app/schemas/document.py
   ```

2. **Implémenter l'Authentification**
   ```python
   # backend/app/core/security.py
   # backend/app/api/v1/endpoints/auth.py
   ```

3. **Créer les Services**
   ```python
   # backend/app/services/auth_service.py
   # backend/app/services/project_service.py
   # backend/app/services/document_service.py
   ```

4. **Compléter les Endpoints**
   - POST /auth/register
   - POST /auth/login
   - GET /projects
   - POST /projects
   - GET /documents
   - POST /documents

5. **Créer les Migrations**
   ```bash
   docker-compose exec backend alembic revision --autogenerate -m "Initial tables"
   docker-compose exec backend alembic upgrade head
   ```

6. **Écrire les Tests**
   ```python
   # backend/tests/test_auth.py
   # backend/tests/test_projects.py
   ```

### Phase 2 : Frontend Core (Semaines 3-4)

**Objectif** : Interface utilisateur de base

1. **Pages d'Authentification**
   - Login page
   - Register page

2. **Dashboard**
   - Liste des projets
   - Création de projet

3. **Configuration API**
   - Client axios
   - Stores Zustand

---

## 🐛 Résolution de Problèmes

### Les Services ne Démarrent Pas

```bash
# Voir les logs
docker-compose logs

# Rebuild les images
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Port Déjà Utilisé

Si un port est déjà pris (3000, 8000, 5432, etc.) :

```bash
# Option 1 : Arrêter le service qui utilise le port
# Windows
netstat -ano | findstr :8000
taskkill /PID <pid> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9

# Option 2 : Changer le port dans docker-compose.yml
# Par exemple, changer 8000:8000 en 8001:8000
```

### Erreur de Base de Données

```bash
# Recréer la base de données
docker-compose down -v
docker-compose up -d postgres
docker-compose exec backend alembic upgrade head
```

### Problèmes de Dépendances

```bash
# Backend
docker-compose exec backend pip install -r requirements.txt

# Frontend
docker-compose exec frontend npm install
```

---

## 📊 Vérifier que Tout Fonctionne

### Tests Manuels

```bash
# 1. Backend Health Check
curl http://localhost:8000/health
# Devrait retourner: {"status":"healthy","version":"1.0.0"}

# 2. Database Health Check
curl http://localhost:8000/api/v1/health/db
# Devrait retourner: {"status":"healthy","database":"connected"}

# 3. Frontend
curl http://localhost:3000
# Devrait retourner le HTML de la page d'accueil

# 4. PostgreSQL
docker-compose exec postgres psql -U thoth -d thoth_db -c "SELECT version();"

# 5. Redis
docker-compose exec redis redis-cli ping
# Devrait retourner: PONG

# 6. Qdrant
curl http://localhost:6333/
# Devrait retourner du JSON avec info sur Qdrant
```

### Dashboard Qdrant

Accédez à http://localhost:6333/dashboard pour voir l'interface Qdrant.

---

## 💡 Conseils de Développement

### 1. Utiliser le Hot Reload

Les changements de code sont automatiquement détectés :
- **Backend** : Uvicorn recharge automatiquement
- **Frontend** : Next.js Fast Refresh

### 2. Logs en Temps Réel

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
```

### 3. Base de Données

```bash
# Accéder à PostgreSQL
make db-shell

# Commandes SQL utiles
\dt                  # Lister les tables
\d users             # Décrire table users
SELECT * FROM users; # Query
\q                   # Quitter
```

### 4. Python Shell

```bash
# Ouvrir un shell Python dans le backend
docker-compose exec backend python

# Importer et tester
>>> from app.core.config import settings
>>> print(settings.DATABASE_URL)
```

---

## 📖 Ressources Utiles

### Documentation Officielle
- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/docs)
- [SQLAlchemy](https://docs.sqlalchemy.org/)
- [Docker](https://docs.docker.com/)
- [Qdrant](https://qdrant.tech/documentation/)

### Tutoriels
- [FastAPI Full Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Next.js Learn](https://nextjs.org/learn)
- [Docker Compose Tutorial](https://docs.docker.com/compose/gettingstarted/)

### Outils
- **Postman** - Tester les API
- **DBeaver** - Client PostgreSQL graphique
- **Redis Insight** - Client Redis graphique

---

## 🆘 Besoin d'Aide ?

1. **Consultez la documentation** dans le dossier du projet
2. **Vérifiez PROJECT_STATUS.md** pour voir ce qui est fait
3. **Lisez DEVELOPMENT.md** pour les détails techniques
4. **Créez une issue** sur GitHub si vous trouvez un bug

---

## ✅ Checklist de Démarrage

- [ ] Docker et Docker Compose installés
- [ ] Projet cloné
- [ ] Fichier `.env` créé avec `DEEPSEEK_API_KEY`
- [ ] Images Docker construites (`docker-compose build`)
- [ ] Services démarrés (`docker-compose up -d`)
- [ ] Tous les services sont "Up" (`docker-compose ps`)
- [ ] Backend accessible (http://localhost:8000/health)
- [ ] Frontend accessible (http://localhost:3000)
- [ ] Documentation lue (au moins README.md)

---

## 🎉 Vous Êtes Prêt !

Vous avez maintenant :
- ✅ Environnement de développement fonctionnel
- ✅ Infrastructure Docker complète
- ✅ Backend et Frontend de base
- ✅ Documentation complète

**Prochaine étape** : Commencez à coder ! 🚀

Consultez **PROJECT_STATUS.md** section "Priorités Immédiates" pour savoir par où commencer.

---

**Dernière mise à jour** : 29 Octobre 2025
