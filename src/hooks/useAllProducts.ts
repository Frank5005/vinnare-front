import { useState, useEffect } from "react";
import api from "../services/api";

export interface Product {
  id: number;
  ownerId: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  approved: boolean;
  quantity: number;
  available: number;
  date: string;
}

export const useAllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/product/all");
        setProducts(response.data);
      } catch (err: any) {
        setError("Error fetching products: " + (err?.message || JSON.stringify(err)));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, loading, error };
};