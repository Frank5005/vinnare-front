const OrderDetail = ({ order, onClose }: { order: any; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-50 backdrop-blur-sl">
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

export default OrderDetail;