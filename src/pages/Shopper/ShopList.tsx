import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductComponent from "../../components/ui/ProductComponent";
import FilterDropdown from "../../components/ui/FilterDropdown";
//import { set } from "react-hook-form";

const allProducts = [
  { id: 1, name: "Natural Honey Bottle", price: 99, category: "Food", date: "2025-05-03", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 2, name: "Itar", price: 89, category: "Itar", date: "2025-05-02", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 3, name: "White Cap", price: 59, category: "Caps", date: "2025-04-30", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 4, name: "Jae Namaz", price: 79, category: "Kafan", date: "2025-04-28", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 5, name: "Dates", price: 49, category: "Food", date: "2025-04-25", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 6, name: "Miswak", price: 39, category: "Itar", date: "2025-04-20", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 7, name: "Natural Honey Bottle", price: 99, category: "Food", date: "2025-05-03", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 8, name: "Itar", price: 89, category: "Itar", date: "2025-05-02", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 9, name: "White Cap", price: 59, category: "Caps", date: "2025-04-30", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 10, name: "Jae Namaz", price: 79, category: "Kafan", date: "2025-04-28", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 11, name: "Dates", price: 49, category: "Food", date: "2025-04-25", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 12, name: "Miswak", price: 39, category: "Itar", date: "2025-04-20", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 13, name: "Miswak", price: 39, category: "Itar", date: "2025-04-20", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 14, name: "Natural Honey Bottle", price: 99, category: "Food", date: "2025-05-03", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 15, name: "Itar", price: 89, category: "Itar", date: "2025-05-02", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 16, name: "White Cap", price: 59, category: "Caps", date: "2025-04-30", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 17, name: "Jae Namaz", price: 79, category: "Kafan", date: "2025-04-28", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 18, name: "Dates", price: 49, category: "Food", date: "2025-04-25", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
  { id: 19, name: "Miswak", price: 39, category: "Itar", date: "2025-04-20", imageUrl: "https://i0.wp.com/lemonshoes.com.co/wp-content/uploads/2023/10/Mesa-de-trabajo-6-6.png?fit=1080%2C1080&ssl=1" },
];

const ShopList = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("az");
  const [isLoading, setIsLoading] = useState(false);
  const hasMore = visibleCount < allProducts.length;

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const sortedFilteredProducts = allProducts
    .filter((product) => selectedCategories.length === 0 || selectedCategories.includes(product.category))
    .sort((a, b) => {
      switch (sortOption) {
        case "az": return a.name.localeCompare(b.name);
        case "za": return b.name.localeCompare(a.name);
        case "priceAsc": return a.price - b.price;
        case "priceDesc": return b.price - a.price;
        default: return 0;
      }
    })
    .slice(0, visibleCount);

  useEffect(() => {
    let isScrolling: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasMore) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 3, allProducts.length));
            setIsLoading(false);
          }, 500);
        }
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Shop list</h2>
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filtros */}
          <aside className="lg:w-1/4">
            <h3 className="font-semibold mb-2">Filters</h3>
            <p className="text-sm text-gray-500 mb-1">Categories</p>
            <div className="space-y-2">
              {['Itar', 'Kafan', 'Caps', 'Food'].map((cat) => (
                <label key={cat} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* Main grid */}
          <section className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <FilterDropdown value={sortOption} onChange={setSortOption} />
              <p className="text-sm text-gray-600">Showing {sortedFilteredProducts.length} Products</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedFilteredProducts.map((product) => (
                <ProductComponent key={product.id} {...product} />
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
