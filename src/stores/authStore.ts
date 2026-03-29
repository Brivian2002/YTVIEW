import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updatePlan: (plan: User['plan']) => void;
  incrementSearch: () => boolean;
  canSearch: () => boolean;
}

const FREE_DAILY_SEARCHES = 5;
const PRO_DAILY_SEARCHES = 50;
const PREMIUM_DAILY_SEARCHES = 200;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      setLoading: (loading) => set({ isLoading: loading }),

      updatePlan: (plan) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, plan } });
        }
      },

      canSearch: () => {
        const { user } = get();
        if (!user) return false;

        const now = new Date();
        const lastReset = new Date(user.lastSearchReset);
        const isNewDay = now.getDate() !== lastReset.getDate() || 
                        now.getMonth() !== lastReset.getMonth() || 
                        now.getFullYear() !== lastReset.getFullYear();

        if (isNewDay) {
          set({
            user: {
              ...user,
              dailySearches: 0,
              lastSearchReset: now,
            },
          });
          return true;
        }

        const limit = user.plan === 'premium' ? PREMIUM_DAILY_SEARCHES :
                     user.plan === 'pro' ? PRO_DAILY_SEARCHES : FREE_DAILY_SEARCHES;

        return user.dailySearches < limit;
      },

      incrementSearch: () => {
        const { user, canSearch } = get();
        if (!user || !canSearch()) return false;

        set({
          user: {
            ...user,
            dailySearches: user.dailySearches + 1,
          },
        });
        return true;
      },
    }),
    {
      name: 'ytubeview-auth',
    }
  )
);
