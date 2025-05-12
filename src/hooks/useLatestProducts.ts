import { useState, useEffect } from "react";
import api from "../services/api";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rate: number;
}

export const useLatestProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Product[]>("/api/product/latest")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error("Invalid response format:", res.data);
          setError("Data format is invalid");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Error loading products");
      })
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
};
