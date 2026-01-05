# THOTH Mobile App 📱

Application mobile React Native + Expo pour THOTH, votre assistant d'écriture littéraire.

## ✨ Fonctionnalités

- 🔐 **Authentification complète** (Login/Register)
- 📊 **Dashboard moderne** avec statistiques
- 📝 **Gestion de projets** (création, modification, statistiques)
- 💬 **Chat intelligent** avec THOTH (contexte projet automatique)
- 📱 **100% Responsive** - Fonctionne sur Web, iOS et Android
- 🎨 **Design moderne** avec thème personnalisé

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ installé
- Backend THOTH en cours d'exécution (`http://localhost:8001`)
- Expo CLI (installé automatiquement)

### Installation

```bash
# Aller dans le dossier mobile
cd mobile

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

### Lancer sur différentes plateformes

```bash
# Web
npm run web

# Android (nécessite Android Studio / émulateur)
npm run android

# iOS (nécessite macOS + Xcode)
npm run ios
```

## ⚙️ Configuration de l'API

Par défaut, l'application se connecte à `http://10.0.2.2:8001/api/v1` (Android emulator).

Pour changer l'URL de l'API, éditez le fichier `src/constants/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://YOUR_IP:8001/api/v1', // Changez ici
  TIMEOUT: 30000,
};
```

### Configuration selon la plateforme

- **Android Emulator**: `http://10.0.2.2:8001/api/v1`
- **iOS Simulator**: `http://localhost:8001/api/v1`
- **Appareil physique**: `http://[IP_DE_VOTRE_PC]:8001/api/v1`
  - Trouvez votre IP avec:
    - Windows: `ipconfig`
    - Mac/Linux: `ifconfig`

## 📱 Utilisation sur Appareil Physique

1. Installez l'application **Expo Go** sur votre smartphone:
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Assurez-vous que votre téléphone et votre ordinateur sont sur le **même réseau WiFi**

3. Lancez l'app:
   ```bash
   npm start
   ```

4. Scannez le QR code affiché:
   - iOS: Utilisez l'app Appareil photo
   - Android: Utilisez Expo Go

5. **Important**: Changez l'URL de l'API dans `src/constants/config.ts` avec l'IP de votre PC

## 🏗️ Architecture

```
mobile/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── ui/             # Composants UI de base (Button, Input, Card...)
│   │   ├── chat/           # Composants de chat
│   │   └── projects/       # Composants de projets
│   ├── screens/            # Écrans de l'application
│   │   ├── Auth/           # Login, Register
│   │   ├── Dashboard/      # Dashboard principal
│   │   ├── Project/        # Détails projet, création
│   │   └── Chat/           # Interface de chat
│   ├── services/           # Services API
│   │   └── api.ts         # Client API principal
│   ├── store/             # State management (Zustand)
│   │   ├── authStore.ts   # État d'authentification
│   │   └── projectStore.ts # État des projets
│   ├── types/             # Définitions TypeScript
│   ├── theme/             # Thème de l'application
│   └── constants/         # Constantes et configuration
└── App.tsx               # Point d'entrée

```

## 🎨 Thème

L'application utilise un thème personnalisé défini dans `src/theme/index.ts`:

- **Primary**: Indigo (#6366F1)
- **Accent**: Magenta (#D946EF)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

## 📦 Dépendances Principales

- **React Native** - Framework mobile
- **Expo** - Toolchain et SDK
- **React Navigation** - Navigation entre écrans
- **Zustand** - State management
- **Axios** - Client HTTP
- **AsyncStorage** - Stockage local
- **React Native Paper** - Composants UI additionnels

## 🐛 Dépannage

### L'application ne se connecte pas au backend

1. Vérifiez que le backend est en cours d'exécution:
   ```bash
   curl http://localhost:8001/health
   ```

2. Vérifiez l'URL de l'API dans `src/constants/config.ts`

3. Sur appareil physique, utilisez l'IP de votre PC au lieu de `localhost`

### Erreur de dépendances

```bash
# Supprimez node_modules et réinstallez
rm -rf node_modules
npm install
```

### L'app ne démarre pas

```bash
# Nettoyez le cache Expo
npm start -- --clear
```

## 🚢 Build de Production

### Android APK

```bash
# Build APK
npx eas build --platform android --profile preview

# Build AAB pour Google Play
npx eas build --platform android --profile production
```

### iOS IPA

```bash
# Build pour TestFlight/App Store (nécessite compte Apple Developer)
npx eas build --platform ios --profile production
```

### Web

```bash
# Build pour le web
npm run build:web

# Les fichiers sont dans web-build/
```

## 📝 Scripts Disponibles

```bash
npm start          # Démarrer Expo
npm run android    # Lancer sur Android
npm run ios        # Lancer sur iOS
npm run web        # Lancer sur Web
npm run lint       # Vérifier le code
npm run type-check # Vérifier les types TypeScript
```

## 🔒 Sécurité

- Les tokens JWT sont stockés de manière sécurisée avec AsyncStorage
- Les mots de passe ne sont jamais stockés en clair
- Toutes les requêtes API utilisent HTTPS en production

## 📄 License

MIT

## 👥 Support

Pour toute question ou problème, consultez la documentation principale du projet THOTH.

---

**Version**: 2.0.0
**Date**: 2025-10-31
**Statut**: ✅ Production Ready
