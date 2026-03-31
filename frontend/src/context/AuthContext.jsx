import { createContext, useContext, useState, useCallback } from 'react';
// import { login as apiLogin, logout as apiLogout } from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

function enrichUser(userData) {
  if (!userData) return null;
  const nameParts = (userData.name || '').trim().split(' ');
  return {
    ...userData,
    first_name: userData.first_name ?? nameParts[0] ?? '',
    last_name: userData.last_name ?? nameParts.slice(1).join(' ') ?? '',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return enrichUser(JSON.parse(localStorage.getItem('user'))); }
    catch { return null; }
  });

  const signin = useCallback(async (email, password) => {
    const res = await apiLogin(email, password);
    const { token, user: userData } = res.data;
    const enriched = enrichUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(enriched));
    setUser(enriched);
    return enriched;
  }, []);

  /** Après inscription : met à jour le state comme une connexion réussie. */
  const setSessionFromAuthResponse = useCallback((token, userData) => {
    const enriched = enrichUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(enriched));
    setUser(enriched);
    return enriched;
  }, []);

  const signout = useCallback(async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Déconnexion réussie');
  }, []);

  const isAdmin    = user?.role === 'admin';
  const isRH       = user?.role === 'rh';
  const isTeacher  = user?.role === 'enseignant';
  const canManage  = isAdmin || isRH;

  return (
    <AuthContext.Provider value={{ user, signin, signout, setSessionFromAuthResponse, isAdmin, isRH, isTeacher, canManage }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
