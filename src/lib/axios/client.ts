import axios from 'axios';
import { clearSession, getTenantId, getToken } from '@/lib/storage/session';
import { pushGlobalToast } from '@/lib/toast';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'https://api.negociodebolso.com/api/v1/admin';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  const tenantId = getTenantId();

  config.headers = config.headers ?? {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      clearSession();
      pushGlobalToast({
        title: 'Sessão expirada',
        description:
          'Sua sessão foi encerrada. Faça login novamente para continuar.',
        type: 'warning',
      });

      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  }
);

// Export as default for easier imports
export default apiClient;