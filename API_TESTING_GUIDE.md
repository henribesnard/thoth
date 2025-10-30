# Guide de Test de l'API THOTH

Ce document vous guide pour tester manuellement l'API backend THOTH.

## 🚀 Préparation

### 1. Démarrer les Services

```bash
# Démarrer tous les services Docker
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps

# Voir les logs
docker-compose logs -f backend
```

### 2. Accéder à la Documentation Interactive

Ouvrez votre navigateur : **http://localhost:8000/api/docs**

Vous verrez l'interface Swagger UI avec tous les endpoints disponibles.

---

## 📝 Tests des Endpoints

### Health Checks

#### Test 1 : Health Check Basic
```bash
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

#### Test 2 : Database Health Check
```bash
curl http://localhost:8000/api/v1/health/db
```

**Résultat attendu :**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

### Authentification

#### Test 3 : Inscription d'un Utilisateur

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

**Résultat attendu :**
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "full_name": "Test User",
  "is_active": true,
  "is_superuser": false,
  "subscription_tier": "free",
  "subscription_expires_at": null,
  "created_at": "2025-10-29T...",
  "last_login_at": null
}
```

#### Test 4 : Connexion (OAuth2 Form)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"
```

**Résultat attendu :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

⚠️ **Important** : Copiez le `access_token`, vous en aurez besoin pour les tests suivants !

#### Test 5 : Connexion (JSON Alternative)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Test 6 : Obtenir les Infos de l'Utilisateur Connecté

```bash
# Remplacez YOUR_TOKEN par le token obtenu à l'étape 4
curl http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu :**
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "full_name": "Test User",
  ...
}
```

---

### Projects

Pour tous les tests suivants, ajoutez le header :
```
-H "Authorization: Bearer YOUR_TOKEN"
```

#### Test 7 : Créer un Projet

```bash
curl -X POST http://localhost:8000/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon Premier Roman",
    "description": "Un roman fantastique épique",
    "genre": "fantasy",
    "target_word_count": 100000,
    "structure_template": "3-act"
  }'
```

**Résultat attendu :**
```json
{
  "id": "project-uuid",
  "title": "Mon Premier Roman",
  "description": "Un roman fantastique épique",
  "genre": "fantasy",
  "status": "draft",
  "current_word_count": 0,
  "target_word_count": 100000,
  "structure_template": "3-act",
  "metadata": {},
  "owner_id": "user-uuid",
  "created_at": "2025-10-29T...",
  "updated_at": "2025-10-29T..."
}
```

⚠️ Copiez le `id` du projet pour les tests suivants !

#### Test 8 : Lister les Projets

```bash
curl http://localhost:8000/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu :**
```json
{
  "projects": [
    {
      "id": "project-uuid",
      "title": "Mon Premier Roman",
      ...
    }
  ],
  "total": 1
}
```

#### Test 9 : Obtenir un Projet Spécifique

```bash
# Remplacez PROJECT_ID par l'ID du projet
curl http://localhost:8000/api/v1/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test 10 : Mettre à Jour un Projet

```bash
curl -X PUT http://localhost:8000/api/v1/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon Premier Roman - Version 2",
    "status": "in_progress"
  }'
```

---

### Documents

#### Test 11 : Créer un Document (Chapitre)

```bash
curl -X POST http://localhost:8000/api/v1/documents/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chapitre 1 : Le Début",
    "content": "Il était une fois dans un royaume lointain... Ceci est le premier chapitre de mon roman. Il contient environ vingt mots pour tester le compteur.",
    "document_type": "chapter",
    "project_id": "PROJECT_ID",
    "order_index": 0
  }'
```

**Résultat attendu :**
```json
{
  "id": "document-uuid",
  "title": "Chapitre 1 : Le Début",
  "content": "Il était une fois...",
  "document_type": "chapter",
  "order_index": 0,
  "word_count": 20,
  "metadata": {},
  "project_id": "project-uuid",
  "created_at": "2025-10-29T...",
  "updated_at": "2025-10-29T..."
}
```

#### Test 12 : Lister les Documents d'un Projet

```bash
curl "http://localhost:8000/api/v1/documents/?project_id=PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu :**
```json
{
  "documents": [
    {
      "id": "document-uuid",
      "title": "Chapitre 1 : Le Début",
      "word_count": 20,
      ...
    }
  ],
  "total": 1
}
```

#### Test 13 : Obtenir un Document Spécifique

```bash
curl http://localhost:8000/api/v1/documents/DOCUMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test 14 : Mettre à Jour un Document (Ajout de Contenu)

```bash
curl -X PUT http://localhost:8000/api/v1/documents/DOCUMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Il était une fois dans un royaume lointain... Ceci est le premier chapitre de mon roman. Il contient maintenant beaucoup plus de mots pour tester correctement le compteur de mots automatique. Le système devrait mettre à jour le nombre de mots du document et aussi le nombre total de mots du projet."
  }'
```

**Note** : Le `word_count` devrait être automatiquement mis à jour !

#### Test 15 : Vérifier la Mise à Jour du Project Word Count

```bash
# Vérifier que le projet a bien son word count mis à jour
curl http://localhost:8000/api/v1/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Le champ `current_word_count` devrait refléter le total des mots de tous les documents.

---

### Characters

#### Test 16 : Créer un Personnage

```bash
curl -X POST http://localhost:8000/api/v1/characters/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aragorn",
    "description": "Le roi en exil",
    "physical_description": "Grand, cheveux noirs, yeux gris",
    "personality": "Courageux, noble, loyal",
    "backstory": "Héritier d'\''Isildur, élevé à Rivendell",
    "project_id": "PROJECT_ID"
  }'
```

**Résultat attendu :**
```json
{
  "id": "character-uuid",
  "name": "Aragorn",
  "description": "Le roi en exil",
  "physical_description": "Grand, cheveux noirs, yeux gris",
  "personality": "Courageux, noble, loyal",
  "backstory": "Héritier d'Isildur, élevé à Rivendell",
  "metadata": {},
  "project_id": "project-uuid",
  "created_at": "2025-10-29T...",
  "updated_at": "2025-10-29T..."
}
```

#### Test 17 : Lister les Personnages d'un Projet

```bash
curl "http://localhost:8000/api/v1/characters/?project_id=PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test 18 : Mettre à Jour un Personnage

```bash
curl -X PUT http://localhost:8000/api/v1/characters/CHARACTER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "personality": "Courageux, noble, loyal, et très sage"
  }'
```

#### Test 19 : Supprimer un Personnage

```bash
curl -X DELETE http://localhost:8000/api/v1/characters/CHARACTER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu** : Code HTTP 204 (No Content)

---

## 🧪 Tests via Swagger UI

### Méthode Alternative (Plus Simple)

1. Ouvrez http://localhost:8000/api/docs
2. Cliquez sur **"Authorize"** en haut à droite
3. Entrez votre token dans le format : `Bearer YOUR_TOKEN`
4. Cliquez sur **"Authorize"** puis **"Close"**
5. Vous pouvez maintenant tester tous les endpoints directement depuis l'interface !

### Avantages de Swagger UI :
- ✅ Interface graphique intuitive
- ✅ Génération automatique de requêtes
- ✅ Validation des données
- ✅ Réponses formatées
- ✅ Pas besoin de curl

---

## 📊 Scénario de Test Complet

Voici un scénario complet pour tester tout le workflow :

### 1. Inscription et Connexion
```bash
# 1. S'inscrire
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@example.com",
    "password": "mypassword123",
    "full_name": "Jane Austen"
  }'

# 2. Se connecter
curl -X POST http://localhost:8000/api/v1/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@example.com",
    "password": "mypassword123"
  }'

# Copier le token retourné
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Créer un Projet
```bash
curl -X POST http://localhost:8000/api/v1/projects/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pride and Prejudice 2.0",
    "description": "A modern retelling",
    "genre": "romance",
    "target_word_count": 80000
  }'

# Copier l'ID du projet
PROJECT_ID="abc-123-def"
```

### 3. Créer des Personnages
```bash
# Elizabeth Bennet
curl -X POST http://localhost:8000/api/v1/characters/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Elizabeth Bennet",
    "description": "Protagoniste principale",
    "personality": "Intelligente, spirited, indépendante",
    "project_id": "'$PROJECT_ID'"
  }'

# Mr. Darcy
curl -X POST http://localhost:8000/api/v1/characters/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mr. Darcy",
    "description": "Riche gentleman",
    "personality": "Fier, noble, réservé",
    "project_id": "'$PROJECT_ID'"
  }'
```

### 4. Créer des Chapitres
```bash
# Chapitre 1
curl -X POST http://localhost:8000/api/v1/documents/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chapter 1",
    "content": "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    "document_type": "chapter",
    "project_id": "'$PROJECT_ID'",
    "order_index": 0
  }'

# Chapitre 2
curl -X POST http://localhost:8000/api/v1/documents/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chapter 2",
    "content": "Mr. Bennet was among the earliest of those who waited on Mr. Bingley.",
    "document_type": "chapter",
    "project_id": "'$PROJECT_ID'",
    "order_index": 1
  }'
```

### 5. Vérifier le Résultat
```bash
# Voir tous les projets
curl http://localhost:8000/api/v1/projects/ \
  -H "Authorization: Bearer $TOKEN"

# Voir le projet avec word count mis à jour
curl http://localhost:8000/api/v1/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN"

# Voir tous les documents
curl "http://localhost:8000/api/v1/documents/?project_id=$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"

# Voir tous les personnages
curl "http://localhost:8000/api/v1/characters/?project_id=$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔧 Troubleshooting

### Erreur 401 Unauthorized
- Vérifiez que vous avez bien inclus le header `Authorization: Bearer TOKEN`
- Vérifiez que le token n'a pas expiré (durée : 7 jours par défaut)
- Reconnectez-vous pour obtenir un nouveau token

### Erreur 404 Not Found
- Vérifiez que l'ID du projet/document/personnage existe
- Vérifiez que vous êtes le propriétaire de la ressource

### Erreur 422 Validation Error
- Vérifiez que tous les champs requis sont présents
- Vérifiez le format des données (ex: email valide, min 8 caractères pour password)

### Base de Données Vide au Redémarrage
- C'est normal ! Les données sont dans un volume Docker
- Pour persister les données : ne pas utiliser `docker-compose down -v`
- Utiliser `docker-compose down` (sans le flag `-v`)

---

## 📝 Notes Importantes

### Fonctionnalités Automatiques
- ✅ **Word Count** : Calculé automatiquement à la création/modification de documents
- ✅ **Project Word Count** : Mis à jour automatiquement quand les documents changent
- ✅ **Timestamps** : `created_at` et `updated_at` gérés automatiquement
- ✅ **Ownership** : Tous les endpoints vérifient que l'utilisateur est propriétaire

### Sécurité
- ✅ Tous les endpoints (sauf auth) requièrent authentification
- ✅ Les utilisateurs ne peuvent accéder qu'à leurs propres projets
- ✅ Mots de passe hashés avec bcrypt
- ✅ JWT tokens avec expiration

### Pagination
- Paramètres disponibles sur les listes :
  - `skip` : Nombre d'éléments à sauter (défaut: 0)
  - `limit` : Nombre maximum d'éléments (défaut: 100, max: 100)

---

## ✅ Checklist de Test

- [ ] Health checks fonctionnent
- [ ] Inscription d'un utilisateur réussit
- [ ] Connexion retourne un token valide
- [ ] Token permet d'accéder à /auth/me
- [ ] Création de projet fonctionne
- [ ] Liste des projets affiche les projets de l'utilisateur
- [ ] Création de document fonctionne
- [ ] Word count est calculé correctement
- [ ] Project word count est mis à jour
- [ ] Création de personnage fonctionne
- [ ] Mise à jour fonctionne
- [ ] Suppression fonctionne
- [ ] Utilisateurs ne peuvent pas accéder aux projets des autres

---

## 🎉 Prochaines Étapes

Une fois que tous ces tests passent, vous êtes prêt pour :

1. **Tests Automatisés** : Écrire des tests pytest
2. **Frontend** : Développer l'interface React/Next.js
3. **Système RAG** : Implémenter l'indexation et le retrieval
4. **Agents IA** : Développer les 11 agents spécialisés

---

**Dernière mise à jour** : 29 Octobre 2025
