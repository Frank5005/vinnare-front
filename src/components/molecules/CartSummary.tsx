type CartItem = {
  price: number;
  quantity: number;
};

interface CartSummaryProps {
  items: CartItem[];
}

const CartSummary = ({ items }: CartSummaryProps) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="w-full px-4">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

      <input
        type="text"
        placeholder="Enter coupon code here"
        className="w-full border border-gray-300 px-4 py-2 text-sm mb-6"
      />

      <div className="text-sm space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>Shipping calculated at the next step</span>
        </div>

        <hr className="my-2 border-gray-300" />

        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>${subtotal}</span>
        </div>
      </div>

      <button className="mt-6 w-full bg-black text-white py-3 rounded-none text-sm font-medium hover:bg-gray-900 transition">
        Continue to checkout
      </button>
    </div>
  );
}

export default CartSummary;