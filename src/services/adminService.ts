import api from "./api";

export async function getUsers(){
    const response = await api.get("/api/user/list");
    return response.data;
}

