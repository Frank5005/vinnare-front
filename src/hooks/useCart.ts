import { useState, useEffect } from "react";
import { getCart, removeFromCart } from "../services/shopperService";
import { Item } from "../types/Item";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsIds, setProductsIds] = useState<number[]>([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const prods = await getCart();
      const ids = prods.map((p: any) => p.id);
      setCartItems(prods);
      setProductsIds(ids);
      console.log(prods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inCart = (productId: number) => {
    return productsIds.includes(productId);
  };

  const ToggleCart = async (productId: number) => {
    if (!productId) return;

    if (inCart(productId)) {
      const remove = await removeFromCart(productId);
      setProductsIds((p) => p.filter((id) => id !== productId));
      fetchCart();
      console.log(remove);
      //toast("Product removed from wishlist!");
    } else {
      console.log("It cannot be removed from the cart");
      //toast("Product added to wishlist!");
    }
  };

  //const totalItems = Array.isArray(cartItems) ? cartItems.length : 0;
  return { cartItems, loading, error, productsIds, ToggleCart };
};
