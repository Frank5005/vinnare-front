import { useState, useEffect } from "react";
import { getCart } from "../services/shopperService";
import { Item } from "../types/Item";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const prods = await getCart();
      setCartItems(prods);
      console.log(prods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  //const totalItems = Array.isArray(cartItems) ? cartItems.length : 0;
  return { cartItems, loading, error, refetch: fetchCart };
};
