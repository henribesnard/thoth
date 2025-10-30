# Guide de Développement THOTH

Ce document décrit comment développer sur le projet THOTH.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Structure du Projet](#structure-du-projet)
4. [Développement Backend](#développement-backend)
5. [Développement Frontend](#développement-frontend)
6. [Base de Données](#base-de-données)
7. [Tests](#tests)
8. [Workflows de Développement](#workflows-de-développement)
9. [Bonnes Pratiques](#bonnes-pratiques)

---

## Prérequis

### Requis
- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Git**

### Optionnel (pour développement local sans Docker)
- **Python** 3.11+
- **Node.js** 20+
- **PostgreSQL** 15+
- **Redis** 7+

---

## Installation

### 1. Cloner le Projet

```bash
git clone <repository-url>
cd Thoth
```

### 2. Configuration des Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos propres valeurs
nano .env
```

Variables importantes à configurer :
- `DEEPSEEK_API_KEY` - Clé API DeepSeek (obligatoire)
- `SECRET_KEY` - Clé secrète pour JWT (générer une clé forte)

### 3. Démarrer les Services Docker

```bash
# Construire les images
docker-compose build

# Démarrer tous les services
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps
```

### 4. Vérifier l'Installation

```bash
# Backend API health check
curl http://localhost:8000/health

# Frontend
curl http://localhost:3000

# API Documentation
open http://localhost:8000/api/docs
```

---

## Structure du Projet

```
Thoth/
├── backend/                    # API FastAPI
│   ├── app/
│   │   ├── api/               # Endpoints API
│   │   │   └── v1/
│   │   │       └── endpoints/ # Routes par ressource
│   │   ├── core/              # Configuration & utilitaires
│   │   ├── db/                # Configuration base de données
│   │   ├── models/            # Modèles SQLAlchemy
│   │   ├── schemas/           # Schémas Pydantic (à créer)
│   │   ├── services/          # Logique métier
│   │   │   ├── agents/        # Agents IA (à créer)
│   │   │   └── rag/           # Système RAG (à créer)
│   │   └── main.py            # Point d'entrée FastAPI
│   ├── alembic/               # Migrations de base de données
│   ├── tests/                 # Tests backend
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                  # Application Next.js
│   ├── src/
│   │   ├── app/              # Pages Next.js (App Router)
│   │   ├── components/       # Composants React (à créer)
│   │   ├── lib/              # Utilitaires (à créer)
│   │   ├── stores/           # Zustand stores (à créer)
│   │   └── types/            # Types TypeScript (à créer)
│   ├── public/               # Assets statiques
│   ├── Dockerfile
│   └── package.json
│
├── nginx/                    # Configuration Nginx
├── docker-compose.yml        # Orchestration Docker
├── Makefile                  # Commandes utiles
└── docs/                     # Documentation
```

---

## Développement Backend

### Architecture FastAPI

Le backend utilise une architecture en couches :

```
Controllers (endpoints) → Services → Models → Database
```

### Démarrage en Mode Dev

#### Option 1 : Avec Docker (recommandé)

```bash
# Les changements de code sont automatiquement rechargés
docker-compose up -d backend

# Voir les logs
docker-compose logs -f backend
```

#### Option 2 : Local (sans Docker)

```bash
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Créer un Nouveau Endpoint

1. **Créer le modèle** (si nécessaire) dans `app/models/`
2. **Créer le schéma Pydantic** dans `app/schemas/`
3. **Créer le endpoint** dans `app/api/v1/endpoints/`
4. **Ajouter la logique métier** dans `app/services/`

Exemple :

```python
# app/schemas/project.py
from pydantic import BaseModel
from typing import Optional

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    genre: Optional[str] = None

class ProjectResponse(ProjectCreate):
    id: str
    owner_id: str
    created_at: datetime

# app/api/v1/endpoints/projects.py
from fastapi import APIRouter, Depends
from app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter()

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    # Logique de création
    pass
```

### Accéder au Container Backend

```bash
# Ouvrir un shell dans le container
docker-compose exec backend bash

# Ou utiliser le Makefile
make backend-shell
```

### Utiliser l'API

La documentation interactive est disponible à :
- **Swagger UI** : http://localhost:8000/api/docs
- **ReDoc** : http://localhost:8000/api/redoc

---

## Développement Frontend

### Architecture Next.js

Le frontend utilise :
- **Next.js 15** avec App Router
- **TypeScript** pour le typage
- **Zustand** pour la gestion d'état
- **TanStack Query** pour les requêtes API
- **Tailwind CSS** pour le styling
- **Tiptap** pour l'éditeur (à intégrer)

### Démarrage en Mode Dev

#### Option 1 : Avec Docker

```bash
docker-compose up -d frontend
docker-compose logs -f frontend
```

#### Option 2 : Local

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Créer une Nouvelle Page

Next.js 15 utilise le système de routing basé sur les fichiers :

```typescript
// src/app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
    </main>
  )
}
```

### Créer un Composant

```typescript
// src/components/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export default function Button({
  children,
  onClick,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        variant === 'primary'
          ? 'bg-primary-600 text-white'
          : 'bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}
```

### Gestion d'État avec Zustand

```typescript
// src/stores/useProjectStore.ts
import { create } from 'zustand'

interface Project {
  id: string
  title: string
}

interface ProjectStore {
  currentProject: Project | null
  setCurrentProject: (project: Project) => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
}))

// Utilisation dans un composant
import { useProjectStore } from '@/stores/useProjectStore'

function ProjectHeader() {
  const { currentProject } = useProjectStore()
  return <h1>{currentProject?.title}</h1>
}
```

### Appels API avec TanStack Query

```typescript
// src/lib/api.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const projectsApi = {
  getAll: () => apiClient.get('/projects'),
  getOne: (id: string) => apiClient.get(`/projects/${id}`),
  create: (data: any) => apiClient.post('/projects', data),
}

// Dans un composant
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api'

function ProjectList() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <ul>
      {data?.data.map((project) => (
        <li key={project.id}>{project.title}</li>
      ))}
    </ul>
  )
}
```

---

## Base de Données

### Migrations avec Alembic

#### Créer une Migration

```bash
# Avec Docker
docker-compose exec backend alembic revision --autogenerate -m "Description du changement"

# Ou avec le Makefile
make migration message="Description du changement"

# Local
cd backend
alembic revision --autogenerate -m "Description du changement"
```

#### Appliquer les Migrations

```bash
# Avec Docker
docker-compose exec backend alembic upgrade head

# Ou avec le Makefile
make migrate

# Local
alembic upgrade head
```

#### Rollback

```bash
# Revenir à la migration précédente
alembic downgrade -1

# Revenir à une migration spécifique
alembic downgrade <revision_id>
```

### Accéder à la Base de Données

```bash
# Avec Docker
docker-compose exec postgres psql -U thoth -d thoth_db

# Ou avec le Makefile
make db-shell

# Commandes SQL utiles
\dt          # Lister les tables
\d users     # Décrire la table users
SELECT * FROM users LIMIT 10;
```

### Qdrant (Vector Database)

Interface web disponible à : http://localhost:6333/dashboard

```python
# Exemple d'utilisation
from qdrant_client import QdrantClient

client = QdrantClient(url="http://qdrant:6333")

# Créer une collection
client.create_collection(
    collection_name="thoth_documents",
    vectors_config={"size": 1024, "distance": "Cosine"}
)

# Insérer des embeddings
client.upsert(
    collection_name="thoth_documents",
    points=[{
        "id": "1",
        "vector": [0.1, 0.2, ...],
        "payload": {"text": "content", "project_id": "123"}
    }]
)
```

---

## Tests

### Tests Backend

```bash
# Avec Docker
docker-compose exec backend pytest

# Ou avec le Makefile
make test-backend

# Avec coverage
docker-compose exec backend pytest --cov=app --cov-report=html
```

Structure des tests :

```python
# backend/tests/test_projects.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_create_project():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/projects/",
            json={"title": "Test Project"}
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Test Project"
```

### Tests Frontend

```bash
# Avec Docker
docker-compose exec frontend npm run test

# Local
cd frontend
npm run test
```

---

## Workflows de Développement

### Workflow Standard

1. **Créer une branche**
```bash
git checkout -b feature/nom-feature
```

2. **Développer et tester localement**
```bash
# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f backend frontend
```

3. **Commit**
```bash
git add .
git commit -m "feat: description du changement"
```

4. **Push et Pull Request**
```bash
git push origin feature/nom-feature
# Créer une PR sur GitHub
```

### Hot Reload

Les deux services supportent le hot reload :

- **Backend** : Uvicorn avec `--reload`
- **Frontend** : Next.js avec Fast Refresh

Les changements sont automatiquement détectés grâce aux volumes Docker :

```yaml
volumes:
  - ./backend:/app  # Backend
  - ./frontend:/app # Frontend
```

### Debugging

#### Backend

```python
# Ajouter des breakpoints avec pdb
import pdb; pdb.set_trace()

# Ou utiliser des print
print(f"Debug: {variable}")

# Logs structurés
import logging
logger = logging.getLogger(__name__)
logger.info(f"Processing project: {project_id}")
```

#### Frontend

```typescript
// Console logs
console.log('Debug:', data)

// Debugger
debugger;

// React DevTools disponible dans le navigateur
```

### Celery (Tâches Asynchrones)

```python
# app/tasks/__init__.py
from celery import shared_task

@shared_task
def analyze_document(document_id: str):
    # Logique d'analyse
    return {"status": "completed"}

# Utilisation dans un endpoint
from app.tasks import analyze_document

@router.post("/analyze")
async def trigger_analysis(document_id: str):
    task = analyze_document.delay(document_id)
    return {"task_id": task.id}
```

Monitorer les tâches avec Flower :

```bash
# Ajouter Flower au docker-compose si nécessaire
docker-compose exec celery-worker celery -A app.core.celery_app flower
# Accessible sur http://localhost:5555
```

---

## Bonnes Pratiques

### Backend

1. **Toujours utiliser des schémas Pydantic** pour la validation
2. **Séparer la logique métier** dans les services
3. **Utiliser async/await** pour toutes les opérations I/O
4. **Gérer les erreurs** avec des exceptions HTTP appropriées
5. **Documenter les endpoints** avec docstrings
6. **Typer toutes les fonctions** avec les annotations Python

```python
# ✅ Bon
async def get_project(
    project_id: str,
    db: AsyncSession
) -> Optional[Project]:
    """Récupère un projet par son ID."""
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    return result.scalar_one_or_none()

# ❌ Mauvais
def get_project(project_id, db):
    return db.query(Project).filter(
        Project.id == project_id
    ).first()
```

### Frontend

1. **Utiliser TypeScript strictement** - pas de `any`
2. **Composants fonctionnels** avec hooks
3. **Extraire la logique réutilisable** en hooks personnalisés
4. **Nommer les composants** en PascalCase
5. **Optimiser les rendus** avec React.memo si nécessaire
6. **Utiliser Tailwind CSS** pour le styling

```typescript
// ✅ Bon
interface UserProps {
  name: string
  email: string
}

function UserCard({ name, email }: UserProps) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">{name}</h3>
      <p className="text-gray-600">{email}</p>
    </div>
  )
}

// ❌ Mauvais
function UserCard(props: any) {
  return <div style={{padding: '16px'}}>{props.name}</div>
}
```

### Git

Convention de commits (Conventional Commits) :

- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage
- `refactor:` - Refactoring
- `test:` - Tests
- `chore:` - Maintenance

```bash
git commit -m "feat(projects): add project creation endpoint"
git commit -m "fix(auth): resolve JWT token expiration issue"
git commit -m "docs: update API documentation"
```

### Sécurité

1. **Ne jamais commiter** `.env` ou secrets
2. **Valider toutes les entrées** utilisateur
3. **Utiliser des requêtes paramétrées** (SQLAlchemy les gère)
4. **Implémenter l'authentification** sur les endpoints sensibles
5. **Limiter les requêtes** (rate limiting)

---

## Commandes Utiles

### Makefile

```bash
make help            # Afficher l'aide
make build           # Construire les images
make up              # Démarrer les services
make down            # Arrêter les services
make restart         # Redémarrer les services
make logs            # Voir les logs
make clean           # Nettoyer volumes et images
make backend-shell   # Shell backend
make frontend-shell  # Shell frontend
make db-shell        # Shell PostgreSQL
make migrate         # Appliquer migrations
make migration       # Créer migration
make test-backend    # Tests backend
make test-frontend   # Tests frontend
```

### Docker Compose

```bash
# Démarrer un service spécifique
docker-compose up -d backend

# Rebuild un service
docker-compose up -d --build backend

# Voir les logs d'un service
docker-compose logs -f backend

# Redémarrer un service
docker-compose restart backend

# Arrêter tout
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

---

## Ressources

### Documentation Officielle

- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/docs)
- [SQLAlchemy](https://docs.sqlalchemy.org/)
- [Pydantic](https://docs.pydantic.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Docker](https://docs.docker.com/)

### Librairies IA

- [LangChain](https://python.langchain.com/)
- [LlamaIndex](https://docs.llamaindex.ai/)
- [Qdrant](https://qdrant.tech/documentation/)
- [DeepSeek API](https://platform.deepseek.com/docs)

---

## Support

Pour toute question ou problème :

1. Vérifier cette documentation
2. Consulter les issues GitHub
3. Contacter l'équipe de développement
