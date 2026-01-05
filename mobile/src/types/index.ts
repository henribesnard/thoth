/**
 * Type definitions for THOTH mobile app
 */

export type Genre =
  | 'fantasy'
  | 'science-fiction'
  | 'romance'
  | 'thriller'
  | 'mystery'
  | 'horror'
  | 'historical'
  | 'contemporary'
  | 'young-adult'
  | 'other';

export type ProjectStatus =
  | 'planning'
  | 'in-progress'
  | 'paused'
  | 'completed'
  | 'archived';

export type DocumentType =
  | 'chapter'
  | 'scene'
  | 'note'
  | 'outline'
  | 'research';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  subscription_tier: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  genre?: Genre;
  status: ProjectStatus;
  target_word_count?: number;
  current_word_count: number;
  structure_template?: string;
  metadata: Record<string, any>;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  document_type: DocumentType;
  word_count: number;
  project_id: string;
  order_index: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  name: string;
  role?: string;
  description?: string;
  backstory?: string;
  traits?: string[];
  relationships?: Record<string, string>;
  project_id: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  project_id?: string;
  user_id: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}

export interface ProjectCreate {
  title: string;
  description?: string;
  genre?: Genre;
  target_word_count?: number;
  structure_template?: string;
}

export interface ChatMessageCreate {
  message: string;
  project_id?: string;
}

export interface ChatMessageResponse {
  response: string;
  message_id: string;
}
