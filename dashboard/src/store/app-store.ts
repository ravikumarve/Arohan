// Global state management using Zustand
// Centralized store for application-wide state

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types for our global state
interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  theme: 'dark' | 'light';
  language: string;
  
  // User State
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  
  // Notification State
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  
  // Loading State
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setLanguage: (language: string) => void;
  setUser: (user: AppState['user']) => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setGlobalLoading: (loading: boolean) => void;
  setLoadingState: (key: string, value: boolean) => void;
  clearLoadingState: (key: string) => void;
  reset: () => void;
}

// Initial state
const initialState = {
  sidebarCollapsed: false,
  theme: 'dark' as const,
  language: 'en',
  user: null,
  notifications: [],
  globalLoading: false,
  loadingStates: {},
};

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      
      // UI Actions
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      
      // User Actions
      setUser: (user) => set({ user }),
      
      // Notification Actions
      addNotification: (notification) => set((state) => ({
        notifications: [
          ...state.notifications,
          {
            ...notification,
            id: `notification-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
          },
        ],
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
      clearNotifications: () => set({ notifications: [] }),
      
      // Loading Actions
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
      setLoadingState: (key, value) => set((state) => ({
        loadingStates: { ...state.loadingStates, [key]: value },
      })),
      clearLoadingState: (key) => set((state) => {
        const newLoadingStates = { ...state.loadingStates };
        delete newLoadingStates[key];
        return { loadingStates: newLoadingStates };
      }),
      
      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'arohan-app-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist certain fields
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        language: state.language,
        user: state.user,
      }),
    }
  )
);

// Selector hooks for better performance
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);
export const useTheme = () => useAppStore((state) => state.theme);
export const useLanguage = () => useAppStore((state) => state.language);
export const useUser = () => useAppStore((state) => state.user);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useGlobalLoading = () => useAppStore((state) => state.globalLoading);
export const useLoadingStates = () => useAppStore((state) => state.loadingStates);

// Action hooks
export const useAppActions = () => useAppStore((state) => ({
  setSidebarCollapsed: state.setSidebarCollapsed,
  setTheme: state.setTheme,
  setLanguage: state.setLanguage,
  setUser: state.setUser,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
  setGlobalLoading: state.setGlobalLoading,
  setLoadingState: state.setLoadingState,
  clearLoadingState: state.clearLoadingState,
  reset: state.reset,
}));
