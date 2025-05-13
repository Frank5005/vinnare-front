import { useState, useEffect } from 'react';
import api from '../services/api';

interface CartItem {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const response = await api.get('/api/cart');
      setCartItems(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalItems = Array.isArray(cartItems) ? cartItems.length : 0;
  return { cartItems, totalItems, loading, error, refetch: fetchCart };
}; 