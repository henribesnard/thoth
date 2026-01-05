/**
 * Application configuration constants
 */

// API Configuration
export const API_CONFIG = {
  // Pour le développement local avec Expo
  // Sur Android Emulator: 10.0.2.2
  // Sur iOS Simulator: localhost
  // Sur appareil physique: utiliser l'IP de votre machine
  BASE_URL: __DEV__
    ? 'http://10.0.2.2:8001/api/v1' // Android emulator
    : 'https://your-production-api.com/api/v1',
  TIMEOUT: 30000,
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@thoth:auth_token',
  USER_DATA: '@thoth:user_data',
  THEME: '@thoth:theme',
};

// App info
export const APP_INFO = {
  NAME: 'THOTH',
  VERSION: '2.0.0',
  DESCRIPTION: 'Votre assistant d\'écriture littéraire',
};

// Genre options
export const GENRE_OPTIONS = [
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'science-fiction', label: 'Science-Fiction' },
  { value: 'romance', label: 'Romance' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'mystery', label: 'Mystère' },
  { value: 'horror', label: 'Horreur' },
  { value: 'historical', label: 'Historique' },
  { value: 'contemporary', label: 'Contemporain' },
  { value: 'young-adult', label: 'Young Adult' },
  { value: 'other', label: 'Autre' },
];

// Project status options
export const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planification', color: '#3B82F6' },
  { value: 'in-progress', label: 'En cours', color: '#10B981' },
  { value: 'paused', label: 'En pause', color: '#F59E0B' },
  { value: 'completed', label: 'Terminé', color: '#8B5CF6' },
  { value: 'archived', label: 'Archivé', color: '#6B7280' },
];

// Structure templates
export const STRUCTURE_TEMPLATES = [
  {
    value: '3-act',
    label: 'Structure en 3 actes',
    description: 'Structure narrative classique'
  },
  {
    value: 'hero-journey',
    label: 'Voyage du héros',
    description: 'Basé sur les travaux de Joseph Campbell'
  },
  {
    value: '7-point',
    label: 'Structure en 7 points',
    description: 'Pour les histoires complexes'
  },
  {
    value: 'save-the-cat',
    label: 'Save the Cat',
    description: 'Structure de Blake Snyder'
  },
  {
    value: 'kishotenketsu',
    label: 'Kishōtenketsu',
    description: 'Structure narrative japonaise'
  },
];
