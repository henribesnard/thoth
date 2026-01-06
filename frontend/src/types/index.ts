/**
 * TypeScript types for THOTH
 */

export enum ProjectStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum Genre {
  FICTION = 'fiction',
  FANTASY = 'fantasy',
  SCIFI = 'scifi',
  THRILLER = 'thriller',
  ROMANCE = 'romance',
  MYSTERY = 'mystery',
  HORROR = 'horror',
  HISTORICAL = 'historical',
  OTHER = 'other',
}

export interface User {
  id: string;
  email: string;
  full_name: string;
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

export interface ProjectCreate {
  title: string;
  description?: string;
  genre?: Genre;
  target_word_count?: number;
  structure_template?: string;
}

export interface ProjectUpdate {
  title?: string;
  description?: string;
  genre?: Genre;
  status?: ProjectStatus;
  target_word_count?: number;
  current_word_count?: number;
  structure_template?: string;
  metadata?: Record<string, any>;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  document_type: 'chapter' | 'scene' | 'note' | 'outline';
  order_index: number;
  word_count: number;
  project_id: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  version: string;
  created_at: string;
  word_count: number;
  min_word_count?: number;
  max_word_count?: number;
  summary?: string;
  instructions?: string;
  source_version_id?: string;
  source_version?: string;
  source_type?: string;
  source_comment_ids?: string[];
  content?: string;
  is_current?: boolean;
}

export interface DocumentComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  version_id?: string | null;
  applied_version_ids?: string[];
}

export interface Character {
  id: string;
  name: string;
  role?: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  description?: string;
  personality_traits?: string[];
  personality?: string;
  physical_description?: string;
  backstory?: string;
  goals?: string;
  relationships?: Record<string, string>;
  metadata: Record<string, any>;
  project_id: string;
  created_at: string;
  updated_at: string;
}

export interface CharacterCreate {
  name: string;
  project_id: string;
  description?: string;
  physical_description?: string;
  personality?: string;
  backstory?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  project_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ChatSession {
  id: string;
  project_id?: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface AgentTask {
  id: string;
  agent_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input_data: Record<string, any>;
  result?: Record<string, any>;
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface Instruction {
  id: string;
  title: string;
  detail: string;
  created_at: string;
}
