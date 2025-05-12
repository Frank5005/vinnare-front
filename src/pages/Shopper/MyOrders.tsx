import React, { useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import OrderDetailModal from "./OrderDetail";
import OrderDateFilter from "../../components/ui/OrderDateFilter";
import { usePurchases } from "../../hooks/usePurchases"; // Usa el hook real

const MyOrders = () => {
  const { purchases, loading, error } = usePurchases();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filter, setFilter] = useState("7");

  const filteredPurchases = purchases.filter((purchase) => {
    if (filter === "all") return true;
    const days = parseInt(filter, 10);
    const orderDate = new Date(purchase.date);
    const now = new Date();
    const diffTime = now.getTime() - orderDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= days;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-inter text-4xl font-bold">My Orders</h1>
          <OrderDateFilter value={filter} onChange={setFilter} />
        </div>
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">ORDER NO.</th>
                  <th className="px-4 py-3">CUSTOMER NAME</th>
                  <th className="px-4 py-3">PAYMENT STATUS</th>
                  <th className="px-4 py-3">AMOUNT</th>
                  <th className="px-4 py-3">ADDRESS</th>
                  <th className="px-4 py-3">ORDER DATE</th>
                  <th className="px-4 py-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedOrder(purchase)}
                  >
                    <td className="px-4 py-3">{purchase.id}</td>
                    <td className="px-4 py-3">{purchase.userName}</td>
                    <td className="px-4 py-3 capitalize">{purchase.paymentStatus}</td>
                    <td className="px-4 py-3">${purchase.totalPrice.toFixed(2)}</td>
                    <td className="px-4 py-3">{purchase.address}</td>
                    <td className="px-4 py-3">{new Date(purchase.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 capitalize">{purchase.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Modal de detalle */}
        {selectedOrder && (
          <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;