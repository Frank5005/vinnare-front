import { useState, useEffect } from "react";
import api from "../services/api";

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  approved: boolean;
}

export const useAllCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/category");
        setCategories(response.data);
      } catch (err: any) {
        setError("Error fetching categories: " + (err?.message || JSON.stringify(err)));
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
};