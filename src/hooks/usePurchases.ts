import { useState, useEffect } from "react";
import api from "../services/api";

export interface Purchase {
  id: number;
  products: number[];
  prices: number[];
  quantities: number[];
  userId: string;
  userName: string;
  couponCode: string | null;
  totalPrice: number;
  totalPriceBeforeDiscount: number;
  date: string;
  address: string;
  paymentStatus: string;
  status: string;
}

export const usePurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await api.get("/api/purchases");
        const userName = localStorage.getItem("userName") || "";
        const purchasesWithUserName = response.data.map((purchase: Purchase) => ({
          ...purchase,
          userName: purchase.userName || userName,
        }));
        setPurchases(purchasesWithUserName);
      } catch (err: any) {
        setError("Error fetching purchases: " + (err?.message || JSON.stringify(err)));
        console.error("Error fetching purchases:", err);
      }finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return { purchases, loading, error };
};