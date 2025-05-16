import { useState, useEffect } from "react";
import { User } from "../types/User";
import { getUsers } from "../services/adminService";
//import { DataTableColumn } from "../components/organisms/DataTable";

export const useAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //const [dateFilter, setDateFilter] = useState<string>("7");

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const use = await getUsers();
        setUsers(use);
      } catch (err: any) {
        setError("Error fetching users: " + (err?.message || JSON.stringify(err)));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return { users, loading, error };
};
