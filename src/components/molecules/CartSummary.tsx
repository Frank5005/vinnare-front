//import { Item } from "../../types/Item";
import { useNavigate } from "react-router-dom";

interface CartSummaryProps {
  subtotal: number;
  discountedTotal: number;
  couponCode: string;
  discount: number;
  handleApplyCoupon: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  //OnToggleCoupon: (code: string) => void;
  setCouponCode: (code: string) => void;
}

const CartSummary = ({ subtotal, discountedTotal, couponCode, discount, handleApplyCoupon, setCouponCode }: CartSummaryProps) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/checkout-address`);
  };

  return (
    <div className="w-full px-4">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

      <input
        type="text"
        placeholder="Enter coupon code here"
        className="w-full border border-gray-300 px-4 py-2 text-sm mb-6"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        onKeyDown={handleApplyCoupon}
      />

      <div className="text-sm space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount ({discount}%)</span>
            <span>- ${((subtotal * discount) / 100).toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-500">
          <span>Shipping calculated at the next step</span>
        </div>

        <hr className="my-2 border-gray-300" />

        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>${discountedTotal.toFixed(2)}</span>
        </div>
      </div>

      <button onClick={handleClick} className="mt-6 w-full bg-black text-white py-3 rounded-none text-sm font-medium hover:bg-gray-900 transition">
        Continue to checkout
      </button>
    </div>
  );
}

export default CartSummary;