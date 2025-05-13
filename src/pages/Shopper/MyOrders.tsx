import React, { useState } from "react";
import Footer from "../../components/organisms/Footer";
import Header from "../../components/organisms/Header";
import OrderDetailModal from "./OrderDetail";
import OrderDateFilter from "../../components/molecules/OrderDateFilter";
import { usePurchases } from "../../hooks/usePurchases"; 
import { DataTable, DataTableColumn } from "../../components/organisms/DataTable";


const MyOrders = () => {
  const { purchases, loading, error } = usePurchases();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filter, setFilter] = useState("7");

  // Usa mockPurchases para pruebas visuales
  const filteredPurchases = purchases.filter((purchase) => {
    if (filter === "all") return true;
    const days = parseInt(filter, 10);
    const orderDate = new Date(purchase.date);
    const now = new Date();
    const diffTime = now.getTime() - orderDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= days;
  });

  const columns: DataTableColumn<any>[] = [
    { key: "id", label: "ORDER NO." },
    { key: "userName", label: "CUSTOMER NAME" },
    { key: "paymentStatus", label: "PAYMENT STATUS", render: row => row.paymentStatus.charAt(0).toUpperCase() + row.paymentStatus.slice(1) },
    { key: "totalPrice", label: "AMOUNT", render: row => `$${row.totalPrice.toFixed(2)}` },
    { key: "address", label: "ADDRESS" },
    { key: "date", label: "ORDER DATE", render: row => new Date(row.date).toLocaleDateString() },
    { key: "status", label: "STATUS", render: row => row.status.charAt(0).toUpperCase() + row.status.slice(1) },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="flex-1 max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
          <h1 className="font-inter text-4xl font-bold">My Orders</h1>
          <OrderDateFilter value={filter} onChange={setFilter} />
        </div>
        <DataTable
          columns={columns}
          data={filteredPurchases}
          loading={loading}
          error={error}
          onRowClick={setSelectedOrder}
        />

        {selectedOrder && (
          <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;