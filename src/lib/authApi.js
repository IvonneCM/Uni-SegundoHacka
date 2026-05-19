import axios from 'axios';

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:4000/api';

const authApi = axios.create({ baseURL: AUTH_URL });

const getToken = () => localStorage.getItem('token');

const withAuth = (config = {}) => ({
  ...config,
  headers: {
    'Content-Type': 'application/json',
    'x-token': getToken(),
    ...config.headers,
  },
});

const handleError = (err) => {
  const msg = err?.response?.data?.message || err?.response?.data?.msg || 'Error inesperado';
  throw new Error(msg);
};

export const authService = {
  login: async (email, password) => {
    return authApi.post('/auth/login', { email, password })
      .then(r => r.data)
      .catch(handleError);
  },

  register: async (data) => {
    return authApi.post('/usuarios/register', data, withAuth())
      .then(r => r.data)
      .catch(handleError);
  },

  me: async () => {
    return authApi.get('/auth/renew', withAuth())
      .then(r => r.data)
      .catch(handleError);
  },

  getUsuarios: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return authApi.get(`/usuarios?${query}`, withAuth())
      .then(r => r.data)
      .catch(handleError);
  },

  getUsuario: async (id) => {
    return authApi.get(`/usuarios/${id}`, withAuth())
      .then(r => r.data)
      .catch(handleError);
  },

  actualizarUsuario: async (id, data) => {
    return authApi.put(`/usuarios/${id}`, data, withAuth())
      .then(r => r.data)
      .catch(handleError);
  },

  eliminarUsuario: async (id) => {
    return authApi.delete(`/usuarios/${id}`, withAuth())
      .then(r => r.data)
      .catch(handleError);
  }
};