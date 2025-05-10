import { useState, useEffect } from 'react';
import api from '../services/api';

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
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/product/latest');
        const data = response.data;

        // Transform the image URLs to direct image links
        const transformedProducts = data.map((product: Product) => ({
          ...product,
          image: product.image + '.png'
        }));

        setProducts(transformedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}; 