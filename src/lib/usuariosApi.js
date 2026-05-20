import axios from 'axios';

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:4000/api';

const usuariosApi = axios.create({ baseURL: AUTH_URL });

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

export const usuariosService = {
  getUsuarios: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return usuariosApi.get(`/usuarios?${query}`, withAuth())
      .then(r => r.data)
      .catch(handleError);
  },

  // Obtener usuario por id
  getUsuario: async (id) => {
    return usuariosApi.get(`/usuarios/${id}`, withAuth())
      .then(r => r.data)
      .catch(handleError);
  },

  // Registrar usuario (solo admin)
  registrarUsuario: async (data) => {
    return usuariosApi.post('/usuarios/register', data, withAuth())
      .then(r => r.data)
      .catch(handleError);
  },

  // Actualizar usuario
  actualizarUsuario: async (id, data) => {
    return usuariosApi.put(`/usuarios/${id}`, data, withAuth())
      .then(r => r.data)
      .catch(handleError);
  },

  // Eliminar usuario 
  eliminarUsuario: async (id) => {
    return usuariosApi.patch(`/usuarios/${id}`, {}, withAuth())
        .then(r => r.data)
        .catch(handleError);
    }
};