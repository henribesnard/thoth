# THOTH - Assistant Intelligent d'Écriture Littéraire

Assistant d'écriture intelligent qui accompagne les auteurs francophones dans la création de romans, nouvelles et œuvres littéraires.

## 🚀 Technologies

### Backend
- **Framework**: FastAPI 0.115
- **Langage**: Python 3.11
- **ORM**: SQLAlchemy 2.0
- **Base de données**: PostgreSQL 15
- **Cache & Queue**: Redis 7
- **Vector DB**: Qdrant
- **IA**: DeepSeek-V3, LangChain, LlamaIndex

### Frontend
- **Framework**: Next.js 15
- **Langage**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Éditeur**: Tiptap

## 📋 Prérequis

- Docker & Docker Compose
- Git

## 🛠️ Installation

1. **Cloner le dépôt**
```bash
git clone <repo-url>
cd Thoth
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos clés API
```

3. **Démarrer les services avec Docker Compose**
```bash
docker-compose up -d
```

4. **Accéder à l'application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api/docs

## 📦 Services Docker

- **postgres**: Base de données PostgreSQL (port 5432)
- **redis**: Cache & Queue (port 6379)
- **qdrant**: Vector database (port 6333)
- **backend**: API FastAPI (port 8000)
- **frontend**: Application Next.js (port 3000)
- **celery-worker**: Workers pour tâches asynchrones
- **celery-beat**: Scheduler pour tâches récurrentes

## 🔧 Développement

### Backend

```bash
cd backend

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur de développement
uvicorn app.main:app --reload

# Créer une migration
alembic revision --autogenerate -m "description"

# Appliquer les migrations
alembic upgrade head

# Tests
pytest
```

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build
npm run build

# Tests
npm run test
```

## 📁 Structure du Projet

```
Thoth/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── agents/
│   │   │   └── rag/
│   │   └── main.py
│   ├── alembic/
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── stores/
│   │   └── types/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docker/
├── nginx/
├── docker-compose.yml
└── README.md
```

## 🤖 Système d'Agents IA

THOTH utilise 11 agents IA spécialisés :

1. **Architecte Narratif** - Structure globale du récit
2. **Planificateur de Scènes** - Organisation des scènes
3. **Gestionnaire de Personnages** - Cohérence des personnages
4. **Gardien de la Chronologie** - Timeline et cohérence temporelle
5. **Analyste de Cohérence** - Détection des incohérences
6. **Expert Stylistique** - Qualité littéraire
7. **Maître des Dialogues** - Authenticité des dialogues
8. **Descripteur d'Atmosphère** - Ambiance et descriptions
9. **Rédacteur** - Génération de contenu
10. **Correcteur** - Orthographe et grammaire
11. **Synthétiseur** - Rapports et résumés

## 🔐 Sécurité

- Authentification JWT
- Variables d'environnement pour les secrets
- Validation des données avec Pydantic
- Rate limiting
- CORS configuré

## 📝 Licence

Propriétaire - Besnard © 2025

## 👤 Auteur

Besnard

## 🙏 Remerciements

- DeepSeek pour l'API IA
- La communauté FastAPI
- La communauté Next.js
