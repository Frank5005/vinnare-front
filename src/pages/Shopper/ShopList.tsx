import Header from "../../components/organisms/Header";
import Footer from "../../components/organisms/Footer";
import ProductComponent from "../../components/organisms/ProductComponent";
import FilterDropdown from "../../components/molecules/FilterDropdown";
import ShopProducts from "../../hooks/useShopList";
import React from 'react';

const ShopList = () => {

  const {
    categories,
    sortOption,
    sortedFilteredProducts,
    isLoading,
    hasMore,
    wishlistIds,
    selectedCategories,
    setSortOption,
    handleCategoryChange,
    ToggleWishlist
  } = ShopProducts();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Shop list</h2>
        <div className="flex flex-col lg:flex-row gap-8">

          <aside className="lg:w-1/4">
            <h3 className="font-semibold mb-2">Filters</h3>
            <p className="text-sm text-gray-500 mb-1">Categories</p>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => handleCategoryChange(cat.name)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </aside>

          <section className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <FilterDropdown value={sortOption} onChange={setSortOption} />
              <p className="text-sm text-gray-600">Showing {sortedFilteredProducts.length} Products</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ease-in-out min-h-[600px]">
              {sortedFilteredProducts.map((product) => (
                <ProductComponent name={product.title} imageUrl={product.image} key={product.id} {...product} inWishlistStart={wishlistIds.includes(product.id)} onToggleWishlist={ToggleWishlist} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {isLoading && hasMore && (
        <div className="flex justify-center py-6">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}

      {!hasMore && (
        <div className="text-center py-6">
          <span className="text-gray-500 text-sm">You have seen all products.</span>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ShopList;

//inWishlistStart={wishlistIds.includes(product.id)}