import Footer from "../../components/organisms/Footer";
import Header from "../../components/organisms/Header";
import ProductComponent from "../../components/organisms/ProductComponent";
import ShowWishList from "../../hooks/useWishList";

const Wishlist = () => {

  const { products, isLoading, hasMore, wishlistIds, ToggleWishlist, ShopAll } = ShowWishList();
  //console.log(wishlistIds);

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
          {wishlistIds.length > 0 && (
            <button onClick={() => ShopAll(wishlistIds)} className="bg-black text-white px-6 py-2 rounded mb-10 hover:bg-gray-800">
              Shop All
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductComponent name={product.title} imageUrl={product.image} key={product.id} {...product} inWishlistStart={wishlistIds.includes(product.id)} onToggleWishlist={ToggleWishlist} />
            ))}
          </div>
          {isLoading && hasMore && <p className="mt-4 text-gray-500">Loading more products...</p>}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Wishlist;

//inWishlistStart={wishlistIds.includes(product.id)}
