import React, { useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { usePurchases } from "../../hooks/usePurchases";

const OrderDetailModal = ({ order, onClose }: { order: any; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <h2 className="text-2xl font-bold mb-4">Order Detail</h2>
      <div className="space-y-2">
        <div><strong>Order No.:</strong> {order.id}</div>
        <div><strong>Customer Name:</strong> {order.userName}</div>
        <div><strong>Payment Status:</strong> {order.paymentStatus}</div>
        <div><strong>Amount:</strong> ${order.totalPrice.toFixed(2)}</div>
        <div><strong>Address:</strong> {order.address}</div>
        <div><strong>Order Date:</strong> {new Date(order.date).toLocaleString()}</div>
        <div><strong>Status:</strong> {order.status}</div>
      </div>
    </div>
  </div>
);

const MyOrders = () => {
  const { purchases, loading, error } = usePurchases();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto py-12 px-4">
        <h1 className="font-inter text-4xl font-bold mb-8">My Orders</h1>
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
                {purchases.map((purchase) => (
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