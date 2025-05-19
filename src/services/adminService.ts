import { EmployeeData } from "../types/EmployeeData";
import api from "./api";

export async function getUsers(){
    const response = await api.get("/api/user/list");
    return response.data;
}

export async function createEmployee(data: EmployeeData){
    const response = await api.post("/api/admin/auth", data);
    return response.data;
}

