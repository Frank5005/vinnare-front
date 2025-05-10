import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ProductComponent from "../../components/ui/ProductComponent";

const wishlistItems = [
  { id: 1, name: "Shoes 1", price: 99, imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 2, name: "Shoes 2", price: 99, imageUrl: "https://sc04.alicdn.com/kf/H2a4665343d4b4e62b8df4aa562abcfafd.jpg" },
  { id: 3, name: "Shoes 3", price: 99, imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-3-11.png?fit=1080%2C1080&ssl=1" },
];

const Wishlist = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-12 px-4 text-center">
          <h1 className="font-inter text-4xl font-bold mb-8">Wish List</h1>
          <p className="text-gray-500 mb-6">
            This are the products that you liked it before, check it out!
          </p>
          <button className="bg-black text-white px-6 py-2 rounded mb-10 hover:bg-gray-800">
            Shop All
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {wishlistItems.map((item) => (
              <ProductComponent
                key={item.id}
                name={item.name}
                price={item.price}
                imageUrl={item.imageUrl}
                //showFavorite={true}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Wishlist;
