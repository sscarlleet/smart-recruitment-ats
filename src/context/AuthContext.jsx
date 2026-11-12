import { createContext, useContext, useState } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  function loadUser() {
    try {
      const saved = localStorage.getItem('ats_user');
      const token = localStorage.getItem('ats_token');
      return saved && token ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  const [user, setUser] = useState(loadUser);

  async function login(email, password) {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('ats_token', data.token);

      const safeUser = {
        ...data.user,
        role: data.user.role.toLowerCase(),
      };

      localStorage.setItem('ats_user', JSON.stringify(safeUser));
      setUser(safeUser);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function register(name, email, password) {
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  function logout() {
    localStorage.removeItem('ats_user');
    localStorage.removeItem('ats_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

