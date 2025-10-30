# 🚀 THOTH - Commencez Ici !

**Bienvenue dans le projet THOTH !**

Ce guide vous permet de démarrer rapidement avec le backend fraîchement développé.

---

## ⚡ Démarrage Rapide (5 minutes)

### Étape 1 : Prérequis

```bash
# Vérifiez que Docker est installé
docker --version
docker-compose --version
```

### Étape 2 : Configuration

```bash
# Copiez le fichier d'environnement
cp .env.example .env

# Éditez .env et ajoutez votre clé DeepSeek (optionnel pour le moment)
# DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxx
```

### Étape 3 : Démarrage

```bash
# Construire et démarrer tous les services
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps
```

Vous devriez voir :
- ✅ thoth-postgres (port 5432)
- ✅ thoth-redis (port 6379)
- ✅ thoth-qdrant (port 6333)
- ✅ thoth-backend (port 8000)
- ✅ thoth-frontend (port 3000)
- ✅ thoth-celery-worker
- ✅ thoth-celery-beat

### Étape 4 : Test Rapide

```bash
# Test health check
curl http://localhost:8000/health
```

**Résultat attendu :**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development"
}
```

---

## 🎉 Backend Fonctionnel !

Le backend THOTH est maintenant opérationnel avec :

✅ **22 endpoints API** fonctionnels
✅ **Authentification JWT** sécurisée
✅ **CRUD complet** pour Projects, Documents, Characters
✅ **Documentation interactive** Swagger

---

## 📚 Que Faire Ensuite ?

### Option 1 : Tester l'API (Recommandé)

**Via l'interface Swagger (Plus simple) :**

1. Ouvrez : http://localhost:8000/api/docs
2. Testez les endpoints directement depuis l'interface !

**Via cURL (Manuel) :**

Consultez le guide détaillé : [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)

### Option 2 : Comprendre l'Architecture

Lisez les documents dans cet ordre :

1. **README.md** - Vue d'ensemble (5 min)
2. **BACKEND_COMPLETE.md** - Ce qui vient d'être développé (10 min)
3. **ARCHITECTURE.md** - Architecture technique (référence)
4. **DEVELOPMENT.md** - Guide de développement (référence)

### Option 3 : Développer le Frontend

Le backend est prêt, vous pouvez maintenant :

1. Développer les pages d'authentification
2. Créer le dashboard
3. Intégrer l'éditeur Tiptap

Consultez **ROADMAP.md** pour le plan détaillé.

---

## 🧪 Test Rapide Complet

Voici un test complet en 30 secondes :

```bash
# 1. Inscrire un utilisateur
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'

# 2. Se connecter
curl -X POST http://localhost:8000/api/v1/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Copiez le token retourné, puis :

# 3. Créer un projet
curl -X POST http://localhost:8000/api/v1/projects/ \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mon Premier Roman","genre":"fantasy","target_word_count":100000}'

# 4. Voir vos projets
curl http://localhost:8000/api/v1/projects/ \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

✅ **Si ça fonctionne, félicitations ! Le backend est opérationnel.**

---

## 📊 État du Projet

### ✅ Terminé (Backend Core - Sprint 1)

**Infrastructure :**
- ✅ Docker Compose avec 8 services
- ✅ PostgreSQL, Redis, Qdrant configurés
- ✅ Backend FastAPI structuré

**Fonctionnalités Backend :**
- ✅ Schémas Pydantic (validation)
- ✅ Authentification JWT complète
- ✅ Services métier (auth, user, project, document, character)
- ✅ Endpoints API CRUD complets
- ✅ Sécurité (hashing, tokens, ownership)
- ✅ Word count automatique
- ✅ Documentation Swagger

**Documentation :**
- ✅ 7 documents techniques complets
- ✅ Guide de test API
- ✅ Architecture documentée

### ⏳ En Cours / À Faire

**Frontend (Sprint 2) :**
- ⬜ Pages d'authentification
- ⬜ Dashboard
- ⬜ Composants UI de base

**Éditeur & RAG (Sprints 3-4) :**
- ⬜ Intégration Tiptap
- ⬜ Système RAG avec Qdrant
- ⬜ Indexation automatique

**Agents IA (Sprints 5-7) :**
- ⬜ 11 agents spécialisés
- ⬜ Orchestrateur
- ⬜ Interface d'analyse

---

## 🔧 Commandes Utiles

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Logs en temps réel
docker-compose logs -f backend

# Redémarrer backend après changement code
docker-compose restart backend

# Shell backend
docker-compose exec backend bash

# Accéder à PostgreSQL
docker-compose exec postgres psql -U thoth -d thoth_db

# Nettoyer tout (⚠️ supprime les données)
docker-compose down -v
```

---

## 📖 Documentation Disponible

| Document | Description | Durée |
|----------|-------------|-------|
| **START_HERE.md** | Ce fichier - Démarrage rapide | 5 min |
| **README.md** | Vue d'ensemble du projet | 10 min |
| **BACKEND_COMPLETE.md** | Backend développé (Sprint 1) | 15 min |
| **API_TESTING_GUIDE.md** | Guide de test API complet | 30 min |
| **ARCHITECTURE.md** | Architecture technique | 1h (référence) |
| **DEVELOPMENT.md** | Guide développement | 1h (référence) |
| **ROADMAP.md** | Plan de développement | 30 min |
| **PROJECT_STATUS.md** | État actuel du projet | 20 min |
| **QUICKSTART.md** | Guide installation | 10 min |

---

## 🎯 Priorités Immédiates

### Si vous voulez tester l'API :
1. Lisez **API_TESTING_GUIDE.md**
2. Ouvrez http://localhost:8000/api/docs
3. Testez les endpoints

### Si vous voulez développer le Frontend :
1. Lisez **DEVELOPMENT.md** section Frontend
2. Consultez **ROADMAP.md** Sprint 2
3. Commencez par les pages d'authentification

### Si vous voulez comprendre l'architecture :
1. Lisez **BACKEND_COMPLETE.md**
2. Consultez **ARCHITECTURE.md**
3. Explorez le code dans `backend/app/`

---

## 🆘 Problèmes Courants

### Les services ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Rebuild les images
docker-compose build --no-cache
docker-compose up -d
```

### Port déjà utilisé (8000, 3000, etc.)

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <pid> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9

# Ou changez les ports dans docker-compose.yml
```

### Erreur de connexion base de données

```bash
# Recréer la base
docker-compose down
docker-compose up -d postgres
# Attendre 10 secondes
docker-compose up -d backend
```

---

## 🎊 Félicitations !

Vous avez maintenant un projet THOTH fonctionnel avec :

- ✅ Infrastructure Docker complète
- ✅ Backend API REST fonctionnel
- ✅ Authentification JWT
- ✅ CRUD complet pour toutes les ressources
- ✅ Documentation exhaustive

**Le Sprint 1 est terminé avec succès ! 🚀**

---

## 📞 Besoin d'Aide ?

1. Consultez la documentation dans le dossier du projet
2. Vérifiez **DEVELOPMENT.md** pour les détails techniques
3. Lisez **API_TESTING_GUIDE.md** pour les tests
4. Créez une issue GitHub si vous trouvez un bug

---

## 🚀 Prochaine Étape

**Choisissez votre chemin :**

**A. Testeur** → Lisez API_TESTING_GUIDE.md et testez l'API
**B. Développeur Frontend** → Consultez ROADMAP.md Sprint 2
**C. Développeur Backend** → Consultez ROADMAP.md Sprint 3-4 (RAG)
**D. Architecte** → Lisez ARCHITECTURE.md en détail

---

**Bon développement ! 💻**

**Dernière mise à jour** : 29 Octobre 2025
