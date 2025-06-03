import React, { useState, useEffect, createContext } from "react";
import {
  buyProducts,
  getCart,
  removeFromCart,
  useCoupon,
  viewPreview,
} from "../services/shopperService";
import { Item } from "../types/Item";
//import { Preview } from "../types/Preview";
//import { PurchaseContextType } from "../types/PurchaseContextType";
import { usePurchase } from "../context/purchaseContext";
import { Navigate, useNavigate } from "react-router-dom";

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
  const { data, setData } = usePurchase();
  const navigate = useNavigate();

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

    fetchPreview();

    console.log(savedCode);
  }, []);

  const fetchCart = async () => {
    try {
      const prods = await getCart();
      const ids = prods.map((p: any) => p.id);
      setCartItems(prods);
      setProductsIds(ids);
      console.log(prods);
    } catch (err) {
      if (productsIds.length == 0){
        setError("You don't have products in your cart, go to shopping!");
      }
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
    } else {
      console.log("It cannot be removed from the cart");
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
        fetchPreview();
        console.log(appliedCouponCode);
        console.log(discount);
      } catch (err) {
        setDiscount(0);
        //setAppliedCouponCode("");
        setError(err instanceof Error ? err.message : "Invalid coupon code");
      }
    }
  };

  const fetchPreview = async () => {
    try {

      const body = { coupon_code: appliedCouponCode || undefined };

      /* 
      if(data?.coupon_applied == body.coupon_code){
        return;
      }
      */

      const preview = await viewPreview(body);
      setData(preview);
      console.log(preview);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error while watching the preview shopping"
      );
    } finally {
      setLoading(false);
    }
  };

  const buyingProducts = async () => {
    try {
      const body = { coupon_code: appliedCouponCode || undefined };
      const bought = await buyProducts(body);
      console.log(bought);
      navigate(`/my-orders`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error while buying the products"
      );
    } finally {
      setLoading(false);
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
    data,
    ToggleCart,
    handleApplyCoupon,
    setCouponCode,
    buyingProducts,
    fetchPreview,
    inCart,
  };
};
