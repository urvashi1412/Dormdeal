import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { loadDemoWishlistIfNeeded } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dd_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/api/users/me')
        .then(r => {
          setUser(r.data);
          loadDemoWishlistIfNeeded(r.data.email);
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('dd_token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    loadDemoWishlistIfNeeded(data.user.email);
  };

  const register = async (name, email, password, college) => {
    const { data } = await api.post('/api/auth/register', { name, email, password, college });
    localStorage.setItem('dd_token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    loadDemoWishlistIfNeeded(data.user.email);
  };

  const logout = () => {
    localStorage.removeItem('dd_token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);