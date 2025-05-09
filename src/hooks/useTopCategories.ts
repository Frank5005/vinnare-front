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

        // Transform the image URLs to direct image links
        const transformedCategories = data.map((category: Category) => {
          let imageId = category.imageUrl;

          if (imageId.includes('imgur.com/')) {
            const match = imageId.match(/imgur\.com\/(?:a\/)?([\w]+)/);
            if (match && match[1]) {
              imageId = match[1];
            }
          }
          return {
            ...category,
            imageUrl: `https://i.imgur.com/${imageId}.png`
          };
        });

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