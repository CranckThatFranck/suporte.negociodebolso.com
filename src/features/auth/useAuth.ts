import { useMutation } from '@tanstack/react-query';
import { loginTeam } from './authApi';
import { setAuthSource, setTenantId, setToken, setUserName, setUserRole } from '@/lib/storage/session';
import type { LoginRequest } from '@/types';

export const useLoginMutation = () =>
  useMutation({
    mutationFn: loginTeam,
    onSuccess: (response) => {
      setToken(response.token);
      setAuthSource(response.authSource);
      setTenantId(response.tenantId);
      setUserRole(response.user.role);
      setUserName(response.user.name);
    }
  });

export const buildLoginPayload = (form: LoginRequest): LoginRequest => ({
  idEmpresa: form.idEmpresa.trim(),
  nickname: form.nickname.trim(),
  password: form.password
});