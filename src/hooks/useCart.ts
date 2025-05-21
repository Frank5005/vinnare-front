import React, { useState, useEffect } from "react";
import { getCart, removeFromCart, useCoupon } from "../services/shopperService";
import { Item } from "../types/Item";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsIds, setProductsIds] = useState<number[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null
  );
  const [discount, setDiscount] = useState(0);
  const [initialTotal, setInitialTotal] = useState(() => {
    const stored = localStorage.getItem("cartTotalItems");
    return stored ? Number(stored) : 0;
  });

  //setInitialTotal(Number(stored));

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discountedTotal = subtotal - (subtotal * discount) / 100;

  useEffect(() => {
    fetchCart();
    const savedCode = localStorage.getItem("appliedCouponCode");
    const savedDiscount = localStorage.getItem("appliedDiscount");

    if (savedCode && savedDiscount) {
      setAppliedCouponCode(savedCode);
      setCouponCode(savedCode);
      setDiscount(Number(savedDiscount));
    }

    console.log(savedCode);
    console.log(savedDiscount);
    console.log(discountedTotal);
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

  const handleApplyCoupon = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key == "Enter") {
      try {
        const coupon = await useCoupon(couponCode);
        setDiscount(coupon.discountPercentage);
        setAppliedCouponCode(couponCode);
        localStorage.setItem("appliedCouponCode", couponCode);
        localStorage.setItem(
          "appliedDiscount",
          coupon.discountPercentage.toString()
        );
        console.log(coupon);
        console.log(discount);
      } catch (err) {
        setDiscount(0);
        setError(err instanceof Error ? err.message : "Invalid coupon code");
      }
    }
  };

  const totalItems = Array.isArray(cartItems) ? cartItems.length : 0;
  useEffect(() => {
    localStorage.setItem("cartTotalItems", String(totalItems));
  }, [totalItems]);
  return {
    initialTotal,
    totalItems,
    cartItems,
    loading,
    error,
    subtotal,
    discountedTotal,
    couponCode,
    discount,
    appliedCouponCode,
    ToggleCart,
    handleApplyCoupon,
    setCouponCode,
  };
};
