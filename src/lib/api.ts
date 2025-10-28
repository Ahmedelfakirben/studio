import axios from 'axios';

// En producción usa NEXT_PUBLIC_API_URL, en local usa rewrite de Next (/api -> backend)
// Esto evita CORS y permite cambiar fácilmente entre entornos
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor para manejar tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===========================================
// SERVICIOS DE AUTENTICACIÓN
// ===========================================
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    // Obtener usuario actual tras login
    const me = await api.get('/auth/usuario');
    return { token: response.data.token, user: me.data };
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  verifyToken: async () => {
    return api.get('/auth/usuario');
  },
  // Gestión de usuarios (solo admin)
  getAllUsers: () => api.get('/auth/usuarios'),
  createUser: (data: any) => api.post('/auth/registrar', data),
  updateUser: (id: string, data: any) => api.put(`/auth/usuarios/${id}`, data),
  deleteUser: (id: string) => api.delete(`/auth/usuarios/${id}`),
  resetPassword: (id: string, newPassword: string) => api.put(`/auth/usuarios/${id}/reset-password`, { newPassword }),
};

// ===========================================
// MÓDULO VENTE (VENTAS)
// ===========================================

// Servicios de clientes
export const clientesService = {
  getAll: () => api.get('/clientes'),
  getById: (id: string) => api.get(`/clientes/${id}`),
  create: (data: any) => api.post('/clientes', data),
  update: (id: string, data: any) => api.put(`/clientes/${id}`, data),
  delete: (id: string) => api.delete(`/clientes/${id}`),
};

// Servicios de facturas de venta
export const facturasService = {
  getAll: () => api.get('/facturas'),
  getById: (id: string) => api.get(`/facturas/${id}`),
  create: (data: any) => api.post('/facturas', data),
  update: (id: string, data: any) => api.put(`/facturas/${id}`, data),
  delete: (id: string) => api.delete(`/facturas/${id}`),
};

// Servicios de prefacturas de venta
export const prefacturasService = {
  getAll: () => api.get('/prefacturas'),
  getById: (id: string) => api.get(`/prefacturas/${id}`),
  create: (data: any) => api.post('/prefacturas', data),
  update: (id: string, data: any) => api.put(`/prefacturas/${id}`, data),
  delete: (id: string) => api.delete(`/prefacturas/${id}`),
};

// Servicios de bons de livraison (venta)
export const bonsLivraisonService = {
  getAll: () => api.get('/bons-livraison'),
  getById: (id: string) => api.get(`/bons-livraison/${id}`),
  create: (data: any) => api.post('/bons-livraison', data),
  update: (id: string, data: any) => api.put(`/bons-livraison/${id}`, data),
  delete: (id: string) => api.delete(`/bons-livraison/${id}`),
};

// ===========================================
// MÓDULO ACHAT (COMPRAS)
// ===========================================

// Servicios de proveedores
export const proveedoresService = {
  getAll: () => api.get('/fournisseurs'),
  getById: (id: string) => api.get(`/fournisseurs/${id}`),
  create: (data: any) => api.post('/fournisseurs', data),
  update: (id: string, data: any) => api.put(`/fournisseurs/${id}`, data),
  delete: (id: string) => api.delete(`/fournisseurs/${id}`),
};

// Servicios de facturas de compra ✅ CORREGIDO
export const facturasAchatService = {
  getAll: () => api.get('/achats/facturas'),
  getById: (id: string) => api.get(`/achats/facturas/${id}`),
  create: (data: any) => api.post('/achats/facturas', data),
  update: (id: string, data: any) => api.put(`/achats/facturas/${id}`, data),
  delete: (id: string) => api.delete(`/achats/facturas/${id}`),
};

// Servicios de prefacturas de compra ✅ CORREGIDO
export const prefacturasAchatService = {
  getAll: () => api.get('/achats/prefacturas'),
  getById: (id: string) => api.get(`/achats/prefacturas/${id}`),
  create: (data: any) => api.post('/achats/prefacturas', data),
  update: (id: string, data: any) => api.put(`/achats/prefacturas/${id}`, data),
  delete: (id: string) => api.delete(`/achats/prefacturas/${id}`),
};

// Servicios de bons de réception (compra) ✅ CORREGIDO
export const bonsReceptionService = {
  getAll: () => api.get('/achats/bons-reception'),
  getById: (id: string) => api.get(`/achats/bons-reception/${id}`),
  create: (data: any) => api.post('/achats/bons-reception', data),
  update: (id: string, data: any) => api.put(`/achats/bons-reception/${id}`, data),
  delete: (id: string) => api.delete(`/achats/bons-reception/${id}`),
};

// ===========================================
// MÓDULOS INDEPENDIENTES
// ===========================================

// Servicios de gastos de combustible
export const fraisEssenceService = {
  getAll: () => api.get('/frais-essence'),
  getById: (id: string) => api.get(`/frais-essence/${id}`),
  create: (data: any) => api.post('/frais-essence', data),
  update: (id: string, data: any) => api.put(`/frais-essence/${id}`, data),
  delete: (id: string) => api.delete(`/frais-essence/${id}`),
};

// Servicios de alquiler de material
export const locationMaterielService = {
  getAll: () => api.get('/location-materiel'),
  getById: (id: string) => api.get(`/location-materiel/${id}`),
  create: (data: any) => api.post('/location-materiel', data),
  update: (id: string, data: any) => api.put(`/location-materiel/${id}`, data),
  delete: (id: string) => api.delete(`/location-materiel/${id}`),
};
