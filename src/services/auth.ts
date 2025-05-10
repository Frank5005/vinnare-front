import api from './api';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export interface SignUpData {
  name: string;
  email: string;
  username: string;
  password: string;
  address: string;
  securityAnswer: string;
  securityQuestion: string;
}

export async function signup(data: SignUpData) {
  const response = await api.post('/api/auth', data);
  return response.data;
}

export async function login({ email, username, password, remember }: { email: string, username: string, password: string, remember?: boolean }) {
  const response = await api.post('/api/login', { email, password });
  const { token } = response.data;
  if (remember) {
    Cookies.set('token', token, { expires: 1 });
    Cookies.set('username', username, { expires: 1 });
  }
  return response.data;
}

export function getRoleFromToken(token: string): string | null {
  try {
    const decoded: any = jwtDecode(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch {
    return null;
  }
}