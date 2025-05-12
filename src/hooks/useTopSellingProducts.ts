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

export const useTopSellingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/product/top-selling")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProducts(res.data as Product[]);
        } else {
          //setProducts([]);
          console.error("Invalid response format:", res.data);
          setError("Data format is invalid");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Error loading products");
        //setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
};
