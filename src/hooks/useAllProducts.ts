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
  //const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- Simulación de producto de prueba ---
    setProducts([
      {
        id: 1,
        ownerId: "f6d906b3-145c-4a23-b490-1b22fdb384f5",
        title: "GYM Book",
        price: 102.00,
        category: "Gym",
        description: "The best seller in the fitness community, the GYM Book is your ultimate companion for tracking workouts, setting goals, and staying motivated. With structured pages for logging exercises, progress charts, and space for daily notes, it helps you stay consistent and accountable. Designed with a durable hardcover and minimalist layout, it's perfect for gym-goers of all levels — from beginners to athletes.",
        image: "https://i.imgur.com/sXkQbvP.png",
        approved: true,
        quantity: 10,
        available: 5,
        date: "2025-05-09T04:09:42.896921Z"
      }
    ]);
    // --- Llamado real al endpoint (descomentar para producción) ---
    // setLoading(true);
    // const fetchProducts = async () => {
    //   try {
    //     const response = await api.get("/api/product/all");
    //     setProducts(response.data);
    //   } catch (err: any) {
    //     setError("Error fetching products: " + (err?.message || JSON.stringify(err)));
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchProducts();
  }, []);

  return { products, loading, error };
};