import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemePreference, Toast } from '../types';
import { THEME_KEY } from '../config/constants';

interface UIState {
  theme: ThemePreference;
  sidebarOpen: boolean;
  toasts: Toast[];

  setTheme: (theme: ThemePreference) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: true,
      toasts: [],

      setTheme: (theme) => {
        localStorage.setItem(THEME_KEY, theme);
        set({ theme });
      },

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, toast.duration || 4000);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'fd-ui-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
