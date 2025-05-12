import Header from "../components/Header";
import Footer from "../components/Footer";
import ImageSlider from "../components/ui/ImageSlider";
import SectionHeader from "../components/ui/SectionHeader";
import CategoryGrid from "../layouts/CategoryGrid";
import StaggeredImageGrid from "../components/StaggeredImageGrid";
import ProductGrid from "../layouts/ProductGrid";
import { useTopCategories } from "../hooks/useTopCategories";
import { useLatestProducts } from "../hooks/useLatestProducts";
import { useTopSellingProducts } from "../hooks/useTopSellingProducts";
import { useNavigate } from "react-router-dom";

const sliderImages = [
  "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1920&q=80"
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { categories, loading, error } = useTopCategories();
  const { products: latestProducts, loading: latestLoading, error: latestError } = useLatestProducts();
  const { products: topProducts, loading: topLoading, error: topError } = useTopSellingProducts();
  //console.log("TOP PRODUCTS STATE:", topProducts);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {/* Main content */}
      <main className="flex-1 w-full mx-auto">
        {/* Hero Slider */}
        <ImageSlider images={sliderImages} className="mb-8" />

        {/* Categories Section */}
        <SectionHeader
          title="Top Categories"
          description="Discover our most popular categories, featuring the best-selling products that our customers love. "
          buttonText="Shop All"
          onButtonClick={() => navigate("/shop-list")}
        />
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : (
          <CategoryGrid
            categories={categories.map(cat => ({
              image: cat.imageUrl,
              name: cat.name
            }))}
          />
        )}

        {/* Latest Arrivals Section */}
        <SectionHeader
          title="Latest Arrivals"
          description="Discover our newest additions to the store, featuring the latest products that have just arrived."
          buttonText="Shop All"
          onButtonClick={() => navigate("/shop-list")}
        />
        {latestLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : latestError ? (
          <div className="text-center text-red-500 p-4">{latestError}</div>
        ) : (
          <StaggeredImageGrid
            images={latestProducts.map(product => product.image)}
          />
        )}

        {/* our products section */}
        <SectionHeader
          title="Our Best Sellers"
          description="Explore our most popular products, loved and trusted by our customers."
          buttonText="Shop All"
          onButtonClick={() => navigate("/shop-list")}
        />
        {topLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : topError ? (
          <div className="text-center text-red-500 p-4">{topError}</div>
        ) : Array.isArray(topProducts) &&(
          <ProductGrid
            products={topProducts.map(product => ({
              image: product.image,
              name: product.title,
              price: product.price,
              description: product.description,
              category: product.category
            }))}
          />
        )}
      </main>
      <div className="mb-16" />
      <Footer />
    </div>
  );
};

export default LandingPage;
