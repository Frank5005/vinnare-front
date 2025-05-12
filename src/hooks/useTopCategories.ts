import { useState, useEffect } from "react";
import api from "../services/api";

interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

export const useTopCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Category[]>("/api/category/top")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error("Invalid response format:", res.data);
          setError("Data format is invalid");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Error loading categories");
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
};
