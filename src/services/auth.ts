import api from './api';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export async function login({ username, password, remember }: { username: string, password: string, remember?: boolean }) {
  const response = await api.post('/api/login', { username, password });
  const { token } = response.data;
  if (remember) {
    Cookies.set('token', token, { expires: 1 });
    Cookies.set('username', username, { expires: 1 });
  }
  return token;
}

export function getRoleFromToken(token: string): string | null {
  try {
    const decoded: any = jwtDecode(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch {
    return null;
  }
}