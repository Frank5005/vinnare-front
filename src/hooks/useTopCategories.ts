import { useState, useEffect } from 'react';
import api from '../services/api';

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
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/category/top');
        const data = response.data;
        
        const transformedCategories = data.map((category: Category) => ({
          ...category,
          imageUrl: category.imageUrl + '.png'
        }));

        setCategories(transformedCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}; 