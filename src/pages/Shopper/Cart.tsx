import CartInfo from "../../components/molecules/CartInfo";
import CartItem from "../../components/molecules/CartItem";
import CartSummary from "../../components/molecules/CartSummary";
import Footer from "../../components/organisms/Footer";
import Header from "../../components/organisms/Header";
//import { useNavigate } from "react-router-dom";


const cartItems = [
  { id: 1, name: "Natural Honey Bottle", quantity: 1, vendor: "Vendor Name", price: 99 },
  { id: 2, name: "Natural Honey Bottle", quantity: 1, vendor: "Vendor Name", price: 89 },
];

const Cart = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="flex-1 px-4 md:px-10 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left section: Cart Items */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-semibold mb-2">Your cart</h2>
            <p className="mb-8">
              Not ready to checkout?{" "}
              <a
                href="/shop-list"
                className="text-black font-medium underline"
              >
                Continue Shopping
              </a>
            </p>

            <div className="space-y-6">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <CartInfo />
          </div>

          {/* Right section: Summary */}
          <CartSummary items={cartItems} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Cart;
