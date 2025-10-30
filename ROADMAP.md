# Roadmap de Développement THOTH

Plan de développement structuré par phases et sprints.

## 📋 Vue d'Ensemble

### Statut Actuel
✅ Infrastructure Docker complète
✅ Structure backend FastAPI
✅ Structure frontend Next.js
✅ Modèles de données de base
✅ Configuration Celery
✅ Documentation technique

### Objectifs
- MVP fonctionnel en 3-4 mois
- Beta privée à 6 mois
- Lancement public à 9 mois

---

## Phase 1 : Fondations (Semaines 1-4)

### Sprint 1 : Backend Core (Semaine 1-2)

#### Objectifs
- ✅ Structure backend mise en place
- ⬜ Authentification fonctionnelle
- ⬜ CRUD complet pour Users, Projects, Documents

#### Tâches

**1.1 Schémas Pydantic**
```
backend/app/schemas/
├── user.py         - UserCreate, UserUpdate, UserResponse
├── project.py      - ProjectCreate, ProjectUpdate, ProjectResponse
├── document.py     - DocumentCreate, DocumentUpdate, DocumentResponse
├── character.py    - CharacterCreate, CharacterUpdate, CharacterResponse
└── token.py        - Token, TokenPayload
```

**1.2 Authentification & Sécurité**
```python
# app/core/security.py
- create_access_token()
- verify_token()
- get_password_hash()
- verify_password()

# app/api/v1/endpoints/auth.py
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- GET /auth/me
```

**1.3 Services Métier**
```python
# app/services/
├── auth_service.py      - Logique authentification
├── user_service.py      - CRUD utilisateurs
├── project_service.py   - CRUD projets
└── document_service.py  - CRUD documents
```

**1.4 Tests**
```python
# backend/tests/
├── test_auth.py         - Tests authentification
├── test_projects.py     - Tests projets
└── test_documents.py    - Tests documents
```

**Critères de Succès**
- ✓ Utilisateur peut s'inscrire et se connecter
- ✓ JWT tokens fonctionnels avec refresh
- ✓ CRUD complet pour Projects et Documents
- ✓ Tests couvrant >80% du code

---

### Sprint 2 : Frontend Core (Semaine 3-4)

#### Objectifs
- ⬜ Pages d'authentification
- ⬜ Dashboard utilisateur
- ⬜ Liste et création de projets

#### Tâches

**2.1 Configuration Frontend**
```typescript
// src/lib/api.ts - Client API configuré
// src/lib/auth.ts - Gestion authentification
// src/types/ - Types TypeScript complets
```

**2.2 Composants UI de Base**
```typescript
// src/components/ui/
├── Button.tsx
├── Input.tsx
├── Card.tsx
├── Modal.tsx
├── Loading.tsx
└── Alert.tsx
```

**2.3 Pages Authentification**
```typescript
// src/app/auth/
├── login/page.tsx      - Page connexion
├── register/page.tsx   - Page inscription
└── layout.tsx          - Layout auth
```

**2.4 Dashboard**
```typescript
// src/app/dashboard/
├── page.tsx            - Liste projets
└── components/
    ├── ProjectCard.tsx
    └── CreateProjectModal.tsx
```

**2.5 Stores Zustand**
```typescript
// src/stores/
├── useUserStore.ts     - État utilisateur
└── useProjectStore.ts  - État projets
```

**Critères de Succès**
- ✓ Utilisateur peut s'authentifier via l'UI
- ✓ Dashboard affiche la liste des projets
- ✓ Création de nouveau projet fonctionnelle
- ✓ Navigation fluide entre les pages

---

## Phase 2 : Éditeur & RAG (Semaines 5-8)

### Sprint 3 : Éditeur de Texte (Semaine 5-6)

#### Objectifs
- ⬜ Éditeur Tiptap intégré
- ⬜ Sauvegarde automatique
- ⬜ Gestion des chapitres

#### Tâches

**3.1 Intégration Tiptap**
```typescript
// src/components/editor/
├── TiptapEditor.tsx        - Composant éditeur principal
├── EditorToolbar.tsx       - Barre d'outils
├── EditorMenuBar.tsx       - Menu formatage
└── extensions.ts           - Extensions Tiptap

// Features:
- Formatage riche (gras, italique, titres)
- Compteur de mots en temps réel
- Sauvegarde auto toutes les 30s
- Historique undo/redo
```

**3.2 Page Éditeur**
```typescript
// src/app/project/[id]/editor/page.tsx
- Éditeur principal
- Sidebar navigation chapitres
- Statistiques (mots, caractères)
- Mode focus (plein écran)
```

**3.3 Backend : Document Versioning**
```python
# Optionnel mais recommandé
# app/models/document_version.py
- Système de versions pour undo/historique
```

**Critères de Succès**
- ✓ Éditeur riche fonctionnel
- ✓ Sauvegarde automatique fonctionne
- ✓ Navigation entre chapitres fluide
- ✓ Compteur de mots précis

---

### Sprint 4 : Système RAG (Semaine 7-8)

#### Objectifs
- ⬜ Indexation documents dans Qdrant
- ⬜ Retrieval fonctionnel
- ⬜ Embeddings avec BGE-M3

#### Tâches

**4.1 Service Embeddings**
```python
# app/services/rag/embeddings.py
class EmbeddingService:
    - embed(text: str) -> List[float]
    - embed_batch(texts: List[str]) -> List[List[float]]
    - model: BGE-M3
```

**4.2 Service Indexation**
```python
# app/services/rag/indexer.py
class RAGIndexer:
    - index_document(document: Document)
    - update_index(document: Document)
    - delete_from_index(document_id: str)
    - chunk_text(text: str, chunk_size: int)
```

**4.3 Service Retrieval**
```python
# app/services/rag/retriever.py
class RAGRetriever:
    - retrieve(project_id: str, query: str, top_k: int)
    - retrieve_by_filters(project_id: str, filters: Dict)
    - get_relevant_context(document_id: str, paragraph: str)
```

**4.4 Celery Tasks**
```python
# app/tasks/rag_indexing.py
@shared_task
def index_document_task(document_id: str):
    # Indexation asynchrone après sauvegarde

@shared_task
def reindex_project(project_id: str):
    # Réindexation complète d'un projet
```

**4.5 Endpoints RAG**
```python
# app/api/v1/endpoints/rag.py
- POST /rag/index/{document_id}
- GET /rag/search
- POST /rag/reindex/{project_id}
```

**Critères de Succès**
- ✓ Documents sont indexés automatiquement
- ✓ Recherche sémantique fonctionne
- ✓ Retrieval retourne contexte pertinent
- ✓ Performance acceptable (<1s)

---

## Phase 3 : Agents IA (Semaines 9-12)

### Sprint 5 : Infrastructure Agents (Semaine 9-10)

#### Objectifs
- ⬜ Service LLM (DeepSeek)
- ⬜ Agent de base
- ⬜ Orchestrateur d'agents

#### Tâches

**5.1 Service LLM**
```python
# app/services/llm_service.py
class DeepSeekLLM:
    - complete(prompt: str, system_prompt: str) -> str
    - stream_complete(prompt: str) -> AsyncIterator[str]
    - reasoning_complete(prompt: str) -> ReasoningResult
    - configure(temperature: float, max_tokens: int)
```

**5.2 Agent de Base**
```python
# app/services/agents/base.py
class BaseAgent:
    - analyze(context: Dict) -> AgentResult
    - get_context(context: Dict) -> str (via RAG)
    - build_prompt(context: Dict, rag_context: str) -> str
    - parse_response(response: str) -> AgentResult
```

**5.3 Orchestrateur**
```python
# app/services/agent_orchestrator.py
class AgentOrchestrator:
    - run_full_analysis(project_id: str) -> AnalysisReport
    - run_specific_agent(agent_name: str, context: Dict) -> AgentResult
    - run_agents_parallel(agent_names: List[str]) -> List[AgentResult]
```

**5.4 Modèles d'Analyse**
```python
# app/models/analysis.py
class AnalysisReport:
    - project_id
    - agent_results (JSONB)
    - overall_score
    - recommendations
    - created_at

class AgentResult (Pydantic):
    - agent_name
    - score
    - findings
    - recommendations
```

**Critères de Succès**
- ✓ Service LLM communique avec DeepSeek API
- ✓ Agent de base fonctionnel
- ✓ Orchestrateur peut lancer plusieurs agents
- ✓ Résultats sont sauvegardés en DB

---

### Sprint 6 : Premiers Agents (Semaine 11-12)

#### Objectifs
- ⬜ 4 agents fonctionnels
- ⬜ Endpoints d'analyse
- ⬜ UI pour visualiser résultats

#### Tâches

**6.1 Agents Prioritaires**
```python
# app/services/agents/
├── narrative_architect.py    - Structure narrative
├── character_manager.py      - Cohérence personnages
├── corrector.py              - Orthographe/grammaire
└── writer.py                 - Génération de contenu
```

**6.2 Endpoints Agents**
```python
# app/api/v1/endpoints/agents.py
- POST /agents/analyze/{project_id}
- GET /agents/analysis/{analysis_id}
- POST /agents/suggest
- POST /agents/generate
```

**6.3 UI Analyse**
```typescript
// src/app/project/[id]/analysis/page.tsx
- Dashboard d'analyse
- Scores par agent
- Liste des recommandations
- Filtres par priorité/catégorie
```

**Critères de Succès**
- ✓ 4 agents fonctionnent correctement
- ✓ Analyse complète d'un projet fonctionne
- ✓ UI affiche les résultats de manière claire
- ✓ Suggestions sont actionnables

---

## Phase 4 : Fonctionnalités Avancées (Semaines 13-16)

### Sprint 7 : Agents Restants (Semaine 13-14)

#### Tâches
```python
# Implémenter les 7 agents restants
├── scene_planner.py
├── timeline_guardian.py
├── consistency_analyst.py
├── style_expert.py
├── dialogue_master.py
├── atmosphere_descriptor.py
└── synthesizer.py
```

**Critères de Succès**
- ✓ 11 agents complets et fonctionnels
- ✓ Tests unitaires pour chaque agent
- ✓ Documentation des prompts

---

### Sprint 8 : Gestion Personnages & Timeline (Semaine 15-16)

#### Objectifs
- ⬜ CRUD personnages complet
- ⬜ Fiches personnages auto-générées
- ⬜ Timeline interactive

#### Tâches

**8.1 Backend Personnages**
```python
# app/services/character_service.py
- extract_characters_from_text()
- generate_character_sheet()
- update_character_from_text()
- detect_contradictions()
```

**8.2 UI Personnages**
```typescript
// src/app/project/[id]/characters/
├── page.tsx                 - Liste personnages
├── [characterId]/page.tsx   - Fiche personnage
└── components/
    ├── CharacterCard.tsx
    ├── CharacterForm.tsx
    └── RelationshipGraph.tsx
```

**8.3 Backend Timeline**
```python
# app/models/timeline_event.py
class TimelineEvent:
    - project_id
    - title
    - description
    - date (in-story)
    - chapter_id
    - characters_involved
```

**8.4 UI Timeline**
```typescript
// src/app/project/[id]/timeline/page.tsx
- Timeline interactive (bibliotheque: vis-timeline)
- Filtres par personnage
- Détection incohérences temporelles
```

**Critères de Succès**
- ✓ Personnages extraits automatiquement du texte
- ✓ Fiches personnages générées par IA
- ✓ Timeline visualise chronologie du récit
- ✓ Détection incohérences fonctionne

---

## Phase 5 : Polish & Features (Semaines 17-20)

### Sprint 9 : Export & Collaboration (Semaine 17-18)

#### Objectifs
- ⬜ Export PDF/EPUB
- ⬜ Partage de projets

#### Tâches

**9.1 Service Export**
```python
# app/services/export_service.py
class ExportService:
    - export_pdf(project_id: str) -> bytes
    - export_epub(project_id: str) -> bytes
    - export_docx(project_id: str) -> bytes
    - customize_formatting(options: ExportOptions)

# Libraries: reportlab (PDF), ebooklib (EPUB), python-docx
```

**9.2 Celery Task Export**
```python
# app/tasks/export.py
@shared_task
def generate_export(project_id: str, format: str):
    # Génération async (peut être long)
```

**9.3 UI Export**
```typescript
// src/app/project/[id]/export/page.tsx
- Sélection format
- Options de formatage
- Prévisualisation
- Téléchargement
```

**Critères de Succès**
- ✓ Export PDF formaté proprement
- ✓ Export EPUB valide
- ✓ Génération asynchrone fonctionne

---

### Sprint 10 : UX & Performance (Semaine 19-20)

#### Objectifs
- ⬜ Optimisations performance
- ⬜ Amélioration UX
- ⬜ Tests E2E

#### Tâches

**10.1 Optimisations Backend**
- Caching Redis agressif
- Indexation base de données
- Optimisation requêtes SQL
- Rate limiting

**10.2 Optimisations Frontend**
- Code splitting
- Lazy loading composants
- Image optimization
- Bundle size reduction

**10.3 Tests E2E**
```typescript
// tests/e2e/
├── auth.spec.ts
├── project-creation.spec.ts
├── editor.spec.ts
└── analysis.spec.ts

// Library: Playwright ou Cypress
```

**10.4 Monitoring**
- Logs structurés
- Metrics (Prometheus)
- Error tracking (Sentry)
- Performance monitoring

**Critères de Succès**
- ✓ Temps de réponse API <500ms (P95)
- ✓ Lighthouse score >90
- ✓ Tests E2E couvrent parcours critiques
- ✓ Monitoring en place

---

## Phase 6 : MVP & Beta (Semaines 21-24)

### Sprint 11 : Finalisation MVP (Semaine 21-22)

#### Tâches
- Bug fixes
- Documentation utilisateur
- Onboarding flow
- Landing page

---

### Sprint 12 : Beta Testing (Semaine 23-24)

#### Tâches
- Beta privée avec 10-20 utilisateurs
- Collecte feedback
- Itérations rapides
- Stabilisation

---

## Backlog Futur (Post-MVP)

### Fonctionnalités Avancées
- [ ] Collaboration temps réel (multiple auteurs)
- [ ] Système de templates avancés
- [ ] Marketplace de templates
- [ ] Intégration avec outils externes (Scrivener, etc.)
- [ ] Application mobile
- [ ] Mode hors-ligne
- [ ] Traduction automatique
- [ ] Analyse de marché (genres populaires, etc.)

### Améliorations IA
- [ ] Fine-tuning modèle sur corpus littéraire français
- [ ] Agent de prédiction de succès
- [ ] Suggestions de couverture (DALL-E)
- [ ] Narration audio (TTS)
- [ ] Analyse émotionnelle avancée

### Business
- [ ] Système de paiement (Stripe)
- [ ] Gestion des abonnements
- [ ] Analytics utilisateur
- [ ] A/B testing framework
- [ ] Programme d'affiliation

---

## Métriques de Succès

### Techniques
- **Couverture tests** : >80%
- **Performance API** : P95 <500ms
- **Disponibilité** : >99.5%
- **Temps de chargement** : <2s

### Produit
- **Taux d'activation** : >70% (user complète onboarding)
- **Rétention J7** : >50%
- **Rétention J30** : >30%
- **NPS** : >40

### Business
- **Conversion gratuit→payant** : >10%
- **Churn mensuel** : <5%
- **LTV/CAC** : >3
- **Break-even** : 15 abonnés "Auteur"

---

## Risques & Mitigation

### Risques Techniques
| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Latence API DeepSeek | Élevé | Moyen | Caching agressif, fallback models |
| Coût Embeddings | Élevé | Élevé | Batch processing, caching |
| Scalabilité Qdrant | Moyen | Faible | Cluster mode, sharding |
| Qualité des agents | Élevé | Moyen | Itérations prompts, A/B testing |

### Risques Produit
| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Adoption utilisateur | Élevé | Moyen | Beta testing, feedback loops |
| Complexité UX | Élevé | Moyen | User testing, onboarding |
| Concurrence | Moyen | Élevé | Différenciation (agents IA) |

---

## Ressources Nécessaires

### Équipe
- **1 Full-stack Developer** (Backend + Frontend)
- **1 ML Engineer** (Agents IA, RAG) [optionnel au début]
- **1 Designer UI/UX** [optionnel, peut être freelance]

### Infrastructure
- **DeepSeek API** : ~$100-300/mois (dépend usage)
- **AWS** : ~$50-150/mois (EC2, RDS, S3)
- **Domaine + SSL** : ~$20/an
- **Total MVP** : ~$200-500/mois

---

## Notes de Développement

### Priorités
1. **Éditeur fonctionnel** - Core de l'application
2. **Système RAG** - Mémoire contextuelle
3. **Agents IA** - Valeur ajoutée principale
4. **UX fluide** - Expérience utilisateur

### Décisions Techniques
- **Monorepo vs Multi-repos** : Multi-repos (backend/frontend séparés)
- **REST vs GraphQL** : REST (plus simple pour MVP)
- **Websockets** : Pour streaming suggestions IA
- **Deploy** : Docker Compose pour MVP, Kubernetes plus tard

### Conventions
- **Git Flow** : Feature branches + Pull Requests
- **Commits** : Conventional Commits
- **Versioning** : Semantic Versioning (SemVer)
- **Documentation** : Inline + Markdown files

---

## Contact & Support

Pour questions sur la roadmap :
- Créer une issue GitHub avec label `roadmap`
- Contacter l'équipe de développement

**Dernière mise à jour** : 29 Octobre 2025
