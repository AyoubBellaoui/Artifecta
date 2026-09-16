import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import { fetchMyProfile, signIn, signOut, signUp } from '../services/data';

const AuthContext = createContext(null);

export class InactiveAccountError extends Error {
  constructor() {
    super('account_disabled');
    this.code = 'account_disabled';
  }
}

export class MissingProfileError extends Error {
  constructor() {
    super('profile_missing');
    this.code = 'profile_missing';
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const loadedUserId = useRef(null);

  const applySession = useCallback(async (session) => {
    if (!session?.user) {
      loadedUserId.current = null;
      setUser(null);
      return null;
    }

    const profile = await fetchMyProfile();
    if (!profile) {
      await signOut();
      loadedUserId.current = null;
      setUser(null);
      throw new MissingProfileError();
    }
    if (!profile.is_active) {
      await signOut();
      loadedUserId.current = null;
      setUser(null);
      throw new InactiveAccountError();
    }

    const account = { ...profile, email: session.user.email };
    loadedUserId.current = account.id;
    setUser(account);
    return account;
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      if (event === 'SIGNED_OUT') {
        loadedUserId.current = null;
        setUser(null);
        setLoading(false);
        return;
      }

      // Token refreshes and tab focus re-emit events for the account we already loaded.
      if (event !== 'USER_UPDATED' && session?.user?.id && session.user.id === loadedUserId.current) {
        setLoading(false);
        return;
      }

      // Supabase asks that its client is not awaited inside this callback.
      setTimeout(() => {
        applySession(session)
          .catch(() => {})
          .finally(() => {
            if (active) setLoading(false);
          });
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const login = useCallback(
    async (email, password) => {
      const { session } = await signIn(email, password);
      return applySession(session);
    },
    [applySession],
  );

  const register = useCallback(
    async (payload) => {
      const { session } = await signUp(payload);
      // No session means the project requires an e-mail confirmation first.
      if (!session) return null;
      return applySession(session);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    await signOut();
    loadedUserId.current = null;
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;
    return applySession(data.session).catch(() => null);
  }, [applySession]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
      isAuthenticated: Boolean(user),
      isConfigured: isSupabaseConfigured,
    }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
