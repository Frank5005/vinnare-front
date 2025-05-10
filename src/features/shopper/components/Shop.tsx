import { useEffect, useState } from "react";
import { getProducts, getCategories } from "../../../services/shopper";

const Shop = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortOption, setSortOption] = useState("az");
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = visibleCount < products.length;

  useEffect(() => {
    const loadData = async () => {
      const prods = await getProducts();
      const cats = await getCategories();
      setProducts(prods);
      setCategories(cats);
    };
    loadData();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  //console.log(products);
  const sortedFilteredProducts = products
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
            setVisibleCount((prev) => Math.min(prev + 3, products.length));
            setIsLoading(false);
          }, 500);
        }
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, products]);

  return {
    categories,
    sortOption,
    setSortOption,
    selectedCategories,
    handleCategoryChange,
    sortedFilteredProducts,
    isLoading,
    hasMore,
  };

};

export default Shop;