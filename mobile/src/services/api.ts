/**
 * API Service for THOTH mobile app
 * Handles all HTTP requests to the backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';
import type {
  User,
  Project,
  Document,
  Character,
  ChatMessage,
  AuthResponse,
  ProjectCreate,
  ChatMessageCreate,
  ChatMessageResponse,
  ApiError,
} from '../types';

class ApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        if (!this.authToken) {
          this.authToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        }
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await this.clearAuth();
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): string {
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.message) {
      return error.message;
    }
    return 'Une erreur est survenue';
  }

  // Authentication methods
  async setAuthToken(token: string) {
    this.authToken = token;
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async clearAuth() {
    this.authToken = null;
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  async register(email: string, password: string, full_name?: string): Promise<User> {
    const response = await this.client.post<User>('/auth/register', {
      email,
      password,
      full_name,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login/json', {
      email,
      password,
    });
    await this.setAuthToken(response.data.access_token);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    await this.clearAuth();
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    const response = await this.client.get<Project[]>('/projects');
    return response.data;
  }

  async getProject(projectId: string): Promise<Project> {
    const response = await this.client.get<Project>(`/projects/${projectId}`);
    return response.data;
  }

  async createProject(data: ProjectCreate): Promise<Project> {
    const response = await this.client.post<Project>('/projects', data);
    return response.data;
  }

  async updateProject(projectId: string, data: Partial<ProjectCreate>): Promise<Project> {
    const response = await this.client.put<Project>(`/projects/${projectId}`, data);
    return response.data;
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.client.delete(`/projects/${projectId}`);
  }

  // Document methods
  async getDocuments(projectId: string): Promise<Document[]> {
    const response = await this.client.get<Document[]>(`/projects/${projectId}/documents`);
    return response.data;
  }

  async getDocument(documentId: string): Promise<Document> {
    const response = await this.client.get<Document>(`/documents/${documentId}`);
    return response.data;
  }

  // Character methods
  async getCharacters(projectId: string): Promise<Character[]> {
    const response = await this.client.get<Character[]>(`/projects/${projectId}/characters`);
    return response.data;
  }

  async getCharacter(characterId: string): Promise<Character> {
    const response = await this.client.get<Character>(`/characters/${characterId}`);
    return response.data;
  }

  // Chat methods
  async sendChatMessage(data: ChatMessageCreate): Promise<ChatMessageResponse> {
    const response = await this.client.post<ChatMessageResponse>('/chat/message', data);
    return response.data;
  }

  async getChatHistory(projectId?: string, limit: number = 50): Promise<ChatMessage[]> {
    const params = projectId ? { project_id: projectId, limit } : { limit };
    const response = await this.client.get<ChatMessage[]>('/chat/history', { params });
    return response.data;
  }

  // Agents methods
  async getAgents(): Promise<any[]> {
    const response = await this.client.get<any[]>('/agents/list');
    return response.data;
  }

  async executeAgent(agentType: string, action: string, taskData: any): Promise<any> {
    const response = await this.client.post('/agents/execute', {
      agent_type: agentType,
      action,
      task_data: taskData,
    });
    return response.data;
  }

  // File upload
  async uploadFile(file: any, projectId?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) {
      formData.append('project_id', projectId);
    }

    const response = await this.client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

// Export singleton instance
export const api = new ApiService();
export default api;
