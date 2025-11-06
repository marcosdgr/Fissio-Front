import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      isLoggedIn: false,
      user: null,

      // Acciones
      login: (userData) => {
        set({
          isLoggedIn: true,
          user: userData
        });
      },

      logout: () => {
        set({
          isLoggedIn: false,
          user: null
        });
      },

      // Verificar si está logueado
      checkAuth: () => {
        return get().isLoggedIn;
      }
    }),
    {
      name: 'auth-storage', // nombre para localStorage
      getStorage: () => localStorage, // usar localStorage para persistencia
    }
  )
);