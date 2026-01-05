/**
 * Project store using Zustand
 */

import { create } from 'zustand';
import { api } from '../services/api';
import type { Project, ProjectCreate } from '../types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  fetchProject: (projectId: string) => Promise<void>;
  createProject: (data: ProjectCreate) => Promise<Project>;
  updateProject: (projectId: string, data: Partial<ProjectCreate>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await api.getProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur de chargement',
        isLoading: false,
      });
    }
  },

  fetchProject: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const project = await api.getProject(projectId);
      set({ currentProject: project, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur de chargement',
        isLoading: false,
      });
    }
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const project = await api.createProject(data);
      set((state) => ({
        projects: [project, ...state.projects],
        currentProject: project,
        isLoading: false,
      }));
      return project;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur de création',
        isLoading: false,
      });
      throw error;
    }
  },

  updateProject: async (projectId, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await api.updateProject(projectId, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? updatedProject : p)),
        currentProject:
          state.currentProject?.id === projectId ? updatedProject : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur de mise à jour',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteProject(projectId);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erreur de suppression',
        isLoading: false,
      });
      throw error;
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  clearError: () => set({ error: null }),
}));
