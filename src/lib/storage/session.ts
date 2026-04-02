const TOKEN_KEY = 'token';
const TENANT_ID_KEY = 'tenantId';
const USER_ROLE_KEY = 'userRole';
const AUTH_SOURCE_KEY = 'authSource';
const USER_NAME_KEY = 'userName';

const read = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(key);
};

const write = (key: string, value: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, value);
};

const remove = (key: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(key);
};

export const getToken = () => read(TOKEN_KEY);
export const setToken = (value: string) => write(TOKEN_KEY, value);
export const getTenantId = () => read(TENANT_ID_KEY);
export const setTenantId = (value: string) => write(TENANT_ID_KEY, value);
export const getUserRole = () => read(USER_ROLE_KEY);
export const setUserRole = (value: string) => write(USER_ROLE_KEY, value);
export const getAuthSource = () => read(AUTH_SOURCE_KEY);
export const setAuthSource = (value: string) => write(AUTH_SOURCE_KEY, value);
export const getUserName = () => read(USER_NAME_KEY);
export const setUserName = (value: string) => write(USER_NAME_KEY, value);

export const clearSession = () => {
  remove(TOKEN_KEY);
  remove(TENANT_ID_KEY);
  remove(USER_ROLE_KEY);
  remove(AUTH_SOURCE_KEY);
  remove(USER_NAME_KEY);
};

export const hasSession = () => Boolean(getToken());