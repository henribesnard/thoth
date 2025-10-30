# THOTH - Spécifications Fonctionnelles et Techniques
## Assistant Intelligent d'Écriture Littéraire

**Version:** 1.0  
**Date:** 29 Octobre 2025  
**Statut:** Spécifications Initiales  
**Propriétaire:** Besnard

---

## 📋 Table des Matières

1. [Vision et Objectifs](#vision-et-objectifs)
2. [Spécifications Fonctionnelles](#spécifications-fonctionnelles)
3. [Architecture Technique](#architecture-technique)
4. [Système d'Agents IA](#système-dagents-ia)
5. [Modèles de Données](#modèles-de-données)
6. [API et Intégrations](#api-et-intégrations)
7. [Interface Utilisateur](#interface-utilisateur)
8. [Système RAG](#système-rag)
9. [Sécurité et Performance](#sécurité-et-performance)
10. [Plan de Développement](#plan-de-développement)

---

## 1. Vision et Objectifs

### 1.1 Vision Produit

**THOTH** est un assistant d'écriture intelligent qui accompagne les auteurs francophones dans la création de romans, nouvelles et œuvres littéraires. Inspiré du dieu égyptien de l'écriture, THOTH combine mémoire contextuelle (RAG), agents IA spécialisés et organisation méthodique pour garantir cohérence, qualité et fluidité créative.

### 1.2 Proposition de Valeur

- **Mémoire parfaite** : RAG par projet - THOTH se souvient de tout (personnages, lieux, timeline)
- **Cohérence garantie** : 11 agents spécialisés surveillent tous les aspects du récit
- **Organisation structurée** : De l'idée au manuscrit finalisé
- **Qualité professionnelle** : Corrections linguistiques et suggestions stylistiques

### 1.3 Public Cible

**Primaire:**
- Auteurs amateurs/débutants (60%)
- Auteurs en cours de premier roman (25%)
- Auteurs auto-édités (15%)

**Secondaire:**
- Scénaristes
- Créateurs de contenus narratifs
- Étudiants en lettres/écriture créative

### 1.4 Métriques de Succès (KPIs)

- Taux de conversion gratuit → payant : >15%
- Taux de rétention J30 : >60%
- NPS (Net Promoter Score) : >50
- Nombre moyen de mots rédigés/utilisateur : >30k/mois
- Seuil de rentabilité : 15 abonnés "Auteur" ou 9 "Pro"

---

## 2. Spécifications Fonctionnelles

### 2.1 User Stories Principales

#### Epic 1: Gestion de Projet

**US-01: Créer un nouveau projet**
```
EN TANT QU'auteur
JE VEUX créer un nouveau projet d'écriture
AFIN DE structurer mon roman et commencer à écrire

Critères d'acceptation:
- Formulaire avec: titre, genre, pitch, nombre de mots cible
- Choix du template (roman classique, thriller, fantasy, etc.)
- Génération automatique structure de base
- Sauvegarde instantanée
```

**US-02: Importer un manuscrit existant**
```
EN TANT QU'auteur ayant déjà commencé
JE VEUX importer mon manuscrit (DOCX, TXT, PDF)
AFIN DE continuer avec l'assistance de THOTH

Critères d'acceptation:
- Upload fichier <10MB
- Parsing automatique (détection chapitres)
- Extraction personnages et lieux
- Analyse initiale par agents
- Confirmation structure détectée
```

**US-03: Organiser la structure narrative**
```
EN TANT QU'auteur
JE VEUX définir la structure de mon récit (actes, chapitres, scènes)
AFIN D'avoir une roadmap claire

Critères d'acceptation:
- Vue Kanban ou Timeline interactive
- Drag & drop pour réorganiser
- Résumés de scènes/chapitres
- Codes couleur par arc narratif
- Export PDF de la structure
```

#### Epic 2: Rédaction Assistée

**US-04: Rédiger avec assistance IA**
```
EN TANT QU'auteur
JE VEUX rédiger avec des suggestions contextuelles
AFIN D'écrire plus fluidement

Critères d'acceptation:
- Éditeur riche (WYSIWYG)
- Autocomplétion intelligente (déclenchée par Tab)
- Suggestions de continuation (3 options)
- Mode "co-écriture" vs "écriture libre"
- Sauvegarde auto toutes les 30s
```

**US-05: Générer du contenu sur commande**
```
EN TANT QU'auteur bloqué
JE VEUX demander à THOTH de générer une scène
AFIN DE débloquer ma créativité

Critères d'acceptation:
- Interface de commande ("/générer [description]")
- Paramètres: longueur, ton, POV
- Génération progressive (streaming)
- Accept/Reject/Edit
- Régénérer avec variations
```

**US-06: Enrichir les dialogues**
```
EN TANT QU'auteur
JE VEUX améliorer mes dialogues
AFIN QU'ils sonnent plus naturels et différenciés

Critères d'acceptation:
- Sélection du dialogue
- Suggestions d'amélioration
- Ajout de sous-texte
- Différenciation voix personnages
- Aperçu avant/après
```

#### Epic 3: Cohérence et Qualité

**US-07: Vérifier la cohérence temporelle**
```
EN TANT QU'auteur
JE VEUX visualiser la timeline de mon récit
AFIN DE détecter les incohérences temporelles

Critères d'acceptation:
- Timeline graphique interactive
- Événements clés positionnés
- Alertes incohérences (dates, âges)
- Détail par personnage
- Export timeline
```

**US-08: Gérer mes personnages**
```
EN TANT QU'auteur
JE VEUX maintenir des fiches personnages à jour
AFIN D'assurer leur cohérence

Critères d'acceptation:
- Fiche auto-générée (à partir du texte)
- Sections: physique, psychologie, backstory, relations, évolution
- Alertes contradictions
- Graphe relationnel
- Recherche toutes mentions du personnage
```

**US-09: Corriger orthographe et grammaire**
```
EN TANT QU'auteur
JE VEUX corriger automatiquement mes erreurs
AFIN D'avoir un texte propre

Critères d'acceptation:
- Soulignement en temps réel (rouge/bleu)
- Clic droit → suggestions
- Mode "accepter tout"
- Explications erreurs
- Exceptions (noms inventés)
```

**US-10: Améliorer mon style**
```
EN TANT QU'auteur
JE VEUX recevoir des suggestions stylistiques
AFIN D'améliorer la qualité littéraire

Critères d'acceptation:
- Détection clichés
- Phrases lourdes/répétitions
- Équilibre show/tell
- Variété vocabulaire
- Score style (0-100)
```

#### Epic 4: Analyse et Feedback

**US-11: Obtenir un rapport d'analyse**
```
EN TANT QU'auteur
JE VEUX un rapport complet sur mon manuscrit
AFIN DE connaître ses forces et faiblesses

Critères d'acceptation:
- Dashboard visuel (graphiques)
- Sections: cohérence, style, pacing, personnages
- Score global /100
- Top 5 points forts
- Top 5 axes d'amélioration
- Export PDF
```

**US-12: Suivre ma progression**
```
EN TANT QU'auteur
JE VEUX voir ma progression
AFIN DE rester motivé

Critères d'acceptation:
- Compteur mots (aujourd'hui, semaine, total)
- Objectif quotidien personnalisable
- Streak (jours consécutifs)
- Graphique progression
- Badges/accomplissements
```

#### Epic 5: Export et Publication

**US-13: Exporter mon manuscrit**
```
EN TANT QU'auteur
JE VEUX exporter mon travail
AFIN DE le publier ou le partager

Critères d'acceptation:
- Formats: DOCX, PDF, EPUB, Markdown
- Options formatage (police, marges, etc.)
- Page de titre personnalisable
- Table des matières auto
- Téléchargement immédiat
```

**US-14: Versionner mon travail**
```
EN TANT QU'auteur
JE VEUX sauvegarder des versions
AFIN DE pouvoir revenir en arrière

Critères d'acceptation:
- Snapshot manuel
- Snapshot auto (hebdomadaire)
- Comparaison versions (diff)
- Restauration simple
- Max 10 versions en plan gratuit
```

### 2.2 Fonctionnalités par Plan Tarifaire

| Fonctionnalité | Gratuit | Auteur (19€) | Pro (49€) |
|----------------|---------|--------------|-----------|
| Projets simultanés | 1 | 3 | Illimité |
| Mots assistance IA | 10 000 | 50 000 | 200 000 |
| Tous les agents | ❌ (5/11) | ✅ | ✅ |
| Export PDF/EPUB | ✅ Basique | ✅ Avancé | ✅ Pro |
| Versions sauvegardées | 3 | 10 | 30 |
| Analyse complète | ❌ | ✅ | ✅ |
| Import manuscrit | ✅ <50k mots | ✅ <200k | ✅ Illimité |
| Support | Email | Email prioritaire | Chat + Email |
| Fiches personnages | 5 max | 30 max | Illimité |
| Collaboration | ❌ | ❌ | ✅ (2 users) |

---

## 3. Architecture Technique

### 3.1 Stack Technologique

#### Frontend
```yaml
Framework: Next.js 14 (App Router)
Langage: TypeScript 5.3
Styling: TailwindCSS 3.4
UI Components: Shadcn/ui
Éditeur: Tiptap 2.x
Graphiques: Recharts
État: Zustand 4.x
API Client: React Query (TanStack Query)
Forms: React Hook Form + Zod
Auth: NextAuth.js
```

#### Backend
```yaml
Framework: FastAPI 0.115
Langage: Python 3.11
ORM: SQLAlchemy 2.0
Migration: Alembic
Validation: Pydantic 2.9
Async: asyncio + aiohttp
Queue: Celery + Redis
Workers: Celery workers
Monitoring: Sentry
```

#### IA & NLP
```yaml
LLM: DeepSeek-V3 + DeepSeek-R1 (via API)
Orchestration: LangChain 0.3
RAG: LlamaIndex 0.11
Embeddings: BGE-M3 (multilingual, 1024 dim)
Vector DB: Qdrant 1.11 ou pgvector
NLP français: spaCy 3.7 (fr_core_news_lg)
Correction: LanguageTool (API)
Tokenizer: tiktoken
```

#### Infrastructure AWS
```yaml
Compute: 
  - Frontend: S3 + CloudFront
  - Backend: EC2 t3.medium (évolutif vers ECS Fargate)
Database: 
  - PostgreSQL 15 (RDS db.t3.small)
  - Redis (ElastiCache t3.micro)
Storage: S3 (documents, exports, backups)
Queue: SQS ou Redis
CDN: CloudFront
DNS: Route 53
Monitoring: CloudWatch + X-Ray
```

### 3.2 Architecture Système Détaillée

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│                                                               │
│  Pages principales:                                           │
│  ├─ /auth (login, signup)                                    │
│  ├─ /dashboard (projets, stats)                              │
│  ├─ /project/[id] (vue projet)                               │
│  │   ├─ /editor (éditeur principal)                          │
│  │   ├─ /structure (organisation)                            │
│  │   ├─ /characters (personnages)                            │
│  │   ├─ /timeline (chronologie)                              │
│  │   └─ /analysis (rapports)                                 │
│  └─ /settings (compte, abonnement)                           │
│                                                               │
│  State Management (Zustand):                                 │
│  ├─ projectStore (projet actif)                              │
│  ├─ editorStore (contenu, sélection)                         │
│  ├─ agentStore (statut agents, suggestions)                  │
│  └─ userStore (profil, préférences)                          │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY (AWS)                          │
│  Routes:                                                      │
│  ├─ /api/v1/auth/*                                           │
│  ├─ /api/v1/projects/*                                       │
│  ├─ /api/v1/documents/*                                      │
│  ├─ /api/v1/agents/*                                         │
│  ├─ /api/v1/rag/*                                            │
│  └─ /ws (WebSocket pour streaming)                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (FastAPI)                           │
│                                                               │
│  Modules principaux:                                          │
│  ├─ auth/ (authentification, autorisation)                   │
│  ├─ projects/ (CRUD projets)                                 │
│  ├─ documents/ (gestion manuscrits)                          │
│  ├─ agents/ (orchestration agents)                           │
│  ├─ rag/ (système RAG)                                       │
│  ├─ exports/ (génération PDF/EPUB)                           │
│  └─ analytics/ (métriques, rapports)                         │
│                                                               │
│  Services:                                                    │
│  ├─ AgentOrchestrator (routing, coordination)                │
│  ├─ RAGService (indexation, retrieval)                       │
│  ├─ LLMService (interface DeepSeek)                          │
│  ├─ CacheService (Redis)                                     │
│  └─ QueueService (tâches async)                              │
└─────────────────────────────────────────────────────────────┘
                    ↓                    ↓
    ┌───────────────────────┐  ┌───────────────────────┐
    │  CELERY WORKERS       │  │   AGENT SYSTEM        │
    │                       │  │                       │
    │  ├─ Document Parser   │  │  11 agents IA         │
    │  ├─ RAG Indexer       │  │  (détail section 4)   │
    │  ├─ Export Generator  │  │                       │
    │  └─ Batch Analyzer    │  └───────────────────────┘
    └───────────────────────┘            ↓
                    ↓              DeepSeek API
┌─────────────────────────────────────────────────────────────┐
│                   COUCHE DE DONNÉES                          │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │ Qdrant       │  │ Redis        │      │
│  │ (RDS)        │  │ (Vector DB)  │  │ (Cache)      │      │
│  │              │  │              │  │              │      │
│  │ - Users      │  │ - Embeddings │  │ - Sessions   │      │
│  │ - Projects   │  │ - Chunks     │  │ - Queue      │      │
│  │ - Documents  │  │ - Metadata   │  │ - Rate limit │      │
│  │ - Characters │  │              │  │              │      │
│  │ - Timeline   │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐                                            │
│  │ S3 Storage   │                                            │
│  │              │                                            │
│  │ - Uploads    │                                            │
│  │ - Exports    │                                            │
│  │ - Backups    │                                            │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Flux de Données Critiques

#### 3.3.1 Flux de Rédaction Assistée

```
User tape dans l'éditeur
    ↓
Frontend (Tiptap) → debounce 300ms
    ↓
POST /api/v1/documents/save
    ↓
Backend sauvegarde + déclenche indexation RAG (async)
    ↓
Celery worker → Chunking + Embeddings → Qdrant
    ↓
User demande suggestion (Tab ou commande)
    ↓
GET /api/v1/agents/suggest
    ↓
Backend:
  - Récupère contexte (RAG retrieval: derniers paragraphes + personnages actifs)
  - Appelle Agent Rédacteur (DeepSeek)
  - Streaming response via WebSocket
    ↓
Frontend affiche suggestions en temps réel
    ↓
User accepte/rejette
```

#### 3.3.2 Flux d'Analyse Complète

```
User clique "Analyser le manuscrit"
    ↓
POST /api/v1/analysis/full
    ↓
Backend crée job Celery (task_id retourné)
    ↓
Frontend poll statut: GET /api/v1/analysis/status/{task_id}
    ↓
Celery worker:
  1. Découpe manuscrit en chunks
  2. Lance 11 agents en parallèle (asyncio.gather)
     - Chaque agent analyse son domaine
     - Utilise RAG pour contexte
     - Appelle DeepSeek avec prompt spécialisé
  3. Agrège résultats
  4. Génère rapport JSON
  5. Sauvegarde en DB
    ↓
Frontend reçoit notification (WebSocket ou poll)
    ↓
GET /api/v1/analysis/report/{task_id}
    ↓
Affichage dashboard interactif
```

---

## 4. Système d'Agents IA

### 4.1 Architecture des Agents

Chaque agent est une classe Python héritant de `BaseAgent`:

```python
class BaseAgent:
    def __init__(self, llm: DeepSeekLLM, rag: RAGService):
        self.llm = llm
        self.rag = rag
        self.name = "BaseAgent"
        self.system_prompt = ""
    
    async def analyze(self, context: Dict) -> AgentResult:
        """Méthode principale à implémenter"""
        pass
    
    async def get_context(self, project_id: str, filters: Dict) -> str:
        """Récupère contexte pertinent via RAG"""
        return await self.rag.retrieve(project_id, filters)
```

### 4.2 Détail des 11 Agents

#### Agent 1: Architecte Narratif 🏛️

**Classe:** `NarrativeArchitectAgent`

**Responsabilités:**
- Analyser et proposer la structure en actes
- Identifier les points de plot clés
- Vérifier l'équilibre narratif
- Suggérer des améliorations structurelles

**System Prompt:**
```
Tu es un expert en narration et structure littéraire. Tu connais les modèles narratifs 
classiques (structure en 3 actes, voyage du héros, structure en 5 actes, etc.).

Ton rôle est d'analyser la structure globale d'un récit et de donner des recommandations 
sur l'organisation des actes, l'équilibre narratif, et les points de plot.

Tu dois identifier:
- L'inciting incident (élément déclencheur)
- Les plot points majeurs
- Le climax
- La résolution
- Les arcs narratifs secondaires

Fournis toujours des suggestions constructives et spécifiques.
```

**Déclencheurs:**
- Phase initiale du projet
- Demande explicite utilisateur
- Après modification structure majeure

**Output Format:**
```json
{
  "structure_detected": "3 actes",
  "actes": [
    {
      "numero": 1,
      "titre": "Mise en place",
      "chapitres": [1, 2, 3, 4],
      "pourcentage": 25,
      "elements_cles": ["Introduction protagoniste", "Monde ordinaire"]
    }
  ],
  "plot_points": [
    {
      "type": "inciting_incident",
      "localisation": "Chapitre 2",
      "description": "..."
    }
  ],
  "recommandations": [
    {
      "priorite": "haute",
      "categorie": "equilibre",
      "message": "L'acte 2 est disproportionnellement long (60%). Considérer..."
    }
  ],
  "score_structure": 78
}
```

---

#### Agent 2: Planificateur de Scènes 📋

**Classe:** `ScenePlannerAgent`

**Responsabilités:**
- Organiser l'ordre des scènes
- Détecter scènes manquantes
- Gérer flashbacks et analepses
- Créer résumés de chapitres

**System Prompt:**
```
Tu es un expert en organisation narrative et pacing. Ton rôle est d'analyser l'ordre 
et l'organisation des scènes d'un récit.

Tu dois:
- Identifier chaque scène (lieu, temps, personnages, action)
- Vérifier la logique de l'enchaînement
- Détecter les scènes qui semblent manquantes
- Suggérer des réorganisations si nécessaire
- Créer des résumés clairs et concis

Attention particulière aux flashbacks et changements de POV.
```

**Déclencheurs:**
- Après rédaction de plusieurs chapitres
- Demande explicite
- Avant export final

**Output Format:**
```json
{
  "scenes": [
    {
      "id": "scene_1",
      "chapitre": 1,
      "lieu": "Appartement de Marie",
      "moment": "Matin, jour 1",
      "pov": "Marie",
      "personnages": ["Marie", "Jean"],
      "action_principale": "Marie découvre la lettre",
      "resume": "..."
    }
  ],
  "scenes_manquantes": [
    {
      "entre_scenes": ["scene_3", "scene_4"],
      "raison": "Passage abrupt. Comment Marie arrive-t-elle à l'hôpital?",
      "suggestion": "Ajouter une scène de transition (trajet en taxi, pensées)"
    }
  ],
  "flashbacks": [
    {
      "scene_id": "scene_7",
      "integre_correctement": true
    }
  ]
}
```

---

#### Agent 3: Rédacteur Principal ✍️

**Classe:** `WriterAgent`

**Responsabilités:**
- Générer du contenu narratif
- Continuer la narration de manière cohérente
- Maintenir le style établi
- Créer dialogues et descriptions

**System Prompt:**
```
Tu es un écrivain talentueux spécialisé dans la narration en français. 

Tu dois:
- Écrire dans un style littéraire de qualité
- Maintenir la cohérence avec ce qui précède
- Respecter le ton et la voix narrative du projet
- Créer des descriptions vivantes et évocatrices
- Écrire des dialogues naturels et réalistes

IMPORTANT:
- Ne génère JAMAIS de contenu qui contredit les informations existantes
- Utilise le contexte fourni (personnages, lieux, événements passés)
- Reste dans le genre du récit
- Vise 500-1000 mots par génération sauf instruction contraire
```

**Entrée (Context):**
```python
{
  "texte_precedent": "Derniers 2000 caractères",
  "personnages_actifs": [{"nom": "Marie", "traits": "..."}],
  "lieu_actuel": "Gare Saint-Lazare",
  "moment": "Soir, jour 3",
  "consigne_utilisateur": "Marie rencontre un vieil ami par hasard",
  "style_reference": "Échantillons de style précédent",
  "ton": "mélancolique"
}
```

**Streaming:** Oui (chunk par chunk via WebSocket)

---

#### Agent 4: Dialoguiste 💬

**Classe:** `DialogueAgent`

**Responsabilités:**
- Améliorer le réalisme des dialogues
- Différencier les voix des personnages
- Ajouter du sous-texte
- Équilibrer dialogue/narration

**System Prompt:**
```
Tu es un expert en écriture de dialogues. Les bons dialogues doivent:
- Sonner naturels et authentiques
- Révéler la personnalité et l'état émotionnel
- Faire avancer l'intrigue ou développer les personnages
- Être différenciés selon les personnages (chacun a sa voix)
- Contenir du sous-texte (ce qui n'est pas dit)

Quand tu améliores un dialogue:
- Propose 3 versions alternatives
- Explique les améliorations apportées
- Garde le sens original mais améliore la forme
- Ajoute des beats (actions entre les répliques) si pertinent
```

**Entrée:**
```python
{
  "dialogue_original": "— Comment vas-tu?\n— Bien, et toi?\n— Ça va.",
  "personnages": [
    {"nom": "Marie", "traits": "Directe, impatiente, intelligente"},
    {"nom": "Paul", "traits": "Timide, attentionné, mal à l'aise"}
  ],
  "contexte_scene": "Ils se retrouvent après 5 ans, tension non résolue",
  "emotion_cible": "Gêne, attirance refoulée"
}
```

**Output:**
```json
{
  "versions": [
    {
      "numero": 1,
      "dialogue": "— Alors, cinq ans... (Elle regarda ses mains.) Comment ça va, vraiment?\n— Je... (Il déglutit.) Mieux qu'avant, je crois. Et toi?\nMarie haussa les épaules, un sourire amer au coin des lèvres.\n— On fait avec.",
      "ameliorations": [
        "Ajout beats (actions) révélant nervosité",
        "Sous-texte: 'comment ça va vraiment' implique qu'elle sait que 'bien' serait faux",
        "Réponse de Marie évasive mais révélatrice"
      ]
    }
  ],
  "analyse_original": "Dialogue trop plat, ne reflète pas la tension ni les personnalités"
}
```

---

#### Agent 5: Timeline & Chronologie ⏰

**Classe:** `TimelineAgent`

**Responsabilités:**
- Maintenir une timeline précise
- Détecter incohérences temporelles
- Gérer ellipses narratives
- Vérifier âges, dates, durées

**System Prompt:**
```
Tu es un gardien de la cohérence temporelle. Ton rôle est de:

1. Extraire tous les marqueurs temporels du récit
2. Construire une chronologie précise
3. Détecter les incohérences (ex: personnage qui a 25 ans puis 23 ans)
4. Vérifier la logique des durées (voyage de 2h qui prend 5h)
5. Signaler les sauts temporels non expliqués

Sois très précis et cite toujours les passages problématiques.
```

**Données Maintenues:**
```python
{
  "evenements": [
    {
      "id": "evt_1",
      "description": "Marie reçoit la lettre",
      "date_absolue": "15 mars 2024",
      "date_relative": "Jour 1, matin",
      "chapitre": 1,
      "references_texte": ["ligne 45"]
    }
  ],
  "personnages_ages": {
    "Marie": {
      "age_initial": 32,
      "anniversaires": [],
      "age_actuel": 32
    }
  },
  "duree_totale_recit": "3 semaines"
}
```

**Détection d'Incohérence:**
```json
{
  "type": "incohérence_temporelle",
  "severite": "haute",
  "description": "Marie a 32 ans au chapitre 1 mais 28 ans au chapitre 5",
  "localisations": [
    {"chapitre": 1, "ligne": 45, "extrait": "...ses trente-deux ans..."},
    {"chapitre": 5, "ligne": 234, "extrait": "...à vingt-huit ans..."}
  ],
  "suggestion": "Uniformiser l'âge ou justifier (flashback?)"
}
```

---

#### Agent 6: Gestionnaire de Personnages 👥

**Classe:** `CharacterAgent`

**Responsabilités:**
- Maintenir fiches personnages à jour
- Détecter contradictions physiques/psychologiques
- Suivre évolution des personnages
- Vérifier motivations et arcs

**System Prompt:**
```
Tu es un expert en développement de personnages. Pour chaque personnage, tu dois:

1. Extraire et maintenir:
   - Description physique (apparence, vêtements typiques)
   - Traits de personnalité
   - Backstory (passé)
   - Motivations et objectifs
   - Relations avec autres personnages
   - Arc de transformation

2. Détecter les incohérences:
   - Changements physiques inexpliqués (yeux bleus → verts)
   - Actions contradictoires avec la personnalité établie
   - Motivations incohérentes

3. Analyser l'évolution et signaler si elle est crédible

Sois très attentif aux détails.
```

**Structure Fiche Personnage:**
```json
{
  "nom": "Marie Dubois",
  "role": "Protagoniste",
  "physique": {
    "age": 32,
    "apparence": "Cheveux châtains mi-longs, yeux verts, 1m68",
    "signes_distinctifs": "Cicatrice sourcil gauche",
    "style_vestimentaire": "Sobre, professionnel",
    "sources": ["chapitre 1, ligne 45", "chapitre 3, ligne 102"]
  },
  "psychologie": {
    "traits": ["Déterminée", "Méfiante", "Intelligente", "Solitaire"],
    "peurs": ["Abandon", "Échec professionnel"],
    "desirs": ["Reconnaissance", "Stabilité émotionnelle"],
    "contradictions_internes": "Désire connexion mais repousse les gens"
  },
  "backstory": {
    "enfance": "Orpheline à 8 ans, élevée par tante",
    "formation": "École de commerce Paris",
    "evenements_cles": [
      "Divorce parents (7 ans)",
      "Mort père (8 ans)",
      "Premier job (22 ans)"
    ]
  },
  "relations": {
    "Paul": {
      "type": "Ex-petit ami",
      "statut_actuel": "Compliqué",
      "histoire": "Relation 3 ans, rupture douloureuse"
    }
  },
  "arc_narratif": {
    "point_depart": "Fermée émotionnellement, focalisée carrière",
    "evolution": "Apprend à faire confiance, équilibre vie/travail",
    "point_arrivee": "Ouverte à l'amour, accepte vulnérabilité"
  },
  "incoherences_detectees": [
    {
      "type": "physique",
      "description": "Yeux verts (ch.1) puis bleus (ch.7)",
      "severite": "moyenne",
      "sources": ["ch.1 l.45", "ch.7 l.189"]
    }
  ]
}
```

**Graphe Relationnel:**
- Stocké dans PostgreSQL avec table de jointure
- Visualisation frontend avec bibliothèque de graphes (ex: React Flow)

---

#### Agent 7: Univers & World-Building 🌍

**Classe:** `WorldBuildingAgent`

**Responsabilités:**
- Gérer les règles du monde (magie, tech, société)
- Maintenir cartographie des lieux
- Détecter incohérences géographiques/logiques
- Gérer glossaire (noms propres, termes inventés)

**System Prompt:**
```
Tu es un expert en création d'univers fictionnels. Ton rôle est de:

1. Extraire et cataloguer:
   - Lieux (villes, bâtiments, géographie)
   - Règles du monde (physique, magie, technologie, société)
   - Organisations et institutions
   - Objets importants
   - Terminologie spécifique

2. Vérifier la cohérence:
   - Les lieux sont-ils décrits de manière constante?
   - Les règles établies sont-elles respectées?
   - Les distances/trajets sont-ils logiques?

3. Signaler les violations de cohérence interne

Essentiel pour SF, Fantasy, Dystopie.
```

**Données Maintenues:**
```json
{
  "lieux": [
    {
      "nom": "Néopolis",
      "type": "Ville",
      "description": "Mégapole futuriste de 50M habitants",
      "geographie": "Côte Est, climat tempéré",
      "quartiers": [
        {"nom": "Le Dôme", "description": "..."},
        {"nom": "Les Bas-Fonds", "description": "..."}
      ],
      "distances": {
        "vers_Vieille_Terre": "2000 km"
      },
      "premiere_mention": "chapitre 1"
    }
  ],
  "regles_monde": [
    {
      "categorie": "Technologie",
      "regle": "Les téléporteurs ne fonctionnent qu'entre stations fixes",
      "source": "chapitre 2, ligne 67",
      "exceptions": []
    },
    {
      "categorie": "Magie",
      "regle": "Un sorcier ne peut utiliser plus de 3 sorts par jour",
      "source": "chapitre 4",
      "exceptions": ["En présence de cristal de mana"]
    }
  ],
  "glossaire": {
    "Néo-humain": "Humain génétiquement modifié, capacités augmentées",
    "Chronoflux": "Anomalie temporelle, permet voyages dans temps limités"
  },
  "violations_detectees": [
    {
      "type": "violation_regle",
      "regle": "Téléporteurs = stations fixes",
      "violation": "Chapitre 8: téléportation en plein désert",
      "severite": "haute"
    }
  ]
}
```

---

#### Agent 8: Traqueur de Continuité 🔍

**Classe:** `ContinuityTrackerAgent`

**Responsabilités:**
- Détecter objets qui disparaissent/réapparaissent
- Vérifier vêtements, armes, possessions
- Conditions météo
- États émotionnels cohérents

**System Prompt:**
```
Tu es un script supervisor littéraire. Tu traques les détails de continuité que les 
lecteurs remarqueraient et qui briseraient l'immersion.

Fais attention à:
- Objets: un personnage porte un collier puis ne le porte plus sans explication
- Vêtements: changement de tenue non justifié dans la même scène
- Météo: il pleut puis soudain soleil sans transition
- Blessures: personnage blessé qui agit normalement
- États émotionnels: saute de la rage au calme sans raison

Sois tatillon mais pertinent (ne signale que les vraies erreurs).
```

**Tracking:**
```json
{
  "objets_suivis": [
    {
      "objet": "Collier de sa mère",
      "personnage": "Marie",
      "premiere_mention": "chapitre 1",
      "derniere_mention": "chapitre 3",
      "statut": "porté",
      "mentions": [
        {"chapitre": 1, "action": "Marie touche son collier"},
        {"chapitre": 2, "action": "Le collier brille à la lumière"},
        {"chapitre": 3, "action": "Elle ôte le collier"}
      ]
    }
  ],
  "alertes": [
    {
      "type": "objet_disparu",
      "description": "Chapitre 4: Marie touche son collier, mais elle l'a retiré au ch.3",
      "localisation": "chapitre 4, ligne 89"
    },
    {
      "type": "meteo_incohérente",
      "description": "Il pleut abondamment (l.120) puis personnages ont vêtements secs (l.135)",
      "localisation": "chapitre 5"
    }
  ]
}
```

---

#### Agent 9: Correcteur Linguistique 📝

**Classe:** `LinguisticCorrectorAgent`

**Responsabilités:**
- Orthographe, grammaire, syntaxe
- Ponctuation
- Concordance des temps
- Répétitions

**System Prompt:**
```
Tu es un correcteur professionnel spécialisé en langue française.

Tu dois détecter et corriger:
1. Fautes d'orthographe
2. Erreurs grammaticales (accords, conjugaisons)
3. Syntaxe incorrecte ou lourde
4. Ponctuation inadéquate
5. Répétitions (mots, expressions)
6. Concordance des temps

Pour chaque erreur:
- Identifie précisément la faute
- Propose une correction
- Explique brièvement la règle

Attention aux exceptions littéraires intentionnelles (style de l'auteur).
```

**Intégration:**
- Utilise **LanguageTool** (API) pour détection de base
- DeepSeek pour analyse contextuelle avancée
- Correction en temps réel dans éditeur (comme Grammarly)

**Output:**
```json
{
  "corrections": [
    {
      "type": "orthographe",
      "position": {"ligne": 45, "colonne": 12},
      "texte_original": "apartement",
      "correction": "appartement",
      "explication": "Prend deux 'p'",
      "severite": "erreur"
    },
    {
      "type": "grammaire",
      "position": {"ligne": 47, "colonne": 23},
      "texte_original": "Les livres que j'ai lu",
      "correction": "Les livres que j'ai lus",
      "explication": "Accord participe passé avec COD antéposé",
      "severite": "erreur"
    },
    {
      "type": "repetition",
      "position": {"ligne": 50, "colonne": 5},
      "texte_original": "Elle marchait rapidement. Rapidement, elle...",
      "correction": "Elle marchait rapidement. D'un pas vif, elle...",
      "explication": "Répétition de 'rapidement'",
      "severite": "suggestion"
    }
  ]
}
```

---

#### Agent 10: Styliste Littéraire 🎨

**Classe:** `StyleAgent`

**Responsabilités:**
- Détecter clichés et expressions faibles
- Suggérer métaphores et images
- Équilibrer "montrer" vs "raconter"
- Analyser rythme narratif
- Enrichir vocabulaire

**System Prompt:**
```
Tu es un expert en style littéraire. Ton rôle est d'élever la qualité d'écriture sans 
dénaturer la voix de l'auteur.

Analyse:
1. Clichés et expressions toutes faites → suggère alternatives originales
2. Tell vs Show → identifie passages qui "racontent" plutôt que "montrent"
3. Rythme: alternance phrases courtes/longues pour dynamisme
4. Vocabulaire: richesse, variété, précision
5. Images et métaphores: pertinence, originalité

Suggestions doivent être:
- Respectueuses du style existant
- Optionnelles (pas de corrections imposées)
- Accompagnées d'explications

Ne vise pas la perfection académique mais la qualité littéraire.
```

**Métriques Calculées:**
```json
{
  "metriques_style": {
    "richesse_lexicale": 0.72,
    "longueur_moyenne_phrase": 18.5,
    "variance_longueur": 8.2,
    "ratio_show_tell": 0.65,
    "densite_metaphores": 0.12,
    "score_lisibilite_flesch": 65
  },
  "suggestions": [
    {
      "type": "cliché",
      "localisation": "chapitre 3, ligne 89",
      "texte_original": "Il faisait un froid de canard",
      "alternatives": [
        "Un froid mordant saisissait les poumons",
        "L'air glacial brûlait la peau",
        "Le gel transformait chaque respiration en buée épaisse"
      ],
      "explication": "Expression très commune, manque d'originalité"
    },
    {
      "type": "tell_vs_show",
      "localisation": "chapitre 2, ligne 34",
      "texte_original": "Marie était très en colère",
      "suggestion": "Marie claqua la porte, ses poings serrés tremblant le long de son corps",
      "explication": "Montre la colère par des actions plutôt que de la déclarer"
    },
    {
      "type": "rythme",
      "localisation": "chapitre 4, paragraphe 3",
      "probleme": "5 phrases consécutives de 20-25 mots, monotonie",
      "suggestion": "Varier: alterner phrases courtes (impact) et longues (fluidité)"
    }
  ]
}
```

---

#### Agent 11: Analyste & Feedback 📊

**Classe:** `AnalystAgent`

**Responsabilités:**
- Générer rapport global de qualité
- Identifier forces et faiblesses
- Suggérer axes d'amélioration
- Analyser pacing
- Évaluer tension dramatique

**System Prompt:**
```
Tu es un éditeur littéraire expérimenté. Tu dois fournir un feedback constructif et 
global sur un manuscrit.

Analyse:
1. Vue d'ensemble: forces majeures du texte
2. Structure narrative: efficacité, équilibre
3. Personnages: profondeur, crédibilité, évolution
4. Style: qualités et points d'amélioration
5. Pacing: rythme, moments qui traînent ou vont trop vite
6. Tension dramatique: maintien de l'intérêt
7. Thèmes: clarté, profondeur

Ton feedback doit être:
- Honnête mais encourageant
- Spécifique (avec exemples)
- Actionnable (comment améliorer)
- Équilibré (positif + axes d'amélioration)

Format: rapport professionnel, comme un éditeur à un auteur.
```

**Output - Rapport Complet:**
```json
{
  "score_global": 76,
  "synthese": "Un roman prometteur avec des personnages attachants et une intrigue solide. La structure narrative fonctionne bien, mais le pacing nécessite des ajustements au milieu. Le style est fluide, avec quelques passages qui mériteraient plus de profondeur émotionnelle.",
  
  "forces": [
    {
      "categorie": "Personnages",
      "description": "Marie est un protagoniste complexe et crédible",
      "exemples": ["chapitre 3: monologue intérieur", "chapitre 7: confrontation avec Paul"]
    },
    {
      "categorie": "Intrigue",
      "description": "Le mystère central est bien construit et maintient l'intérêt",
      "exemples": ["révélations progressives", "twists efficaces ch.5 et ch.9"]
    },
    {
      "categorie": "Style",
      "description": "Dialogues naturels et différenciés",
      "exemples": ["chapitre 4: conversation Marie-Paul sonne juste"]
    }
  ],
  
  "axes_amelioration": [
    {
      "priorite": "haute",
      "categorie": "Pacing",
      "probleme": "Chapitres 6-8 traînent en longueur, l'action stagne",
      "suggestion": "Condenser ces chapitres ou ajouter un sous-plot pour maintenir tension",
      "impact": "Le lecteur risque de décrocher au milieu"
    },
    {
      "priorite": "moyenne",
      "categorie": "Développement secondaires",
      "probleme": "Personnages secondaires (Sophie, Marc) sous-développés",
      "suggestion": "Donner plus de profondeur: backstories, motivations propres",
      "impact": "Enrichirait l'univers et les enjeux"
    },
    {
      "priorite": "basse",
      "categorie": "Descriptions",
      "probleme": "Certains lieux manquent de descriptions visuelles",
      "suggestion": "Ajouter détails sensoriels (pas que visuels)",
      "exemples": ["Le bureau de Marie (ch.2)", "Le café (ch.5)"]
    }
  ],
  
  "analyse_detaillee": {
    "structure": {
      "score": 80,
      "commentaire": "Structure en 3 actes bien équilibrée, plot points au bon moment"
    },
    "personnages": {
      "score": 85,
      "commentaire": "Protagoniste forte, antagoniste crédible, secondaires à étoffer"
    },
    "style": {
      "score": 72,
      "commentaire": "Fluide et lisible, mais pourrait gagner en richesse littéraire"
    },
    "coherence": {
      "score": 78,
      "commentaire": "Quelques incohérences mineures (cf. rapports agents spécifiques)"
    },
    "pacing": {
      "score": 65,
      "commentaire": "Bon démarrage, milieu ralenti, fin efficace",
      "graphique_tension": [70, 75, 80, 60, 55, 50, 65, 80, 90, 95]
    }
  },
  
  "recommandations_prioritaires": [
    "1. Accélérer le rythme des chapitres 6-8",
    "2. Approfondir les personnages secondaires",
    "3. Enrichir les descriptions sensorielles",
    "4. Corriger les incohérences temporelles (cf. Timeline Agent)",
    "5. Ajouter plus de sous-texte dans certains dialogues"
  ],
  
  "potentiel_publication": "Élevé avec révisions suggérées"
}
```

**Dashboard Visuel:**
- Graphiques radar: scores par catégorie
- Courbe de tension narrative (par chapitre)
- Word cloud des thèmes principaux
- Statistiques: mots, chapitres, personnages, lieux

---

## 5. Modèles de Données

### 5.1 Schéma PostgreSQL

```sql
-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    subscription_tier VARCHAR(20) DEFAULT 'free', -- free, author, pro
    subscription_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    preferences JSONB DEFAULT '{}',
    usage_stats JSONB DEFAULT '{"words_generated": 0, "projects_created": 0}'
);

-- PROJECTS
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    genre VARCHAR(100),
    pitch TEXT,
    target_word_count INTEGER DEFAULT 80000,
    structure_type VARCHAR(50) DEFAULT 'three_acts', -- three_acts, heros_journey, custom
    status VARCHAR(20) DEFAULT 'active', -- active, archived, deleted
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    settings JSONB DEFAULT '{"auto_save": true, "language": "fr"}',
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

-- DOCUMENTS (Chapitres/Manuscrit)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(500),
    content TEXT,
    content_html TEXT, -- Version HTML pour l'éditeur
    position INTEGER, -- Ordre dans le projet
    type VARCHAR(50) DEFAULT 'chapter', -- chapter, scene, note
    word_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB DEFAULT '{"summary": null, "pov": null}'
);

CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_position ON documents(project_id, position);

-- VERSIONS (Historique)
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT,
    word_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    comment VARCHAR(500)
);

CREATE INDEX idx_versions_document_id ON document_versions(document_id);

-- CHARACTERS
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100), -- protagonist, antagonist, secondary, minor
    physical_description TEXT,
    personality_traits TEXT[],
    backstory TEXT,
    motivations TEXT,
    relationships JSONB DEFAULT '{}',
    character_arc TEXT,
    first_appearance_doc_id UUID REFERENCES documents(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_characters_project_id ON characters(project_id);

-- TIMELINE
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    absolute_date DATE,
    relative_time VARCHAR(100), -- "Day 1, Morning", "Week 3"
    chapter_id UUID REFERENCES documents(id),
    characters_involved UUID[],
    location VARCHAR(255),
    importance VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    created_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_timeline_project_id ON timeline_events(project_id);
CREATE INDEX idx_timeline_date ON timeline_events(project_id, absolute_date);

-- LOCATIONS (World-building)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- city, building, country, planet, etc.
    description TEXT,
    geography TEXT,
    first_appearance_doc_id UUID REFERENCES documents(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- WORLD_RULES (Pour SF/Fantasy)
CREATE TABLE world_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(100), -- magic, technology, society, physics
    rule_text TEXT NOT NULL,
    exceptions TEXT[],
    source_doc_id UUID REFERENCES documents(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- GLOSSARY (Termes spécifiques)
CREATE TABLE glossary_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    term VARCHAR(255) NOT NULL,
    definition TEXT NOT NULL,
    category VARCHAR(100),
    first_appearance_doc_id UUID REFERENCES documents(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ANALYSIS_REPORTS
CREATE TABLE analysis_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL, -- full, structure, characters, style, etc.
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    results JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_reports_project_id ON analysis_reports(project_id);

-- AGENT_FEEDBACK (Suggestions des agents)
CREATE TABLE agent_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id),
    agent_name VARCHAR(100) NOT NULL,
    feedback_type VARCHAR(100), -- suggestion, warning, error
    severity VARCHAR(20), -- low, medium, high, critical
    message TEXT NOT NULL,
    location JSONB, -- {chapter: 3, line: 45}
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feedback_project_id ON agent_feedback(project_id);
CREATE INDEX idx_feedback_resolved ON agent_feedback(project_id, resolved);

-- USAGE_TRACKING (Pour limites plans)
CREATE TABLE usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(100), -- words_generated, ai_request, export, etc.
    count INTEGER DEFAULT 1,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_date ON usage_tracking(user_id, created_at);
```

### 5.2 Schéma Qdrant (Vector Store)

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# Collection pour les chunks de documents
collection_config = {
    "collection_name": "thoth_documents",
    "vectors_config": VectorParams(
        size=1024,  # BGE-M3 embeddings
        distance=Distance.COSINE
    )
}

# Structure d'un point
point = {
    "id": "uuid",
    "vector": [0.1, 0.2, ...],  # 1024 dimensions
    "payload": {
        "project_id": "uuid",
        "document_id": "uuid",
        "chunk_index": 0,
        "text": "Contenu du chunk...",
        "chunk_type": "narrative",  # narrative, dialogue, description
        "chapter_number": 3,
        "characters_mentioned": ["Marie", "Paul"],
        "location": "Gare Saint-Lazare",
        "timestamp_in_story": "Day 3, Evening",
        "word_count": 250,
        "created_at": "2025-10-29T10:00:00Z"
    }
}
```

**Collections:**
- `thoth_documents`: Chunks de texte principal
- `thoth_characters`: Embeddings descriptions personnages
- `thoth_locations`: Embeddings descriptions lieux
- `thoth_style_samples`: Échantillons style pour référence

---

## 6. API et Intégrations

### 6.1 Endpoints REST API

**Base URL:** `https://api.thoth.ai/v1`

#### Authentication

```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh-token
GET  /auth/me
```

#### Projects

```
GET    /projects              # Liste projets utilisateur
POST   /projects              # Créer nouveau projet
GET    /projects/{id}         # Détails projet
PUT    /projects/{id}         # Mettre à jour
DELETE /projects/{id}         # Supprimer
POST   /projects/{id}/archive # Archiver
```

**Exemple Request Body (POST /projects):**
```json
{
  "title": "Les Ombres de Néopolis",
  "genre": "Science-Fiction",
  "pitch": "Dans une mégapole futuriste...",
  "target_word_count": 100000,
  "structure_type": "three_acts"
}
```

#### Documents

```
GET    /projects/{project_id}/documents
POST   /projects/{project_id}/documents
GET    /documents/{id}
PUT    /documents/{id}
DELETE /documents/{id}
POST   /documents/{id}/versions              # Créer snapshot
GET    /documents/{id}/versions              # Liste versions
POST   /documents/import                     # Importer fichier
```

**Exemple Request Body (PUT /documents/{id}):**
```json
{
  "content": "Texte du chapitre...",
  "content_html": "<p>Texte du chapitre...</p>",
  "title": "Chapitre 3: La Révélation",
  "auto_index": true
}
```

#### Characters

```
GET    /projects/{project_id}/characters
POST   /projects/{project_id}/characters
GET    /characters/{id}
PUT    /characters/{id}
DELETE /characters/{id}
POST   /characters/{id}/extract-from-text    # Auto-extraction
```

#### Timeline

```
GET    /projects/{project_id}/timeline
POST   /projects/{project_id}/timeline/events
PUT    /timeline/events/{id}
DELETE /timeline/events/{id}
GET    /projects/{project_id}/timeline/graph # Timeline visuelle
```

#### Agents

**Génération de contenu:**
```
POST /agents/generate
{
  "project_id": "uuid",
  "agent": "writer",  # writer, dialogue, etc.
  "context": {
    "document_id": "uuid",
    "instruction": "Marie rencontre Paul à la gare",
    "tone": "mélancolique",
    "length": 500
  }
}
```

**Analyse:**
```
POST   /agents/analyze
{
  "project_id": "uuid",
  "document_id": "uuid",  # Optionnel, si null = tout le projet
  "agents": ["timeline", "characters", "style"],  # Liste ou ["all"]
  "async": true
}

Response:
{
  "task_id": "uuid",
  "status": "processing",
  "estimated_time": 120  # secondes
}

GET /agents/analyze/status/{task_id}
{
  "status": "completed",
  "progress": 100,
  "results": {...}
}
```

**Suggestions en temps réel:**
```
POST /agents/suggest
{
  "project_id": "uuid",
  "context": "Derniers paragraphes...",
  "position": {"document_id": "uuid", "cursor": 1234},
  "type": "continuation"  # continuation, dialogue, description
}

Response (Streaming):
{
  "suggestions": [
    {"text": "Première suggestion...", "score": 0.9},
    {"text": "Deuxième suggestion...", "score": 0.85}
  ]
}
```

#### Corrections

```
GET /documents/{id}/corrections
{
  "types": ["grammar", "spelling", "style"],  # Filtres optionnels
  "severity": ["error", "warning"]
}

POST /documents/{id}/apply-corrections
{
  "correction_ids": ["uuid1", "uuid2", ...]
}
```

#### Analysis Reports

```
GET    /projects/{project_id}/reports
GET    /reports/{id}
POST   /projects/{project_id}/reports/full   # Rapport complet
GET    /reports/{id}/export/pdf
```

#### Exports

```
POST /documents/{id}/export
{
  "format": "pdf",  # pdf, docx, epub, markdown
  "options": {
    "include_toc": true,
    "font": "Georgia",
    "font_size": 12,
    "margins": "normal"
  }
}

Response:
{
  "download_url": "https://s3.../export.pdf",
  "expires_at": "2025-10-30T10:00:00Z"
}
```

#### Usage & Limits

```
GET /users/me/usage
{
  "period": "current_month",
  "words_generated": 12450,
  "limit": 50000,
  "remaining": 37550,
  "resets_at": "2025-11-01T00:00:00Z"
}
```

### 6.2 WebSocket API

**Connection:** `wss://api.thoth.ai/ws`

**Authentication:** Token dans query params ou header

**Messages:**

```javascript
// Client → Server
{
  "action": "subscribe",
  "channel": "project:uuid",
  "events": ["document_update", "agent_feedback"]
}

// Server → Client (Document update)
{
  "event": "document_update",
  "data": {
    "document_id": "uuid",
    "updated_by": "user_id",
    "changes": {...}
  }
}

// Server → Client (Agent streaming)
{
  "event": "agent_generation",
  "data": {
    "task_id": "uuid",
    "chunk": "Texte généré...",
    "done": false
  }
}

// Server → Client (Analysis progress)
{
  "event": "analysis_progress",
  "data": {
    "task_id": "uuid",
    "progress": 45,
    "current_step": "Analyzing timeline..."
  }
}
```

### 6.3 Intégrations Externes

#### DeepSeek API

```python
import openai

client = openai.OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com"
)

# Utilisation
response = client.chat.completions.create(
    model="deepseek-chat",  # ou deepseek-reasoner
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ],
    stream=True,
    temperature=0.7,
    max_tokens=2000
)
```

#### LanguageTool (Corrections)

```python
import language_tool_python

tool = language_tool_python.LanguageTool('fr')
matches = tool.check(text)

for match in matches:
    error = {
        "type": match.ruleId,
        "message": match.message,
        "replacements": match.replacements,
        "context": match.context,
        "offset": match.offset,
        "length": match.errorLength
    }
```

---

## 7. Interface Utilisateur

### 7.1 Pages Principales

#### 7.1.1 Dashboard (`/dashboard`)

**Éléments:**
- Liste projets (cards avec: titre, genre, progression, dernière modif)
- Bouton "Nouveau Projet"
- Stats utilisateur: mots générés ce mois, streak, projets actifs
- Accès rapide projets récents

**Wireframe concept:**
```
┌────────────────────────────────────────────────────────┐
│  THOTH                    [Recherche]      [User Menu] │
├────────────────────────────────────────────────────────┤
│  Mes Projets                        [+ Nouveau Projet] │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ Les Ombres  │  │ Nouveau     │  │ Le Dernier  │   │
│  │ SF │ 45%    │  │ Roman │ 12% │  │ Fantaisie   │   │
│  │ 45k / 100k  │  │ 10k / 80k   │  │ Archivé     │   │
│  │ Modif: 2h   │  │ Modif: 1j   │  │             │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Statistiques ce mois                              │ │
│  │ Mots générés: 12,450 / 50,000                    │ │
│  │ Streak: 🔥 7 jours                               │ │
│  │ [Graphique progression]                          │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

#### 7.1.2 Éditeur (`/project/{id}/editor`)

**Layout:**
- Sidebar gauche: navigation chapitres
- Zone centrale: éditeur Tiptap (WYSIWYG)
- Sidebar droite (collapsible): agents, suggestions, personnages

**Fonctionnalités clés:**
- Autocomplétion (Tab)
- Commandes slash (/générer, /personnage, /lieu)
- Compteur mots temps réel
- Indicateurs corrections (soulignement rouge/bleu)
- Mode focus (masque sidebars)

**Toolbar:**
```
[B] [I] [U] | [H1] [H2] [Quote] | [List] [Link] | [Undo] [Redo]
                                              [Agents ▼] [Export]
```

**Sidebar Droite - Agents:**
```
┌──────────────────────┐
│ 🤖 Assistants        │
├──────────────────────┤
│ ✍️ Générer suite     │
│ 💬 Améliorer dialogue│
│ 👤 Ajouter personnage│
│ 📊 Analyser chapitre │
│                      │
│ Suggestions (3)      │
│ ├─ Incohérence temp. │
│ ├─ Répétition "vite" │
│ └─ Cliché détecté    │
└──────────────────────┘
```

#### 7.1.3 Structure (`/project/{id}/structure`)

**Vue Kanban:**
- Colonnes: Acte 1, Acte 2, Acte 3 (ou custom)
- Cards chapitres/scènes drag & drop
- Code couleur par arc narratif

**Vue Timeline:**
- Ligne temporelle horizontale
- Événements clés positionnés
- Zoom in/out

**Actions:**
- Ajouter chapitre/scène
- Réorganiser par drag & drop
- Éditer résumé
- Voir suggestions Agent Architecte

#### 7.1.4 Personnages (`/project/{id}/characters`)

**Layout:**
- Liste personnages (sidebar ou cards)
- Fiche détaillée personnage sélectionné
- Graphe relationnel interactif

**Fiche Personnage:**
```
┌────────────────────────────────────────────┐
│ [Photo] Marie Dubois                       │
│         Protagoniste                       │
├────────────────────────────────────────────┤
│ Physique                                   │
│ 32 ans, 1m68, cheveux châtains...         │
│                                            │
│ Personnalité                               │
│ [Déterminée] [Méfiante] [Solitaire]       │
│                                            │
│ Backstory                                  │
│ Orpheline à 8 ans...                       │
│                                            │
│ Arc narratif                               │
│ Départ: Fermée émotionnellement           │
│ Évolution: Apprend à faire confiance      │
│ Arrivée: Ouverte à l'amour                │
│                                            │
│ Relations                                  │
│ [Graphe mini]                              │
│                                            │
│ Mentions dans le texte (23)               │
│ ├─ Chapitre 1, ligne 45                   │
│ ├─ Chapitre 2, ligne 89                   │
│ └─ ...                                     │
└────────────────────────────────────────────┘
```

#### 7.1.5 Timeline (`/project/{id}/timeline`)

**Vue graphique:**
- Axe horizontal = temps
- Événements = points cliquables
- Filtres: personnage, importance, chapitre

**Détail événement:**
- Description
- Personnages impliqués
- Lieu
- Lien vers chapitre source

#### 7.1.6 Analyse (`/project/{id}/analysis`)

**Dashboard avec onglets:**

**Onglet Général:**
- Score global /100
- Graphique radar (structure, personnages, style, cohérence, pacing)
- Top 3 forces
- Top 3 axes d'amélioration

**Onglet Structure:**
- Visualisation actes
- Points de plot identifiés
- Recommandations Agent Architecte

**Onglet Personnages:**
- Liste avec scores
- Incohérences détectées

**Onglet Style:**
- Métriques (richesse lexicale, etc.)
- Suggestions Agent Styliste
- Exemples avant/après

**Onglet Cohérence:**
- Alertes Timeline Agent
- Alertes Continuity Tracker
- Violations World-Building

### 7.2 Composants Réutilisables

```typescript
// Shadcn/ui components utilisés:
- Button, Input, Select, Textarea
- Card, Badge, Avatar
- Dialog, Popover, Tooltip
- Table, Tabs
- Progress, Skeleton
- Toast (notifications)

// Composants custom:
- RichTextEditor (Tiptap wrapper)
- CharacterCard
- TimelineGraph (Recharts)
- AgentPanel
- AnalysisDashboard
- ExportDialog
```

### 7.3 États et Navigation

**State Management (Zustand):**

```typescript
// projectStore
interface ProjectStore {
  currentProject: Project | null;
  projects: Project[];
  loadProject: (id: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  // ...
}

// editorStore
interface EditorStore {
  content: string;
  selectedText: string;
  cursorPosition: number;
  isDirty: boolean;
  suggestions: Suggestion[];
  // ...
}

// agentStore
interface AgentStore {
  activeAgents: AgentStatus[];
  pendingTasks: Task[];
  feedback: AgentFeedback[];
  // ...
}
```

---

## 8. Système RAG

### 8.1 Architecture RAG

```
┌─────────────────────────────────────────────────────────┐
│                   INGESTION PIPELINE                     │
└─────────────────────────────────────────────────────────┘
                            ↓
        Document sauvegardé → Queue (Celery/Redis)
                            ↓
        ┌────────────────────────────────────────┐
        │      CHUNKING STRATEGY                 │
        ├────────────────────────────────────────┤
        │ 1. Découpage par chapitre              │
        │ 2. Subdivisions par scène/paragraphe   │
        │ 3. Overlap 100 tokens entre chunks     │
        │ 4. Max 500 tokens par chunk            │
        └────────────────────────────────────────┘
                            ↓
        ┌────────────────────────────────────────┐
        │      ENRICHISSEMENT METADATA           │
        ├────────────────────────────────────────┤
        │ - Détection personnages (NER spaCy)    │
        │ - Détection lieux                      │
        │ - Classification type (dialogue/narr.) │
        │ - Timestamp in story                   │
        │ - POV détecté                          │
        └────────────────────────────────────────┘
                            ↓
        ┌────────────────────────────────────────┐
        │      EMBEDDING                         │
        ├────────────────────────────────────────┤
        │ Modèle: BGE-M3 (multilingual)          │
        │ Dimension: 1024                        │
        │ Batch processing: 32 chunks           │
        └────────────────────────────────────────┘
                            ↓
        ┌────────────────────────────────────────┐
        │      INDEXATION QDRANT                 │
        ├────────────────────────────────────────┤
        │ Collection par projet                  │
        │ Payload enrichi                        │
        │ Index optimisé                         │
        └────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   RETRIEVAL PIPELINE                     │
└─────────────────────────────────────────────────────────┘
                            ↓
        Query utilisateur ou Agent
                            ↓
        ┌────────────────────────────────────────┐
        │      QUERY ENHANCEMENT                 │
        ├────────────────────────────────────────┤
        │ - Extraction entités (personnages...)  │
        │ - Expansion synonymes                  │
        │ - Reformulation si nécessaire          │
        └────────────────────────────────────────┘
                            ↓
        ┌────────────────────────────────────────┐
        │      EMBEDDING QUERY                   │
        │      (Même modèle BGE-M3)              │
        └────────────────────────────────────────┘
                            ↓
        ┌────────────────────────────────────────┐
        │      SEARCH QDRANT                     │
        ├────────────────────────────────────────┤
        │ Similarité cosine                      │
        │ Top-K = 10 chunks                      │
        │ Filtres metadata si applicable         │
        │ Score threshold > 0.7                  │
        └────────────────────────────────────────┘
                            ↓
        ┌────────────────────────────────────────┐
        │      RE-RANKING (Optionnel)            │
        ├────────────────────────────────────────┤
        │ Cross-encoder pour précision           │
        │ Réduit à Top-5                         │
        └────────────────────────────────────────┘
                            ↓
        ┌────────────────────────────────────────┐
        │      CONTEXT ASSEMBLY                  │
        ├────────────────────────────────────────┤
        │ - Réordonne chronologiquement si pertin│
        │ - Ajoute metadata lisible              │
        │ - Formatte pour LLM                    │
        │ - Limite tokens (max 4000)             │
        └────────────────────────────────────────┘
                            ↓
        Contexte enrichi → Agent LLM
```

### 8.2 Implémentation Code

```python
# rag_service.py

from llama_index.core import VectorStoreIndex, Document
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import spacy

class RAGService:
    def __init__(self):
        self.qdrant_client = QdrantClient(url=QDRANT_URL)
        self.embedding_model = SentenceTransformer('BAAI/bge-m3')
        self.nlp = spacy.load('fr_core_news_lg')
        
    async def index_document(
        self, 
        project_id: str, 
        document_id: str, 
        content: str,
        metadata: Dict
    ):
        """Indexe un document dans le vector store"""
        
        # 1. Chunking
        chunks = self._chunk_document(content, chunk_size=500, overlap=100)
        
        # 2. Enrichissement
        enriched_chunks = []
        for i, chunk in enumerate(chunks):
            enriched = await self._enrich_chunk(
                chunk, 
                index=i,
                document_id=document_id,
                base_metadata=metadata
            )
            enriched_chunks.append(enriched)
        
        # 3. Embedding
        texts = [c['text'] for c in enriched_chunks]
        embeddings = self.embedding_model.encode(texts, batch_size=32)
        
        # 4. Indexation Qdrant
        points = []
        for i, (chunk, embedding) in enumerate(zip(enriched_chunks, embeddings)):
            point = PointStruct(
                id=f"{document_id}_{i}",
                vector=embedding.tolist(),
                payload={
                    "project_id": project_id,
                    "document_id": document_id,
                    "chunk_index": i,
                    "text": chunk['text'],
                    **chunk['metadata']
                }
            )
            points.append(point)
        
        self.qdrant_client.upsert(
            collection_name=f"project_{project_id}",
            points=points
        )
        
        return len(points)
    
    def _chunk_document(self, content: str, chunk_size: int, overlap: int):
        """Découpage intelligent du document"""
        # Utilise tiktoken pour compter tokens précisément
        import tiktoken
        enc = tiktoken.get_encoding("cl100k_base")
        
        tokens = enc.encode(content)
        chunks = []
        
        for i in range(0, len(tokens), chunk_size - overlap):
            chunk_tokens = tokens[i:i + chunk_size]
            chunk_text = enc.decode(chunk_tokens)
            chunks.append(chunk_text)
        
        return chunks
    
    async def _enrich_chunk(self, text: str, index: int, document_id: str, base_metadata: Dict):
        """Enrichit un chunk avec metadata"""
        doc = self.nlp(text)
        
        # Extraction entités
        characters = [ent.text for ent in doc.ents if ent.label_ == "PER"]
        locations = [ent.text for ent in doc.ents if ent.label_ == "LOC"]
        
        # Classification type
        chunk_type = self._classify_chunk_type(text)
        
        metadata = {
            "chunk_index": index,
            "chunk_type": chunk_type,
            "characters_mentioned": list(set(characters)),
            "locations_mentioned": list(set(locations)),
            "word_count": len(text.split()),
            **base_metadata
        }
        
        return {
            "text": text,
            "metadata": metadata
        }
    
    def _classify_chunk_type(self, text: str) -> str:
        """Détermine le type de chunk"""
        dialogue_ratio = text.count('«') + text.count('—') + text.count('"')
        
        if dialogue_ratio > 3:
            return "dialogue"
        elif any(word in text.lower() for word in ['voyait', 'sentait', 'regardait']):
            return "description"
        else:
            return "narrative"
    
    async def retrieve(
        self, 
        project_id: str, 
        query: str, 
        filters: Dict = None,
        top_k: int = 10
    ) -> List[Dict]:
        """Récupère contexte pertinent"""
        
        # Embedding query
        query_embedding = self.embedding_model.encode(query)
        
        # Filtres Qdrant
        qdrant_filter = {"project_id": project_id}
        if filters:
            qdrant_filter.update(filters)
        
        # Recherche
        results = self.qdrant_client.search(
            collection_name=f"project_{project_id}",
            query_vector=query_embedding.tolist(),
            query_filter=qdrant_filter,
            limit=top_k,
            score_threshold=0.7
        )
        
        # Formattage
        context_chunks = []
        for result in results:
            context_chunks.append({
                "text": result.payload['text'],
                "score": result.score,
                "metadata": {
                    k: v for k, v in result.payload.items() 
                    if k != 'text'
                }
            })
        
        return context_chunks
    
    def format_context_for_llm(self, chunks: List[Dict]) -> str:
        """Formate contexte pour prompt LLM"""
        formatted = "=== CONTEXTE PERTINENT ===\n\n"
        
        for i, chunk in enumerate(chunks, 1):
            meta = chunk['metadata']
            formatted += f"[Extrait {i}]\n"
            formatted += f"Source: Chapitre {meta.get('chapter_number', '?')}\n"
            
            if meta.get('characters_mentioned'):
                formatted += f"Personnages: {', '.join(meta['characters_mentioned'])}\n"
            
            formatted += f"\n{chunk['text']}\n\n"
            formatted += "---\n\n"
        
        return formatted
```

---

## 9. Sécurité et Performance

### 9.1 Sécurité

**Authentication:**
- JWT tokens (access + refresh)
- Access token: 15min expiration
- Refresh token: 7 jours, stocké HttpOnly cookie
- Bcrypt pour hash passwords (cost=12)

**Authorization:**
- RBAC: user, premium_user, admin
- Vérifications au niveau route et service
- Rate limiting par endpoint et user

**Data Protection:**
- Encryption at rest (AWS RDS encrypted)
- TLS 1.3 pour transit
- S3 buckets privés avec signed URLs temporaires
- PII minimization

**Input Validation:**
- Pydantic models pour validation
- Sanitization HTML (bleach)
- Max upload size: 10MB
- File type whitelist: .docx, .txt, .pdf, .md

**Rate Limiting:**
```python
# Par utilisateur
FREE_TIER = {
    "ai_requests_per_hour": 20,
    "words_generated_per_month": 10000,
    "exports_per_day": 3
}

AUTHOR_TIER = {
    "ai_requests_per_hour": 100,
    "words_generated_per_month": 50000,
    "exports_per_day": 20
}

PRO_TIER = {
    "ai_requests_per_hour": 500,
    "words_generated_per_month": 200000,
    "exports_per_day": 100
}
```

**Logging & Monitoring:**
- Sentry pour error tracking
- CloudWatch logs
- Audit trail actions critiques
- Alertes anomalies (tentatives brute-force, etc.)

### 9.2 Performance

**Caching Strategy:**
```python
# Redis cache
- User sessions: 15min TTL
- RAG retrievals (hot queries): 1h TTL
- Analysis reports: 24h TTL
- API responses (idempotent): 5min TTL
```

**Database Optimization:**
- Index sur foreign keys
- Index composites pour requêtes fréquentes
- Connection pooling (SQLAlchemy pool_size=20)
- Query optimization (EXPLAIN ANALYZE)
- Pagination (cursor-based pour grande datasets)

**API Optimization:**
- Response compression (gzip)
- Pagination: limit=20 par défaut, max=100
- Field selection (?fields=title,status)
- Async endpoints avec FastAPI
- Background tasks pour opérations longues

**Frontend Optimization:**
- Code splitting (Next.js automatic)
- Image optimization (Next.js Image)
- Lazy loading composants lourds
- React Query cache
- Debouncing inputs (300ms)
- Virtualization pour listes longues (react-window)

**LLM Optimization:**
- Cache prompt réponses similaires
- Streaming pour UX réactive
- Batch requests quand possible
- Token counting avant appel (évite rejets)
- Fallback modèles (V3 → R1 si échec)

**Monitoring:**
- Latence P50, P95, P99 par endpoint
- Taux erreurs
- Coût LLM par utilisateur
- Queue length (Celery)
- Database query time
- Alertes: latence >2s, error rate >5%

---

## 10. Plan de Développement

### Phase 1: MVP (4 semaines)

**Semaine 1: Setup + Auth + Base**
- [ ] Setup infrastructure AWS (Terraform)
- [ ] Setup repos (frontend + backend)
- [ ] CI/CD pipelines
- [ ] Authentication (JWT)
- [ ] User registration/login
- [ ] Base de données PostgreSQL (migrations)
- [ ] Models: User, Project, Document

**Semaine 2: Éditeur + RAG**
- [ ] Interface Dashboard projets
- [ ] CRUD Projets
- [ ] Éditeur Tiptap intégré
- [ ] Sauvegarde auto
- [ ] RAG Service (indexation basique)
- [ ] Qdrant setup
- [ ] Chunking + embedding
- [ ] Test indexation

**Semaine 3: Agents Core (3 premiers)**
- [ ] Agent Rédacteur Principal
- [ ] Agent Correcteur Linguistique
- [ ] Agent Gestionnaire Personnages (basique)
- [ ] Intégration DeepSeek API
- [ ] Endpoints génération
- [ ] Interface suggestions dans éditeur
- [ ] WebSocket pour streaming

**Semaine 4: Polish + Test**
- [ ] Export PDF/DOCX basique
- [ ] Interface personnages
- [ ] Corrections en temps réel
- [ ] Tests end-to-end
- [ ] Fixes bugs
- [ ] Déploiement staging
- [ ] Tests utilisateurs (5 bêta-testeurs)

**Livrables MVP:**
- Créer projet ✅
- Écrire avec assistance IA ✅
- Générer du contenu ✅
- Corrections automatiques ✅
- Gestion personnages basique ✅
- Export PDF ✅

---

### Phase 2: Agents Complets (3 semaines)

**Semaine 5-6: Agents Cohérence**
- [ ] Agent Timeline
- [ ] Agent World-Building
- [ ] Agent Continuity Tracker
- [ ] Interfaces visualisation (timeline, graphe)
- [ ] Détection incohérences
- [ ] Alertes utilisateur

**Semaine 7: Agents Qualité + Analyse**
- [ ] Agent Styliste
- [ ] Agent Dialoguiste
- [ ] Agent Analyste
- [ ] Dashboard analyse
- [ ] Rapports exportables
- [ ] Graphiques métriques

---

### Phase 3: Features Avancées (3 semaines)

**Semaine 8: Structure + Organisation**
- [ ] Agent Architecte Narratif
- [ ] Agent Planificateur Scènes
- [ ] Vue structure Kanban
- [ ] Réorganisation drag & drop
- [ ] Suggestions structure

**Semaine 9: Import + Export Avancés**
- [ ] Import DOCX/PDF (parsing)
- [ ] Export EPUB
- [ ] Templates export personnalisables
- [ ] Versionning documents
- [ ] Comparaison versions (diff)

**Semaine 10: Abonnements + Limites**
- [ ] Intégration Stripe
- [ ] Gestion abonnements
- [ ] Tracking usage
- [ ] Limites par plan
- [ ] Upgrade/downgrade flows

---

### Phase 4: Polish + Launch (2 semaines)

**Semaine 11: Performance + Sécurité**
- [ ] Audit sécurité
- [ ] Optimisations performance
- [ ] Load testing
- [ ] Monitoring avancé
- [ ] Documentation API

**Semaine 12: Préparation Launch**
- [ ] Landing page marketing
- [ ] Documentation utilisateur
- [ ] Tutoriels vidéo
- [ ] Support email setup
- [ ] Plan marketing
- [ ] Déploiement production

**LAUNCH** 🚀

---

### Roadmap Post-Launch

**Q1 (3 mois post-launch):**
- Collaboration multi-utilisateurs (plan Pro)
- Version mobile (responsive)
- Templates de projets
- Intégrations (Google Docs, Scrivener)
- Communauté (forum utilisateurs)

**Q2:**
- Agents spécialisés par genre (thriller, romance, fantasy)
- Analyse de marché (comparer à best-sellers)
- Suggestions de publishing
- API publique (pour intégrations tierces)

**Q3:**
- Mode offline
- Applications natives (desktop Electron)
- Fonctionnalités de co-écriture en temps réel
- Marketplace templates/agents communautaires

---

## 11. Critères d'Acceptation & Tests

### 11.1 Tests Critiques

**Test 1: Génération de Contenu**
```
GIVEN un projet avec contexte (personnages, chapitre précédent)
WHEN utilisateur demande génération de 500 mots
THEN
  - Contenu généré en <10 secondes
  - Cohérent avec personnages existants
  - Style similaire au reste du projet
  - Pas de contradictions factuelles
```

**Test 2: Détection Incohérences**
```
GIVEN un manuscrit avec incohérence temporelle évidente
WHEN Agent Timeline analyse
THEN
  - Incohérence détectée
  - Localisation précise (chapitre + ligne)
  - Suggestion de correction
  - Sévérité correcte
```

**Test 3: RAG Retrieval**
```
GIVEN un projet de 50k mots indexé
WHEN query "Que sait-on de Marie?"
THEN
  - Retrieval en <2 secondes
  - Top-5 chunks pertinents
  - Score relevance >0.75
  - Contexte bien formaté
```

**Test 4: Performance Éditeur**
```
GIVEN document de 10k mots
WHEN utilisateur tape/édite
THEN
  - Latency <100ms
  - Sauvegarde auto fonctionne
  - Pas de perte de données
  - Corrections s'affichent <1s
```

### 11.2 Métriques de Succès Technique

**Performance:**
- API latency P95 <500ms
- Page load time <2s
- LLM generation start <3s
- RAG retrieval <2s
- Uptime >99.5%

**Qualité:**
- Error rate <1%
- Test coverage >80%
- Critical bugs: 0
- Debt ratio <5%

**Coûts:**
- LLM cost per user <2€/mois
- Infrastructure cost <250€/mois (100 users)
- Seuil rentabilité: 15 users payants

---

## 12. Annexes

### 12.1 Glossaire Technique

- **RAG**: Retrieval-Augmented Generation
- **LLM**: Large Language Model
- **NER**: Named Entity Recognition
- **POV**: Point of View
- **Chunking**: Découpage de texte
- **Embedding**: Représentation vectorielle
- **Vector Store**: Base de données vectorielle
- **Streaming**: Réponse progressive en temps réel

### 12.2 Stack Versions

```
Python: 3.11
Node.js: 20 LTS
PostgreSQL: 15
Redis: 7
Qdrant: 1.11
Next.js: 14
FastAPI: 0.115
LangChain: 0.3
```

### 12.3 Variables d'Environnement

```bash
# Backend .env
DATABASE_URL=postgresql://user:pass@host:5432/thoth
REDIS_URL=redis://localhost:6379
QDRANT_URL=http://localhost:6333
DEEPSEEK_API_KEY=sk-xxx
LANGUAGETOOL_URL=http://localhost:8010
JWT_SECRET=xxx
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
S3_BUCKET_NAME=thoth-storage
SENTRY_DSN=xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

```bash
# Frontend .env
NEXT_PUBLIC_API_URL=https://api.thoth.ai
NEXT_PUBLIC_WS_URL=wss://api.thoth.ai/ws
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx
```

### 12.4 Commandes Utiles

```bash
# Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload --port 8000

# Frontend
npm install
npm run dev

# Tests
pytest tests/
npm run test

# Deploy
terraform apply
docker-compose up -d
```

---

## Conclusion

Ce document constitue la spécification complète de **THOTH**, l'assistant d'écriture intelligent. Le développeur en charge du projet dispose maintenant de:

✅ Vision claire du produit  
✅ Spécifications fonctionnelles détaillées  
✅ Architecture technique complète  
✅ Détail des 11 agents IA  
✅ Schémas de données  
✅ API endpoints  
✅ Maquettes interface  
✅ Système RAG documenté  
✅ Plan de développement  
✅ Critères de succès  

**Prochaines étapes:**
1. Review des specs avec l'équipe
2. Setup infrastructure AWS
3. Démarrage Phase 1 (MVP)

**Contact:** besnard@thoth.ai  
**Date de début estimée:** Novembre 2025  
**Launch target:** Février 2026

---

*Document vivant - Version 1.0 - Sera mis à jour selon avancement du projet*
