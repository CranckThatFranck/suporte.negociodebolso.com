import apiClient from '@/lib/axios/client';
import type { LoginRequest, LoginResponse } from '@/types';

const AUTH_API_BASE = '/api/v1/auth';

export const loginTeam = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<any>(
    `${AUTH_API_BASE}/login-equipe`,
    payload
  );

  // Map API response to frontend LoginResponse interface
  return {
    token: data.token,
    authSource: data.authSource || 'TEAM',
    user: {
      id: data.user?.id || '',
      name: data.user?.nomeCompleto || data.user?.nickname || '',
      role: data.user?.role || 'SUPPORT',
    },
    tenantId: data.tenant_id || data.company?.idEmpresa || '',
  };
};

export const refreshToken = async (token: string): Promise<LoginResponse> => {
  const { data } = await apiClient.post<any>(
    `${AUTH_API_BASE}/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    token: data.token,
    authSource: data.authSource || 'TEAM',
    user: {
      id: data.user?.id || '',
      name: data.user?.nomeCompleto || data.user?.nickname || '',
      role: data.user?.role || 'SUPPORT',
    },
    tenantId: data.tenant_id || data.company?.idEmpresa || '',
  };
};

export const validateToken = async (): Promise<boolean> => {
  try {
    await apiClient.get(`${AUTH_API_BASE}/validate`);
    return true;
  } catch {
    return false;
  }
};