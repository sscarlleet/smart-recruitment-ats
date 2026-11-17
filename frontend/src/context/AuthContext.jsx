import { createContext, useContext, useState } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  function loadUser() {
    try {
      const savedUser = JSON.parse(localStorage.getItem('ats_user'));

      if (!savedUser) return null;

      const normalizedUser = {
        ...savedUser,
        role: savedUser.role?.trim().toLowerCase()
      };

      localStorage.setItem('ats_user', JSON.stringify(normalizedUser));

      return normalizedUser;
    } catch {
      return null;
    }
  }

  const [user, setUser] = useState(loadUser);

  async function login(email, password) {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const safeUser = {
        ...data.user,
        role: data.user.role?.trim().toLowerCase()
      };

      localStorage.setItem('ats_token', data.token);
      localStorage.setItem('ats_user', JSON.stringify(safeUser));

      setUser(safeUser);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function register(form) {
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  function logout() {
    localStorage.removeItem('ats_token');
    localStorage.removeItem('ats_user');
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