import Cookies from "js-cookie";
import api from "./api";
import { jwtDecode } from "jwt-decode";

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
  const response = await api.post("/api/auth", data);
  return response.data;
}

export async function login({
  email,
  password,
  remember,
}: {
  email: string;
  password: string;
  remember?: boolean;
}) {
  const response = await api.post("/api/login", { email, password });
  const { token, username } = response.data;
  localStorage.setItem("token", token.replace("Bearer ", ""));
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  if (remember) {
    Cookies.set("token", token.replace("Bearer ", ""), { expires: 7 });
    Cookies.set("username", username, { expires: 7 });
    Cookies.set("email", email, { expires: 7 });
  }
  return response.data;
}

export function getRoleFromToken(token: string): string | null {
  try {
    const decoded: any = jwtDecode(token);
    return (
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      null
    );
  } catch {
    return null;
  }
}

export async function verifyEmail(
  email: string,
  securityQuestion: string,
  securityAnswer: string
) {
  const response = await api.post("/api/user/verify", {
    email,
    securityQuestion,
    securityAnswer,
  });
  return response.data;
}

export async function getSecurityQuestions() {
  const response = await api.get("/api/securityquestions");
  const rawQuestions = response.data;

  const formattedQuestions = rawQuestions.map(
    (q: { id: number; name: string }) => ({
      value: q.name,
      label: formatLabel(q.name),
    })
  );

  return formattedQuestions;
}

function formatLabel(text: string) {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export async function resetPassword(Password: string, token: string) {
  const res = await api.put(
    "/api/user",
    {
      password: Password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};
