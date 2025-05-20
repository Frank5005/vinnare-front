import { EmployeeData } from "../types/EmployeeData";
import api from "./api";

export async function getUsers() {
  const response = await api.get("/api/user/list");
  return response.data;
}

export async function createEmployee(data: EmployeeData) {
  const response = await api.post("/api/admin/auth", data);
  return response.data;
}

export async function getJobs() {
  const response = await api.get("/api/jobs");
  return response.data;
}

export async function reviewJob(id: number, type: string,action: string) {
  const response = await api.post(`api/jobs/review-job`, {
    id,
    type,
    action,
  });
  return response.data;
}
