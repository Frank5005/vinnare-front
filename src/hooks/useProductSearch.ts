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

export const useProductSearch = (searchTerm: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(`/api/product/search/${searchTerm}`);
        const transformedProducts = response.data.map((product: Product) => ({
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

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return { products, loading, error };
}; 