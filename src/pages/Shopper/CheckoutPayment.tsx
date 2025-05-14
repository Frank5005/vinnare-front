import Footer from "../../components/organisms/Footer";
import Header from "../../components/organisms/Header";

const CheckoutPayment = () => {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {/* Main content */}
      <main className="flex-1">
        {/* Aquí va el contenido de ShopList */}
      </main>
      {/* Footer at the bottom */}
      <Footer />
    </div>
    );
  };
  
  export default CheckoutPayment;
  