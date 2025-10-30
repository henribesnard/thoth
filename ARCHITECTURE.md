# Architecture THOTH

Documentation de l'architecture technique du système THOTH.

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Système](#architecture-système)
3. [Stack Technique](#stack-technique)
4. [Modèle de Données](#modèle-de-données)
5. [Architecture Backend](#architecture-backend)
6. [Architecture Frontend](#architecture-frontend)
7. [Système d'Agents IA](#système-dagents-ia)
8. [Système RAG](#système-rag)
9. [Flux de Données](#flux-de-données)
10. [Sécurité](#sécurité)
11. [Scalabilité](#scalabilité)

---

## Vue d'Ensemble

THOTH est une application web full-stack conçue pour assister les auteurs dans l'écriture littéraire. L'architecture suit un modèle client-serveur avec une séparation claire entre le frontend (Next.js) et le backend (FastAPI).

### Principes Architecturaux

- **Séparation des Concerns** : Frontend, Backend, Base de données et IA sont découplés
- **API-First** : Toute la logique métier est exposée via une API REST
- **Asynchrone** : Utilisation d'async/await pour les opérations I/O
- **Microservices-Ready** : Architecture modulaire permettant la séparation future en microservices
- **Event-Driven** : Tâches asynchrones via Celery pour les opérations longues

---

## Architecture Système

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Next.js Frontend (Port 3000)                 │   │
│  │  - React Components                                       │   │
│  │  - Zustand State Management                               │   │
│  │  - TanStack Query (API calls)                             │   │
│  │  - Tiptap Editor                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓ HTTPS                             │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  (Nginx - Optionnel en production)                              │
│  - Reverse Proxy                                                 │
│  - Load Balancing                                                │
│  - SSL Termination                                               │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         FastAPI Backend (Port 8000)                       │   │
│  │                                                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │   API v1    │  │  Services   │  │   Models    │      │   │
│  │  │  Endpoints  │→ │   Layer     │→ │  (ORM)      │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Celery Workers                               │   │
│  │  - Document Processing                                    │   │
│  │  - RAG Indexing                                           │   │
│  │  - AI Analysis                                            │   │
│  │  - Export Generation                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                    ↓                      ↓
┌──────────────────────────┐  ┌─────────────────────────────────┐
│   PERSISTENCE LAYER      │  │      AI SERVICES LAYER          │
│                          │  │                                 │
│  ┌────────────────────┐  │  │  ┌──────────────────────────┐  │
│  │   PostgreSQL       │  │  │  │  DeepSeek API            │  │
│  │   (Primary DB)     │  │  │  │  - Chat Completion       │  │
│  │   - Users          │  │  │  │  - Reasoning             │  │
│  │   - Projects       │  │  │  └──────────────────────────┘  │
│  │   - Documents      │  │  │                                 │
│  │   - Characters     │  │  │  ┌──────────────────────────┐  │
│  └────────────────────┘  │  │  │  Qdrant Vector DB        │  │
│                          │  │  │  - Embeddings Storage    │  │
│  ┌────────────────────┐  │  │  │  - Similarity Search     │  │
│  │   Redis            │  │  │  └──────────────────────────┘  │
│  │   (Cache/Queue)    │  │  │                                 │
│  │   - Sessions       │  │  │  ┌──────────────────────────┐  │
│  │   - Celery Broker  │  │  │  │  Embedding Model         │  │
│  │   - Rate Limiting  │  │  │  │  (BGE-M3)                │  │
│  └────────────────────┘  │  │  └──────────────────────────┘  │
│                          │  │                                 │
└──────────────────────────┘  └─────────────────────────────────┘
```

---

## Stack Technique

### Backend

| Composant | Technologie | Version | Rôle |
|-----------|-------------|---------|------|
| **Framework** | FastAPI | 0.115 | API REST |
| **Langage** | Python | 3.11 | Backend |
| **ORM** | SQLAlchemy | 2.0 | Mapping objet-relationnel |
| **Migrations** | Alembic | 1.13 | Gestion des migrations DB |
| **Validation** | Pydantic | 2.9 | Validation des données |
| **Async** | asyncio/aiohttp | - | Opérations asynchrones |
| **Queue** | Celery | 5.4 | Tâches asynchrones |
| **Cache** | Redis | 7 | Cache et broker Celery |

### Frontend

| Composant | Technologie | Version | Rôle |
|-----------|-------------|---------|------|
| **Framework** | Next.js | 15 | SSR/SSG Framework |
| **Langage** | TypeScript | 5.6 | Typage statique |
| **UI Library** | React | 18.3 | Composants UI |
| **State** | Zustand | 4.5 | Gestion d'état |
| **API Client** | TanStack Query | 5.56 | Requêtes API |
| **Forms** | React Hook Form | 7.53 | Gestion formulaires |
| **Styling** | Tailwind CSS | 3.4 | Styles utilitaires |
| **Editor** | Tiptap | 2.6 | Éditeur riche |

### IA & NLP

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| **LLM** | DeepSeek-V3 | Génération de texte |
| **Reasoning** | DeepSeek-R1 | Raisonnement complexe |
| **Orchestration** | LangChain | Chaînes LLM |
| **RAG** | LlamaIndex | Retrieval Augmented Generation |
| **Embeddings** | BGE-M3 | Embeddings multilingues (1024d) |
| **Vector DB** | Qdrant | Stockage et recherche vectorielle |
| **NLP Français** | spaCy | Analyse linguistique |

### Infrastructure

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| **Database** | PostgreSQL | 15 | Base de données principale |
| **Containerization** | Docker | - | Conteneurisation |
| **Orchestration** | Docker Compose | - | Orchestration locale |
| **Reverse Proxy** | Nginx | - | Proxy inverse (production) |

---

## Modèle de Données

### Schéma de Base de Données

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    full_name VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    subscription_tier VARCHAR DEFAULT 'free',
    subscription_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR,
    status VARCHAR DEFAULT 'draft',
    target_word_count INTEGER,
    current_word_count INTEGER DEFAULT 0,
    structure_template VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    document_type VARCHAR DEFAULT 'chapter',
    order_index INTEGER DEFAULT 0,
    word_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Characters
CREATE TABLE characters (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    physical_description TEXT,
    personality TEXT,
    backstory TEXT,
    metadata JSONB DEFAULT '{}',
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Relations

```
User (1) ──→ (N) Project
Project (1) ──→ (N) Document
Project (1) ──→ (N) Character
```

### Modèles Additionnels à Créer

- **Timeline** : Événements chronologiques du récit
- **Location** : Lieux dans l'univers du récit
- **Scene** : Scènes individuelles
- **AnalysisReport** : Rapports d'analyse des agents
- **ExportJob** : Jobs d'export (PDF, EPUB)

---

## Architecture Backend

### Couches

```
┌──────────────────────────────────────┐
│         API Layer (Endpoints)        │  ← FastAPI routes
├──────────────────────────────────────┤
│         Service Layer                │  ← Business logic
├──────────────────────────────────────┤
│         Repository Layer             │  ← Data access (optionnel)
├──────────────────────────────────────┤
│         Model Layer (ORM)            │  ← SQLAlchemy models
├──────────────────────────────────────┤
│         Database (PostgreSQL)        │
└──────────────────────────────────────┘
```

### Structure des Modules

```python
app/
├── api/
│   └── v1/
│       ├── __init__.py           # API router principal
│       └── endpoints/
│           ├── auth.py           # Authentification
│           ├── projects.py       # Gestion projets
│           ├── documents.py      # Gestion documents
│           ├── characters.py     # Gestion personnages (à créer)
│           ├── agents.py         # Agents IA
│           └── rag.py            # RAG endpoints (à créer)
│
├── core/
│   ├── config.py                 # Configuration
│   ├── security.py               # JWT, hashing (à créer)
│   └── celery_app.py             # Configuration Celery
│
├── db/
│   ├── base.py                   # Base SQLAlchemy
│   └── session.py                # Sessions DB
│
├── models/                       # Modèles SQLAlchemy
│   ├── user.py
│   ├── project.py
│   ├── document.py
│   └── character.py
│
├── schemas/                      # Schémas Pydantic (à créer)
│   ├── user.py
│   ├── project.py
│   ├── document.py
│   └── character.py
│
├── services/                     # Logique métier
│   ├── agents/                   # Services des agents IA
│   │   ├── base.py              # Agent de base
│   │   ├── narrative.py         # Agent narratif
│   │   ├── character.py         # Agent personnages
│   │   └── ...                  # 9 autres agents
│   │
│   ├── rag/                     # Système RAG
│   │   ├── indexer.py           # Indexation documents
│   │   ├── retriever.py         # Récupération contexte
│   │   └── embeddings.py        # Génération embeddings
│   │
│   ├── llm.py                   # Service DeepSeek
│   ├── auth.py                  # Service authentification
│   └── export.py                # Export PDF/EPUB
│
├── tasks/                       # Tâches Celery
│   ├── __init__.py
│   ├── document_processing.py
│   ├── rag_indexing.py
│   └── analysis.py
│
└── main.py                      # Point d'entrée FastAPI
```

### Patterns Utilisés

#### Dependency Injection

FastAPI utilise l'injection de dépendances :

```python
from fastapi import Depends
from app.db.session import get_db

@router.get("/projects/{project_id}")
async def get_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),  # Injection DB
    current_user: User = Depends(get_current_user)  # Injection user
):
    pass
```

#### Service Pattern

La logique métier est dans les services :

```python
# services/project_service.py
class ProjectService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_project(self, data: ProjectCreate, user_id: str):
        # Logique de création
        pass

# Dans un endpoint
@router.post("/projects")
async def create_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    service = ProjectService(db)
    return await service.create_project(data, user_id)
```

---

## Architecture Frontend

### Structure

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Page d'accueil
│   ├── globals.css             # Styles globaux
│   │
│   ├── auth/                   # Pages authentification
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── dashboard/              # Dashboard utilisateur
│   │   └── page.tsx
│   │
│   └── project/                # Pages projet
│       └── [id]/
│           ├── page.tsx        # Vue projet
│           ├── editor/page.tsx # Éditeur
│           ├── structure/page.tsx
│           ├── characters/page.tsx
│           └── timeline/page.tsx
│
├── components/                 # Composants réutilisables
│   ├── ui/                    # Composants UI de base
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   │
│   ├── editor/                # Composants éditeur
│   │   ├── TiptapEditor.tsx
│   │   └── EditorToolbar.tsx
│   │
│   └── project/               # Composants projet
│       ├── ProjectCard.tsx
│       └── CharacterCard.tsx
│
├── lib/                       # Utilitaires
│   ├── api.ts                # Client API
│   ├── utils.ts              # Fonctions utilitaires
│   └── constants.ts          # Constantes
│
├── stores/                   # Zustand stores
│   ├── useUserStore.ts
│   ├── useProjectStore.ts
│   ├── useEditorStore.ts
│   └── useAgentStore.ts
│
├── types/                    # Types TypeScript
│   ├── user.ts
│   ├── project.ts
│   ├── document.ts
│   └── api.ts
│
└── hooks/                    # Hooks personnalisés
    ├── useAuth.ts
    ├── useProject.ts
    └── useAgent.ts
```

### État Global (Zustand)

```typescript
// stores/useProjectStore.ts
interface ProjectStore {
  currentProject: Project | null
  projects: Project[]
  setCurrentProject: (project: Project) => void
  loadProjects: () => Promise<void>
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,
  projects: [],

  setCurrentProject: (project) =>
    set({ currentProject: project }),

  loadProjects: async () => {
    const { data } = await projectsApi.getAll()
    set({ projects: data })
  }
}))
```

### Communication API

```typescript
// lib/api.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const projectsApi = {
  getAll: () => apiClient.get('/projects'),
  getOne: (id: string) => apiClient.get(`/projects/${id}`),
  create: (data: ProjectCreate) => apiClient.post('/projects', data),
  update: (id: string, data: ProjectUpdate) =>
    apiClient.put(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
}
```

---

## Système d'Agents IA

### Architecture des Agents

```python
# services/agents/base.py
class BaseAgent:
    def __init__(self, llm_service: LLMService, rag_service: RAGService):
        self.llm = llm_service
        self.rag = rag_service
        self.name = "BaseAgent"
        self.system_prompt = ""

    async def analyze(self, context: Dict) -> AgentResult:
        """Méthode principale d'analyse"""
        # 1. Récupérer le contexte via RAG
        rag_context = await self.get_context(context)

        # 2. Construire le prompt
        prompt = self.build_prompt(context, rag_context)

        # 3. Appeler le LLM
        response = await self.llm.complete(prompt, self.system_prompt)

        # 4. Parser et retourner le résultat
        return self.parse_response(response)

    async def get_context(self, context: Dict) -> str:
        """Récupère le contexte pertinent via RAG"""
        return await self.rag.retrieve(
            project_id=context['project_id'],
            query=context.get('query'),
            filters=self.get_filters()
        )

    def build_prompt(self, context: Dict, rag_context: str) -> str:
        """Construit le prompt pour le LLM"""
        raise NotImplementedError

    def parse_response(self, response: str) -> AgentResult:
        """Parse la réponse du LLM"""
        raise NotImplementedError
```

### Les 11 Agents

1. **NarrativeArchitectAgent** - Structure narrative
2. **ScenePlannerAgent** - Organisation des scènes
3. **CharacterManagerAgent** - Gestion personnages
4. **TimelineGuardianAgent** - Chronologie
5. **ConsistencyAnalystAgent** - Cohérence globale
6. **StyleExpertAgent** - Qualité stylistique
7. **DialogueMasterAgent** - Authenticité dialogues
8. **AtmosphereDescriptorAgent** - Descriptions
9. **WriterAgent** - Génération de contenu
10. **CorrectorAgent** - Orthographe/grammaire
11. **SynthesizerAgent** - Rapports et résumés

### Orchestrateur d'Agents

```python
# services/agent_orchestrator.py
class AgentOrchestrator:
    def __init__(self):
        self.agents = self.initialize_agents()

    async def run_full_analysis(self, project_id: str):
        """Lance tous les agents en parallèle"""
        tasks = [
            agent.analyze({'project_id': project_id})
            for agent in self.agents.values()
        ]

        results = await asyncio.gather(*tasks)

        return self.aggregate_results(results)

    async def run_specific_agent(self, agent_name: str, context: Dict):
        """Lance un agent spécifique"""
        agent = self.agents.get(agent_name)
        if not agent:
            raise ValueError(f"Agent {agent_name} not found")

        return await agent.analyze(context)
```

---

## Système RAG

### Architecture RAG

```
Document → Chunking → Embedding → Qdrant
                                      ↓
Query → Embedding → Similarity Search → Context → LLM
```

### Indexation

```python
# services/rag/indexer.py
class RAGIndexer:
    def __init__(self, qdrant_client, embedding_model):
        self.qdrant = qdrant_client
        self.embedder = embedding_model

    async def index_document(self, document: Document):
        # 1. Chunking
        chunks = self.chunk_text(
            document.content,
            chunk_size=512,
            overlap=50
        )

        # 2. Generate embeddings
        embeddings = await self.embedder.embed_batch(chunks)

        # 3. Store in Qdrant
        points = [
            {
                "id": f"{document.id}_{i}",
                "vector": embedding,
                "payload": {
                    "text": chunk,
                    "document_id": str(document.id),
                    "project_id": str(document.project_id),
                    "chunk_index": i
                }
            }
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))
        ]

        await self.qdrant.upsert(
            collection_name="thoth_documents",
            points=points
        )
```

### Retrieval

```python
# services/rag/retriever.py
class RAGRetriever:
    def __init__(self, qdrant_client, embedding_model):
        self.qdrant = qdrant_client
        self.embedder = embedding_model

    async def retrieve(
        self,
        project_id: str,
        query: str,
        top_k: int = 5
    ) -> List[str]:
        # 1. Embed query
        query_embedding = await self.embedder.embed(query)

        # 2. Search in Qdrant
        results = await self.qdrant.search(
            collection_name="thoth_documents",
            query_vector=query_embedding,
            query_filter={
                "must": [{"key": "project_id", "match": {"value": project_id}}]
            },
            limit=top_k
        )

        # 3. Extract and return texts
        return [result.payload["text"] for result in results]
```

---

## Flux de Données

### Flux de Rédaction

```
1. User tape dans l'éditeur (Frontend)
   ↓
2. Debounce 300ms
   ↓
3. POST /api/v1/documents/{id}/save (Backend)
   ↓
4. Sauvegarde en DB (PostgreSQL)
   ↓
5. Celery task: Index dans RAG (async)
   ↓
6. User demande suggestion (Tab)
   ↓
7. GET /api/v1/agents/suggest
   ↓
8. RAG retrieve context
   ↓
9. LLM génère suggestion
   ↓
10. WebSocket streaming → Frontend
    ↓
11. Affichage en temps réel
```

### Flux d'Analyse

```
1. User clique "Analyser"
   ↓
2. POST /api/v1/analysis/full
   ↓
3. Création Celery task
   ↓
4. Frontend poll: GET /api/v1/analysis/status/{task_id}
   ↓
5. Celery worker:
   - Lance 11 agents en parallèle
   - Chaque agent:
     * Retrieve context (RAG)
     * Analyse avec LLM
     * Retourne résultats
   ↓
6. Agrégation des résultats
   ↓
7. Sauvegarde rapport en DB
   ↓
8. Frontend récupère: GET /api/v1/analysis/report/{task_id}
   ↓
9. Affichage dashboard interactif
```

---

## Sécurité

### Authentification

- **JWT Tokens** pour l'authentification
- Tokens stockés en localStorage (frontend)
- Refresh tokens pour renouvellement
- Expiration configurable (défaut: 7 jours)

### Autorisation

```python
# Middleware de vérification
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    # Vérifier et décoder le JWT
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    user_id = payload.get("sub")

    # Récupérer l'utilisateur
    user = await db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401)

    return user

# Utilisation dans un endpoint
@router.get("/projects")
async def get_projects(
    current_user: User = Depends(get_current_user)
):
    # current_user est automatiquement injecté
    pass
```

### Protection des Données

- Mots de passe hashés avec bcrypt
- Variables d'environnement pour les secrets
- CORS configuré
- Rate limiting sur les endpoints
- Validation stricte des entrées (Pydantic)

---

## Scalabilité

### Stratégies de Scaling

#### Horizontal Scaling

- **Backend** : Multiples instances FastAPI derrière un load balancer
- **Celery Workers** : Scaling horizontal facile
- **Database** : Read replicas PostgreSQL
- **Qdrant** : Cluster mode pour haute disponibilité

#### Vertical Scaling

- Augmentation RAM/CPU des containers
- Optimisation des queries SQL
- Caching agressif avec Redis

### Optimisations

1. **Database Indexing**
```sql
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_characters_project_id ON characters(project_id);
CREATE INDEX idx_users_email ON users(email);
```

2. **Caching**
```python
# Cache avec Redis
@cache(ttl=300)  # 5 minutes
async def get_project(project_id: str):
    pass
```

3. **Connection Pooling**
```python
# SQLAlchemy connection pool
engine = create_async_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20
)
```

### Monitoring

- **Logs** : Logging structuré avec Python logging
- **Metrics** : À intégrer (Prometheus + Grafana)
- **Tracing** : À intégrer (Sentry ou Jaeger)
- **Health Checks** : Endpoints `/health` et `/health/db`

---

## Prochaines Étapes d'Architecture

1. **Implémenter les schémas Pydantic** pour validation
2. **Créer les 11 agents IA** avec leurs prompts
3. **Implémenter le système RAG complet**
4. **Ajouter l'authentification JWT**
5. **Créer l'éditeur Tiptap** côté frontend
6. **WebSockets** pour streaming en temps réel
7. **Système de cache** avec décorateurs
8. **Rate limiting** sur les endpoints
9. **Monitoring et observabilité**
10. **Tests unitaires et d'intégration**

---

## Références

- [FastAPI Best Practices](https://fastapi.tiangolo.com/tutorial/)
- [SQLAlchemy 2.0 Docs](https://docs.sqlalchemy.org/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [LangChain Python](https://python.langchain.com/)
