# THOTH - Assistant d'ecriture litteraire

THOTH accompagne les auteurs francophones pour structurer, generer et corriger des oeuvres longues
(roman, nouvelles, essais). Le systeme combine une application web, un backend API et un pipeline
IA oriente edition.

## Architecture technique
- Frontend web: Next.js 15, TypeScript, Tailwind CSS.
- Backend API: FastAPI, Python 3.11, SQLAlchemy async.
- Donnees: PostgreSQL (projets, documents, metadonnees), JSONB pour metadata.
- Cache/queue: Redis (infrastructure disponible), Celery (squelette).
- Vector store: Qdrant pour la RAG.
- IA: DeepSeek pour la generation, LangGraph pour l orchestration, LangChain pour split/embeddings.
- Uploads: stockage local via volume Docker.

## Fonctionnalites (actuelles)
### Projets
- Creation, mise a jour, suppression avec confirmation.
- Statut (brouillon/en cours/termine/archive).
- Instructions de projet (contexte global reutilise a chaque generation).

### Elements (structure editoriale)
- Types: partie, chapitre, sous-chapitre, section.
- Hierarchie imposee (pas de chapitre dans un sous-chapitre).
- Contraintes par element: minimum/maximum de mots, resume, instructions.
- Generation iterative pour atteindre le minimum de mots.
- Telechargement d un element en Markdown.

### Versionning
- Chaque generation/correction/edition cree une version (v1, v1.01, v1.02...).
- Selection de version sur la liste et dans l apercu.
- Metadonnees de version: source_version, source_type, source_comment_ids.
- Correction ciblee d une version specifique.

### Edition manuelle
- Mode edition d une version: l utilisateur modifie le texte, une nouvelle version est creee.

### Commentaires
- Ajout de commentaires sur un element (associes a une version optionnelle).
- Bouton "Prendre en compte" par commentaire: genere une nouvelle version en utilisant ce commentaire.
- Commentaires deja pris en compte marques et exclus des corrections globales.

### Personnages
- Creation manuelle.
- Generation automatique a partir du resume du projet + precision optionnelle.

### Pipeline IA (LangGraph + RAG)
- Indexation RAG dans Qdrant.
- Generation de chapitre et de livre complet via pipeline orchestre.
- Contexte assemble automatiquement (projet, instructions, personnages, documents).

### Autres
- Auth JWT (register/login/me).
- Import de fichiers (txt, docx, pdf, md) vers documents.
- Telechargement d un projet complet (elements ordonnes) en Markdown.
- Health check.

## Flux de generation d un element
1. L utilisateur cree un element (chapitre, section, etc.).
2. Il renseigne resume, instructions et contraintes de mots.
3. THOTH genere le contenu en plusieurs iterations si necessaire.
4. Une nouvelle version est ajoutee (v1, v1.01, ...).
5. Les commentaires peuvent etre pris en compte pour generer une correction ciblee.

## Donnees et versionning (simplifie)
Chaque document stocke des metadonnees JSONB, notamment:
- element_type, element_index, parent_id
- min_word_count, max_word_count, summary
- versions[]: id, version, created_at, content, word_count,
  source_type, source_version_id, source_comment_ids
- comments[]: id, content, created_at, user_id, version_id, applied_version_ids

## API (principaux endpoints)
### Auth
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/auth/me

### Projets
- GET /api/v1/projects
- POST /api/v1/projects
- PUT /api/v1/projects/{id}
- POST /api/v1/projects/{id}/delete
- GET /api/v1/projects/{id}/download
- GET/POST/PUT/DELETE /api/v1/projects/{id}/instructions

### Documents / Elements
- GET /api/v1/documents?project_id=...
- POST /api/v1/documents/elements
- POST /api/v1/documents/{id}/generate
- POST /api/v1/documents/{id}/versions (edition manuelle)
- GET /api/v1/documents/{id}/versions
- GET /api/v1/documents/{id}/versions/{version_id}
- GET /api/v1/documents/{id}/download
- GET /api/v1/documents/{id}/comments
- POST /api/v1/documents/{id}/comments

### Personnages
- GET /api/v1/characters?project_id=...
- POST /api/v1/characters
- POST /api/v1/characters/auto

### Writing pipeline (LangGraph)
- POST /api/v1/writing/index
- POST /api/v1/writing/generate-chapter
- POST /api/v1/writing/generate-book

### Upload
- POST /api/v1/upload

## Demarrage rapide (Docker)
1. Copier `.env.example` vers `.env`
2. Renseigner `DEEPSEEK_API_KEY` et `SECRET_KEY`
3. Lancer `docker-compose up -d`

Acces:
- Web (Docker): http://localhost:3020
- API: http://localhost:8002/api/v1
- Docs API: http://localhost:8002/api/docs
- Health: http://localhost:8002/health

## Configuration (.env)
Variables cles:
- DEEPSEEK_API_KEY, DEEPSEEK_API_BASE, DEEPSEEK_MODEL
- SECRET_KEY
- DATABASE_URL / POSTGRES_*
- REDIS_URL
- QDRANT_URL, QDRANT_COLLECTION_NAME
- CHAT_MAX_TOKENS, DEEPSEEK_TIMEOUT

## Tests
Backend: pytest (voir `backend/tests`).

## Revue technique (points d attention)
Les points suivants ont ete identifies lors d une revue rapide du code. Ils sont
documentes ici afin de guider les prochaines ameliorations :

1. **Rate limiting incoherent et non centralise**
   - Le rate limiting global est code en dur (100/minute) alors qu une variable
     de configuration existe (`RATE_LIMIT_PER_MINUTE`).
   - Les endpoints d auth utilisent un `Limiter` local different de celui
     configure au niveau de l application.
   - **Recommendation** : centraliser une seule instance de `Limiter` et la
     parametrier via `settings.RATE_LIMIT_PER_MINUTE` pour une cohérence globale.

2. **Erreurs de validation upload renvoyees en 500**
   - Les erreurs de validation (extension non supportee, taille trop grande)
     sont levees comme des exceptions generiques et ressortent en 500.
   - **Recommendation** : mapper ces erreurs en 4xx (400/413) et reserver le 500
     aux erreurs serveur inattendues.

3. **Normalisation des emails absente**
   - L email est utilise tel quel lors de l inscription / authentification.
     Cela peut provoquer des doublons par variation de casse ou des echec de
     login.
   - **Recommendation** : normaliser les emails (`strip().lower()`) et,
     idealement, ajouter une contrainte ou un index case-insensitive en base.

Dependances potentiellement necessaires si vous implementez les points ci-dessus :
- Aucune dependance additionnelle requise pour les recommandations proposees.

## Roadmap (extraits)
- Renforcer les tests backend/front.
- Edition riche (Tiptap) et autosave dans le frontend.
