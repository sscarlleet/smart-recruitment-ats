import { createContext, useContext, useState } from 'react';
import { DEMO_USERS } from '../data/sampleData';

// AuthContext shares login state across the whole app.
const AuthContext = createContext(null);

// AuthProvider wraps the app and stores the logged-in user.
export function AuthProvider({ children }) {

  // Load saved user from localStorage (stays after refresh)
  function loadUser() {
    try {
      const saved = localStorage.getItem('ats_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  const [user, setUser] = useState(loadUser);

  // Login: check credentials against demo users
  function login(email, password) {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return { success: false, message: 'Invalid email or password.' };
    const safeUser = { id: found.id, name: found.name, email: found.email, role: found.role };
    localStorage.setItem('ats_user', JSON.stringify(safeUser));
    setUser(safeUser);
    return { success: true };
  }

  // Logout: clear stored user
  function logout() {
    localStorage.removeItem('ats_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook so components can read auth state
export function useAuth() {
  return useContext(AuthContext);
}

