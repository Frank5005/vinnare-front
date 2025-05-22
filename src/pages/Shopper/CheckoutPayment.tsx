import Header from "../../components/organisms/Header";
import React from 'react';
import Footer from "../../components/organisms/Footer";
import CartItem from "../../components/molecules/CartItem";
import { useCart } from "../../hooks/useCart";
import ShippingSelect from "../../features/shopper/ShippingSelect";
import CartSummary from "../../components/molecules/CartSummary";
import PaymentDetails from "../../features/shopper/PaymentDetails";

const CheckoutPayment = () => {
  const { cartItems, subtotal, discountedTotal, couponCode, discount, appliedCouponCode, data, ToggleCart, handleApplyCoupon, setCouponCode } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Título + progreso */}
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <div className="flex space-x-4 mb-10 text-sm font-medium">
          <span className="text-gray-400">Address</span>
          <span className="text-gray-400">─────</span>
          <span className="text-gray-400">Shipping</span>
          <span className="text-gray-400">─────</span>
          <span className="text-black">Payment</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Selección de envío */}
          <div className="lg:w-2/3 w-full">
            <PaymentDetails />
          </div>

          {/* Right - Items + Resumen */}
          <div className="lg:w-2/3 w-full space-y-6">
            <div className=" p-4">
              <h2 className="text-lg font-semibold mb-4">Your cart</h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    quantity={item.quantity}
                    price={item.price}
                    image={item.image}
                    onToggleCart={ToggleCart}
                  />
                ))}
              </div>
            </div>

            {data && (
              <CartSummary
              subtotal={subtotal}
              discountedTotal={discountedTotal}
              couponCode={couponCode}
              discount={discount}
              appliedCouponCode={appliedCouponCode}
              handleApplyCoupon={handleApplyCoupon}
              setCouponCode={setCouponCode}
              readOnly={true}
              preview={data}
            />
            )}
          </div>
        </div>
      </main>
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default CheckoutPayment;
