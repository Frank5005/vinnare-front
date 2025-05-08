import Header from "../components/Header";
import Footer from "../components/Footer";
import ImageSlider from "../components/ui/ImageSlider";
import SectionHeader from "../components/ui/SectionHeader";
import CategoryGrid from "../layouts/CategoryGrid";
import StaggeredImageGrid from "../components/StaggeredImageGrid";
import ProductGrid from "../layouts/ProductGrid";

const sliderImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
];

const categories = [
  { image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", name: "Food" },
  { image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", name: "Itar" },
  { image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", name: "Tasbeeh" },
];

const arrivalsImages = [
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
];

const products = [
  { image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", name: "Jae Namaz", price: 99 },
  { image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", name: "Dates", price: 99 },
  { image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", name: "Miswak", price: 99 },
];

const LandingPage = () => {
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
          title="Categories"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          buttonText="Shop All"
          onButtonClick={() => {}}
        />
        <CategoryGrid categories={categories} />

        {/* Latest Arrivals Section */}
        <SectionHeader
          title="Our latest arrivals"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          buttonText="Shop All"
          onButtonClick={() => {}}
        />
        <StaggeredImageGrid images={arrivalsImages} />

        {/* Products Section */}
        <SectionHeader
          title="Our Products"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          buttonText="Shop All"
          onButtonClick={() => {}}
        />
        <ProductGrid products={products} />
      </main>
      <div className="mb-16" />
      <Footer />
    </div>
  );
};

export default LandingPage;
