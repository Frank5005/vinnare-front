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
  return response.data.map((job: any) => ({
    id: job.id,
    associatedId: job.associatedId,
    type: job.type,
    name:
      job.type === "Product"
        ? job.productName || "Unknown Product"
        : job.categoryName || "Unknown Category",
    creatorName: job.creatorName,
    date: job.date,
    operation: job.operation,
  }));
}

export async function reviewJob(
  id: number,
  type: string,
  action: "Approve" | "Reject"
) {
  const response = await api.post(`/review-job`, {
    id,
    type,
    action,
  });
  return response.data;
}
