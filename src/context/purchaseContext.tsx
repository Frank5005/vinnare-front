import React, { createContext, useState, useContext, ReactNode } from "react";
import { Preview } from "../types/Preview";
import { PurchaseContextType } from "../types/PurchaseContextType";

const purchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Preview | null>(null);
  return (
    <purchaseContext.Provider value={{ data, setData }}>
      {children}
    </purchaseContext.Provider>
  );
};

export const usePurchase = () => {
  const context = useContext(purchaseContext);
  if (!context) throw new Error("usePurchase must be used within a PurchaseProvider");
  return context;
};