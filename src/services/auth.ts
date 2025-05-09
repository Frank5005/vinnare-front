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

export async function login({ email, password, remember }: { email: string, password: string, remember?: boolean }) {
  const response = await api.post('/api/login', { email, password });
  const { token, username} = response.data;
  if (remember) {
    Cookies.set('token', token, { expires: 1 });
    Cookies.set('email', email, { expires: 1 });
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

export async function verifyEmail(email: string, securityQuestion: string, securityAnswer: string) {
  const response = await api.post('/api/verify', { email, securityQuestion, securityAnswer });
  return response.data;
}

export async function getSecurityQuestions(){
  const response = await api.get("/api/security-questions");
  return response.data;
};

export async function resetPassword(email: string, newPassword: string) {
  const response = await api.put("/api/reset-password", { email, newPassword });
  return response.data;
}


