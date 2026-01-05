# THOTH - Assistant d'ecriture litteraire

THOTH accompagne les auteurs francophones dans la creation de romans, nouvelles et autres oeuvres, avec un backend API, une interface web et une application mobile.

## Stack
- Backend: FastAPI 0.115, Python 3.11, SQLAlchemy, PostgreSQL, Redis, Qdrant
- Frontend web: Next.js 15, TypeScript, Tailwind CSS
- Mobile: React Native + Expo
- IA: DeepSeek (chat + agents), LangChain, LangGraph

## Demarrage rapide (Docker)
1. Copier `.env.example` vers `.env`
2. Renseigner `DEEPSEEK_API_KEY` et `SECRET_KEY`
3. Lancer `docker-compose up -d`

Acces:
- Web: http://localhost:3020
- API: http://localhost:8002/api/v1
- Docs API: http://localhost:8002/api/docs
- Health: http://localhost:8002/health

## Pipeline d'ecriture (LangChain + LangGraph)
Le pipeline est orchestre par LangGraph et utilise LangChain pour le split et la recherche contextuelle (RAG).
Il collecte le contexte d'ecriture automatiquement (projet, personnages, documents, contraintes), puis genere
les chapitres avec retrieval sur Qdrant.

Endpoints:
- POST `/api/v1/writing/index` : indexer tous les documents d'un projet
- POST `/api/v1/writing/generate-chapter` : generer un chapitre avec contexte et RAG
- POST `/api/v1/writing/generate-book` : generer un livre complet (outline + chapitres)

## Ce qui est fait
### Backend (API)
- Authentification JWT (register/login/me) et securite (hashing, ownership)
- CRUD projets/documents/personnages avec pagination
- Comptage automatique des mots (document et projet)
- Chat THOTH avec contexte projet et historique persistant (DeepSeek)
- Agents IA disponibles: narrative_architect, character_manager, style_expert, dialogue_master
- Contexte projet assemble automatiquement pour les agents (via project_id)
- Import de fichiers (txt, docx, pdf, md) vers documents, extraction et word count
- RAG avec Qdrant (indexation + retrieval) et split LangChain
- Pipeline d'ecriture LangGraph (plan -> generation -> sauvegarde chapitre)
- Generation de livre complet (outline + chapitres)
- Health check
- Docker Compose (postgres, redis, qdrant, backend, frontend, celery)

### Frontend web (Next.js)
- Pages d'authentification (login/register)
- Dashboard moderne (stats, liste de projets, creation via wizard)
- Page projet (vue d'ensemble + listes documents/personnages + chat contextuel)
- Interface de chat integree

### Mobile (React Native/Expo)
- Authentification (login/register)
- Dashboard avec stats et projets
- Creation de projet
- Detail de projet
- Chat THOTH contextuel

## Ce qui reste a faire
### Backend / IA
- Completer les 7 agents restants et leurs actions
- Taches asynchrones avec Celery pour traitements lourds (indexation, imports, etc.)
- Boucles de coherence multi-chapitres (relecture globale, contradictions, timeline)

### Frontend web
- Editeur Tiptap (ecriture, autosave)
- Creation/edition/reorganisation des documents
- Creation/edition des personnages
- UI d'import de documents (branchee sur `/upload`)

### Mobile
- Gestion des documents (liste, edition)
- Gestion des personnages
- Import de documents

### Qualite
- Tests backend, web et mobile

## Documentation encore utile
- `ARCHITECTURE.md` (architecture technique)
- `DEVELOPMENT.md` (guide de dev)
- `API_TESTING_GUIDE.md` (tests API)
- `DEPLOIEMENT_DOCKER.md` (deploiement Docker)
