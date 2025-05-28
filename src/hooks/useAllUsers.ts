import { useState, useEffect } from "react";
import { User } from "../types/User";
import { getUsers } from "../services/adminService";

export const useAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const use = await getUsers();
        setUsers(use);
      } catch (err: any) {
        setError("Error fetching users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return { users, loading, error };
};
