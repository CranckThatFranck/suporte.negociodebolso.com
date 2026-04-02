import { afterEach, describe, expect, test } from 'vitest';
import { clearSession, getTenantId, getToken, setTenantId, setToken } from './session';

afterEach(() => {
  clearSession();
});

describe('session storage helpers', () => {
  test('stores and clears auth values', () => {
    setToken('jwt-token');
    setTenantId('tenant-01');

    expect(getToken()).toBe('jwt-token');
    expect(getTenantId()).toBe('tenant-01');

    clearSession();

    expect(getToken()).toBeNull();
    expect(getTenantId()).toBeNull();
  });
});